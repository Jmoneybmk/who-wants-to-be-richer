/* =========================================================
   FIREBASE SYNC MODULE — Who Wants to Be a Millionaire
   Multiplayer sync: lobby, player roles, full game-state mirror,
   intent system, audience voting, presence/disconnect detection.

   SETUP (one-time, ~10 min):
     1. https://console.firebase.google.com → Add project.
     2. Click </> "Add app" (web). Register name. Skip hosting.
     3. Build → Realtime Database → Create Database → Test mode.
        COPY the database URL from the top of that page —
        looks like: https://your-project-default-rtdb.firebaseio.com/
     4. Click the gear icon → Project Settings → scroll to your web
        app's SDK setup → copy the firebaseConfig object.
     5. Paste below, replacing the empty firebaseConfig.
        IMPORTANT: make sure databaseURL is included AND uncommented.
     6. In Realtime Database → Rules tab, set:
          { "rules": { ".read": true, ".write": true } }
        Click Publish.
     7. Save firebase.js. Done.

   For viewer access from phones, you need to serve via http (not file://).
   Easiest: Netlify Drop (drag folder to https://app.netlify.com/drop) or
   `python -m http.server 8000` and use your local IP.
   ========================================================= */

window.firebaseSync = (function () {

  // ============================================================
  // PASTE YOUR FIREBASE CONFIG HERE (uncomment all lines)
  // ============================================================
  const firebaseConfig = {
    apiKey: "AIzaSyBrUqHwmxCGwkk4ElEeazBpa_yMZqLVGxI",
    authDomain: "millionaire-game-59cef.firebaseapp.com",
    databaseURL: "https://millionaire-game-59cef-default-rtdb.firebaseio.com",
    projectId: "millionaire-game-59cef",
    storageBucket: "millionaire-game-59cef.firebasestorage.app",
    messagingSenderId: "895106834178",
    appId: "1:895106834178:web:7c363fa0a4b0371001ac1b"
  };
  // ============================================================

  let db = null;
  let currentRoomId = null;
  let roomRef = null;
  let lastError = null;
  let myViewerId = null; // for viewer-side use
  let listeners = []; // for cleanup

  function isConfigured() { return !!(firebaseConfig.databaseURL && firebaseConfig.apiKey); }

  function getStatus() {
    return {
      configured: isConfigured(),
      hasApiKey: !!firebaseConfig.apiKey,
      hasDatabaseURL: !!firebaseConfig.databaseURL,
      databaseURL: firebaseConfig.databaseURL || '(missing)',
      sdkLoaded: !!(window.firebase && window.firebase.database),
      dbInitialized: !!db,
      lastError: lastError ? (lastError.message || String(lastError)) : null,
      currentRoomId
    };
  }
  function getLastError() { return lastError; }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error('Failed: ' + src));
      document.head.appendChild(s);
    });
  }

  async function loadFirebaseSDK() {
    if (window.firebase && window.firebase.database) return true;
    try {
      await loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js');
      return true;
    } catch (e) { console.warn('[firebaseSync] SDK load failed', e); return false; }
  }

  async function init() {
    lastError = null;
    if (!isConfigured()) {
      lastError = new Error('firebase.js missing apiKey or databaseURL. Make sure all config lines are uncommented.');
      console.warn('[firebaseSync]', lastError.message);
      return false;
    }
    const loaded = await loadFirebaseSDK();
    if (!loaded) {
      lastError = new Error('Failed to load Firebase SDK. Check internet/firewall.');
      return false;
    }
    try {
      if (!window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig);
      db = window.firebase.database();
      console.log('[firebaseSync] init complete');
      return true;
    } catch (e) { lastError = e; console.error('[firebaseSync] init failed:', e); return false; }
  }

  function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }

  /* ===================== HOST SIDE ===================== */

  // Host: create a fresh room (called from main menu)
  async function createRoom() {
    lastError = null;
    if (!db) { const ok = await init(); if (!ok) return null; }
    currentRoomId = generateRoomCode();
    try {
      roomRef = db.ref('rooms/' + currentRoomId);
      await roomRef.set({
        meta: { created: Date.now(), phase: 'lobby' },
        viewers: {},
        game: null,
        intents: {},
        audience: { active: false }
      });
      // Auto-cleanup after 4 hours
      setTimeout(() => { try { roomRef && roomRef.remove(); } catch (e) { } }, 4 * 60 * 60 * 1000);
      console.log('[firebaseSync] room created:', currentRoomId);
      return currentRoomId;
    } catch (e) {
      lastError = e;
      console.error('[firebaseSync] createRoom write failed:', e);
      console.error('[firebaseSync] Most likely cause: Realtime Database rules denying writes. Set rules to: { "rules": { ".read": true, ".write": true } }');
      currentRoomId = null; roomRef = null;
      return null;
    }
  }

  // Host: write meta block (mode, theme, phase, etc.)
  async function setMeta(meta) {
    if (!roomRef) return;
    try { await roomRef.child('meta').update(meta); } catch (e) { console.warn('setMeta failed', e); }
  }

  // Host: write entire game-state snapshot (called every state change)
  async function setGameState(gameState) {
    if (!roomRef) return;
    try { await roomRef.child('game').set(gameState); } catch (e) { console.warn('setGameState failed', e); }
  }

  // Host: assign a viewer's role (player slot or audience)
  async function setViewerRole(viewerId, role, slot, playerName) {
    if (!roomRef) return;
    try {
      const update = { role };
      if (role === 'player') {
        update.playerSlot = slot;
        update.eliminated = false;
        update.correctTiers = [];
        if (playerName) update.name = playerName; // host can rename
      } else {
        update.playerSlot = null;
      }
      await roomRef.child('viewers/' + viewerId).update(update);
    } catch (e) { console.warn('setViewerRole failed', e); }
  }

  // Host: add a "local" player (sitting at PC, not from a phone)
  async function addLocalPlayer(name, slot) {
    if (!roomRef) return null;
    const localId = 'local_' + slot;
    try {
      await roomRef.child('viewers/' + localId).set({
        name, role: 'player', playerSlot: slot,
        connected: true, isLocal: true,
        eliminated: false, correctTiers: [],
        lastSeen: Date.now()
      });
      return localId;
    } catch (e) { console.warn('addLocalPlayer failed', e); return null; }
  }

  // Host: update player tally / elimination
  async function updatePlayer(viewerId, fields) {
    if (!roomRef) return;
    try { await roomRef.child('viewers/' + viewerId).update(fields); } catch (e) { }
  }

  // Host: subscribe to viewers list (for lobby and during game)
  function subscribeToViewers(callback) {
    if (!roomRef) return null;
    const ref = roomRef.child('viewers');
    const handler = (snap) => callback(snap.val() || {});
    ref.on('value', handler);
    listeners.push({ ref, handler });
    return () => { try { ref.off('value', handler); } catch (e) { } };
  }

  // Host: subscribe to incoming intents from players
  function subscribeToIntents(callback) {
    if (!roomRef) return null;
    const ref = roomRef.child('intents');
    const handler = (snap) => {
      const intents = snap.val() || {};
      Object.keys(intents).forEach(intentId => {
        const intent = intents[intentId];
        callback(intent, intentId);
      });
    };
    ref.on('child_added', handler);
    listeners.push({ ref, handler, type: 'child_added' });
    return () => { try { ref.off('child_added', handler); } catch (e) { } };
  }

  // Host: clear an intent after processing
  async function consumeIntent(intentId) {
    if (!roomRef) return;
    try { await roomRef.child('intents/' + intentId).remove(); } catch (e) { }
  }

  // Host: subscribe to audience votes
  function subscribeToAudienceVotes(callback) {
    if (!roomRef) return null;
    const ref = roomRef.child('audience/votes');
    const handler = (snap) => callback(snap.val() || {});
    ref.on('value', handler);
    listeners.push({ ref, handler });
    return () => { try { ref.off('value', handler); } catch (e) { } };
  }

  // Host: open audience voting (writes audience config)
  async function setAudience(audienceState) {
    if (!roomRef) return;
    try { await roomRef.child('audience').set(audienceState); } catch (e) { }
  }

  // Host: clear audience votes (start of new vote)
  async function clearAudienceVotes() {
    if (!roomRef) return;
    try { await roomRef.child('audience/votes').set({}); } catch (e) { }
  }

  async function closeRoom() {
    listeners.forEach(l => { try { l.ref.off(l.type || 'value', l.handler); } catch (e) { } });
    listeners = [];
    if (roomRef) { try { await roomRef.remove(); } catch (e) { } }
    roomRef = null; currentRoomId = null;
  }

  /* ===================== VIEWER SIDE ===================== */

  // Viewer: join an existing room
  async function joinRoomAsViewer(roomId, name) {
    if (!db) { const ok = await init(); if (!ok) return null; }
    const ref = db.ref('rooms/' + roomId);
    const snap = await ref.once('value');
    if (!snap.exists()) return null;
    // Generate viewer ID
    myViewerId = 'v_' + Math.random().toString(36).substring(2, 12);
    const viewerRef = ref.child('viewers/' + myViewerId);
    try {
      await viewerRef.set({
        name, role: 'unassigned',
        connected: true, isLocal: false,
        eliminated: false, correctTiers: [],
        lastSeen: Date.now()
      });
      // Auto-mark disconnected on tab close
      viewerRef.child('connected').onDisconnect().set(false);
      // Heartbeat
      const heartbeat = setInterval(() => {
        viewerRef.child('lastSeen').set(Date.now());
      }, 5000);
      window.addEventListener('beforeunload', () => clearInterval(heartbeat));
      currentRoomId = roomId;
      roomRef = ref;
      return { ref, viewerId: myViewerId };
    } catch (e) { console.warn('joinRoomAsViewer failed', e); return null; }
  }

  // Viewer: subscribe to whole room (for live updates)
  function subscribeToRoomFull(callback) {
    if (!roomRef) return null;
    const handler = (snap) => callback(snap.val());
    roomRef.on('value', handler);
    listeners.push({ ref: roomRef, handler });
    return () => { try { roomRef.off('value', handler); } catch (e) { } };
  }

  // Viewer: submit an intent (player action) to host
  async function submitIntent(type, payload) {
    if (!roomRef || !myViewerId) return false;
    try {
      const intentId = 'i_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      await roomRef.child('intents/' + intentId).set({
        from: myViewerId,
        type, payload: payload || null,
        ts: Date.now()
      });
      return true;
    } catch (e) { console.warn('submitIntent failed', e); return false; }
  }

  // Viewer: cast an audience vote
  async function castAudienceVote(choice) {
    if (!roomRef || !myViewerId) return false;
    try {
      const snap = await roomRef.child('viewers/' + myViewerId + '/name').once('value');
      const name = snap.val() || 'Anon';
      await roomRef.child('audience/votes/' + myViewerId).set({
        name, choice, ts: Date.now()
      });
      return true;
    } catch (e) { return false; }
  }

  // Viewer: check if a room exists (for code-entry validation)
  async function roomExists(roomId) {
    if (!db) { const ok = await init(); if (!ok) return false; }
    try {
      const snap = await db.ref('rooms/' + roomId).once('value');
      return snap.exists();
    } catch (e) { return false; }
  }

  return {
    isConfigured, getStatus, getLastError, init,
    // host
    createRoom, setMeta, setGameState, setViewerRole, addLocalPlayer,
    updatePlayer, subscribeToViewers, subscribeToIntents, consumeIntent,
    subscribeToAudienceVotes, setAudience, clearAudienceVotes, closeRoom,
    getRoomId: () => currentRoomId,
    getRoomRef: () => roomRef,
    // viewer
    joinRoomAsViewer, subscribeToRoomFull, submitIntent, castAudienceVote, roomExists,
    getMyViewerId: () => myViewerId
  };
})();
