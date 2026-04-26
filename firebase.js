/* =========================================================
   FIREBASE SYNC MODULE — Who Wants to Be a Millionaire
   Handles viewer broadcasting and live vote collection.

   SETUP (one-time, ~10 min):
     1. Go to https://console.firebase.google.com/
     2. Click "Add project" → name it (e.g., "millionaire-game") → Continue.
        You can disable Google Analytics for this project. Skip if asked.
     3. In the project overview, click the "</>" web icon to "Add an app".
        Register name: "Millionaire Game". Skip hosting. Click Register.
     4. Firebase shows a config object that looks like:
          const firebaseConfig = {
            apiKey: "AIza...",
            authDomain: "your-project.firebaseapp.com",
            databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
            projectId: "your-project",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "...",
            appId: "1:...:web:..."
          };
        COPY THE databaseURL — you need it below. If you don't see
        databaseURL, skip to step 5 first, then come back.
     5. In the Firebase console LEFT SIDEBAR: Build → Realtime Database →
        "Create Database" → pick any location → "Start in test mode"
        (gives free read/write for 30 days — extend or tighten rules later).
     6. Paste the entire firebaseConfig object below, replacing the empty one.
     7. Save the file. Done.

   Without setup: Ask the Audience still works (AI voters only).
   With setup: viewers can scan QR code and vote live.
   ========================================================= */

window.firebaseSync = (function () {
  // ============================================================
  // PASTE YOUR FIREBASE CONFIG HERE (or leave empty to disable)
  // ============================================================
  const firebaseConfig = {
    apiKey: "AIzaSyBrUqHwmxCGwkk4ElEeazBpa_yMZqLVGxI",
    authDomain: "millionaire-game-59cef.firebaseapp.com",
    databaseURL: "https://millionaire-game-59cef-default-rtdb.firebaseio.com/",
    projectId: "millionaire-game-59cef",
    storageBucket: "millionaire-game-59cef.firebasestorage.app",
    messagingSenderId: "895106834178",
    appId: "1:895106834178:web:7c363fa0a4b0371001ac1b"
  };
  // ============================================================

  let db = null;
  let currentRoomId = null;
  let roomRef = null;
  let voteListener = null;
  let onVoteUpdate = null;
  let lastError = null;

  function isConfigured() {
    return !!(firebaseConfig.databaseURL && firebaseConfig.apiKey);
  }

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

  async function loadFirebaseSDK() {
    if (window.firebase && window.firebase.database) return true;
    try {
      // Load Firebase compat SDK (simpler than modular for a single-file app)
      await loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js');
      return true;
    } catch (e) {
      console.warn('Firebase SDK load failed', e);
      return false;
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async function init() {
    lastError = null;
    if (!isConfigured()) {
      lastError = new Error('Firebase config is missing apiKey or databaseURL. Check firebase.js — make sure all lines in firebaseConfig are UNCOMMENTED (no // prefix).');
      console.warn('[firebaseSync]', lastError.message);
      return false;
    }
    console.log('[firebaseSync] config OK, loading SDK...');
    const loaded = await loadFirebaseSDK();
    if (!loaded) {
      lastError = new Error('Failed to load Firebase SDK from gstatic.com. Check internet/firewall.');
      console.warn('[firebaseSync]', lastError.message);
      return false;
    }
    console.log('[firebaseSync] SDK loaded, initializing app...');
    try {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      db = window.firebase.database();
      console.log('[firebaseSync] init complete. databaseURL =', firebaseConfig.databaseURL);
      return true;
    } catch (e) {
      lastError = e;
      console.error('[firebaseSync] init failed:', e);
      return false;
    }
  }

  // Generate a 6-char room code
  function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  // Host: create a new room
  async function createRoom() {
    lastError = null;
    if (!db) {
      const ok = await init();
      if (!ok) return null;
    }
    currentRoomId = generateRoomCode();
    try {
      roomRef = db.ref('rooms/' + currentRoomId);
      console.log('[firebaseSync] writing initial room data to', 'rooms/' + currentRoomId);
      await roomRef.set({
        created: Date.now(),
        state: 'waiting',
        question: null,
        votingOpen: false,
        votes: {}
      });
      console.log('[firebaseSync] room created:', currentRoomId);
    } catch (e) {
      lastError = e;
      console.error('[firebaseSync] createRoom write failed:', e);
      console.error('[firebaseSync] Most likely cause: Realtime Database rules are denying writes. In Firebase Console → Realtime Database → Rules, set: { "rules": { ".read": true, ".write": true } } (test mode).');
      currentRoomId = null;
      roomRef = null;
      return null;
    }
    setTimeout(() => { try { roomRef && roomRef.remove(); } catch (e) { } }, 4 * 60 * 60 * 1000);
    return currentRoomId;
  }

  // Host: broadcast current question to viewers
  async function broadcastQuestion(question, tierIdx) {
    if (!roomRef) return;
    try {
      await roomRef.update({
        state: 'question',
        question: {
          q: question.q,
          a: question.a,
          tier: tierIdx + 1
        },
        votingOpen: false,
        votes: {} // reset votes
      });
    } catch (e) { console.warn('broadcast failed', e); }
  }

  // Host: open voting (Ask the Audience lifeline activated)
  async function openVoting() {
    if (!roomRef) return;
    try {
      await roomRef.update({ votingOpen: true, votes: {} });
    } catch (e) { }
  }

  // Host: close voting
  async function closeVoting() {
    if (!roomRef) return;
    try {
      await roomRef.update({ votingOpen: false });
    } catch (e) { }
  }

  // Host: show the result (correct/wrong) to viewers
  async function broadcastResult(correctIdx) {
    if (!roomRef) return;
    try {
      await roomRef.update({ state: 'result', correctIdx: correctIdx });
    } catch (e) { }
  }

  // Host: tell viewers the game ended
  async function broadcastGameEnd() {
    if (!roomRef) return;
    try {
      await roomRef.update({ state: 'ended' });
    } catch (e) { }
  }

  // Host: subscribe to viewer votes for live tally
  function subscribeToVotes(callback) {
    if (!roomRef) return;
    onVoteUpdate = callback;
    if (voteListener) roomRef.off('value', voteListener);
    voteListener = roomRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const votes = data.votes || {};
      const tally = [0, 0, 0, 0];
      const voters = Object.values(votes);
      voters.forEach(v => {
        if (typeof v.choice === 'number' && v.choice >= 0 && v.choice <= 3) {
          tally[v.choice]++;
        }
      });
      if (onVoteUpdate) onVoteUpdate({ tally, voterCount: voters.length, voters });
    });
  }

  // Host: teardown
  async function closeRoom() {
    if (voteListener && roomRef) { try { roomRef.off('value', voteListener); } catch (e) { } }
    voteListener = null;
    if (roomRef) {
      try { await roomRef.remove(); } catch (e) { }
    }
    roomRef = null;
    currentRoomId = null;
  }

  /* ---------- Viewer-side functions (used by viewer.html) ---------- */

  async function joinRoom(roomId) {
    if (!db) {
      const ok = await init();
      if (!ok) return null;
    }
    const ref = db.ref('rooms/' + roomId);
    const snapshot = await ref.once('value');
    if (!snapshot.exists()) return null;
    return ref;
  }

  async function castVote(ref, voterId, voterName, choice) {
    try {
      await ref.child('votes/' + voterId).set({
        name: voterName,
        choice: choice,
        ts: Date.now()
      });
      return true;
    } catch (e) { return false; }
  }

  return {
    isConfigured,
    getStatus,
    getLastError,
    init,
    createRoom,
    broadcastQuestion,
    openVoting,
    closeVoting,
    broadcastResult,
    broadcastGameEnd,
    subscribeToVotes,
    closeRoom,
    joinRoom,
    castVote,
    getRoomId: () => currentRoomId
  };
})();
