# Who Wants to Be a Millionaire — Internet Edition

A browser-based, multi-device game show modeled on the classic, with internet-themed lifelines and live audience voting from phones.

---

## Table of Contents

1. [What It Does](#what-it-does)
2. [File Structure](#file-structure)
3. [Running the Game](#running-the-game)
4. [Firebase Setup (Required for Multiplayer)](#firebase-setup-required-for-multiplayer)
5. [Game Modes](#game-modes)
6. [Lifelines](#lifelines)
7. [The Lobby System (How Phone Players Join)](#the-lobby-system)
8. [In-Game Host Controls](#in-game-host-controls)
9. [Pack Design Philosophy](#pack-design-philosophy)
10. [Adding Questions](#adding-questions)
11. [Adding a New Theme Pack](#adding-a-new-theme-pack)
12. [Code Walkthrough](#code-walkthrough)
13. [Audio System](#audio-system)
14. [Common Modifications](#common-modifications)
15. [Upgrade Ideas](#upgrade-ideas)
16. [Known Quirks](#known-quirks)
17. [Troubleshooting](#troubleshooting)

---

## What It Does

Local single-player Millionaire that scales up to:
- Multiple phone players in **Co-op** or **Versus** mode, joined via QR code
- A live audience that votes from their phones during "Ask the Audience"
- A host PC that displays everything for streaming
- A "Host Mode" overlay that gives the host manual control over any sub-mode (timer, judging, etc.)

Phones aren't required. Single-player works offline. Multiplayer needs Firebase set up once (~10 min, free forever for this scale).

---

## File Structure

```
.
├── index.html      # Main game (host PC view)
├── viewer.html     # Phone-side page (what viewers/players see when they scan QR)
├── audio.js        # Web Audio synthesis (BGM + 14 SFX)
├── firebase.js     # Multiplayer sync layer (lobby, intents, audience votes)
├── questions.js    # All question/answer data
└── README.md       # This file
```

All six files must live in the **same folder**. `index.html` loads `audio.js`, `firebase.js`, and `questions.js`. `viewer.html` loads `firebase.js`.

---

## Running the Game

### Option 1 — Single player on one device
Double-click `index.html`. Saves, scores, and settings persist via `localStorage`. No network needed.

### Option 2 — Multiplayer (phones joining via QR)
You need to serve the files over HTTP, not `file://`. Phones can't reach `file://` paths on your computer.

**Easiest free options:**

- **Same WiFi only** — run a local server on your PC and access via your local IP:
  ```bash
  python -m http.server 8000
  # then open http://YOUR_LOCAL_IP:8000/ on your PC
  # find your IP via `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  # phones on the same WiFi can scan the QR
  ```
- **Public (works for online viewers)** — drag your folder to https://app.netlify.com/drop. Free, no account needed for the basic tier. You get a public URL like `https://your-game.netlify.app/`. QR works for anyone in the world.
- **GitHub Pages** — push folder to a repo, enable Pages in settings.
- **Tunnel** — `cloudflared tunnel --url http://localhost:8000` gives you a temporary public URL without hosting setup.

---

## Firebase Setup (Required for Multiplayer)

Without this, the game still works for single-player and local team modes (everyone sharing one screen). With it, phone players can join, audience can vote live, and viewer count shows in the lobby.

**One-time setup, ~10 minutes:**

1. Go to https://console.firebase.google.com/ → **Add project** → name it (anything) → **Continue**. Skip Analytics.
2. Click **</>** ("Add app" web icon) → register name → skip hosting → **Register**.
3. **Build → Realtime Database** in the left sidebar → **Create Database** → any location → **Start in test mode** → **Enable**.
4. At the top of the database page, copy the URL — looks like `https://your-project-default-rtdb.firebaseio.com/`. **You need this.**
5. Open the gear icon → **Project Settings** → scroll to "Your apps" → copy the entire `firebaseConfig` object.
6. Open `firebase.js`. Find the `firebaseConfig` block at the top. **Paste your config**, replacing the empty/commented one. **Make sure every line is uncommented (no `//` prefix), and `databaseURL` is included.**
7. In Realtime Database → **Rules** tab, set rules to:
   ```json
   { "rules": { ".read": true, ".write": true } }
   ```
   Click **Publish**.
8. Save `firebase.js`. Reload the game. You should see a QR + 6-character room code on the main menu, and the message changes from "Connecting" or "Failed" to a working lobby.

If anything fails, press F12 → Console. Messages prefixed `[firebaseSync]` will tell you exactly what's wrong (most common: `databaseURL` missing, or rules denying writes).

---

## Game Modes

After clicking **Play**, you choose a mode:

| Mode | Players | Pot | Loss Behavior |
|---|---|---|---|
| **Single Player** | 1 | Yours | Drop to last safety net (or $0 if safety nets off) |
| **Host Mode** | 0–4 | Variable | Manual judgment — host runs the whole show |
| **Team Co-op** | 2–4 | **Shared, split equally including eliminated players** | Wrong answer eliminates the active player; team continues with remaining; if all eliminated, game ends |
| **Versus** | 2–4 | **Shared, but only survivors get a share** | Last one standing takes the full pot. If multiple survive to Q15, pot splits **proportionally by correct-answer count** |

### Mode-specific rules

- **Wrong answer in team modes** → that player is eliminated, next player gets a **fresh question from the same tier**, game continues
- **Turn order**: Random per round. Once everyone in the rotation has played, the rotation reshuffles (no repeats until everyone's had a turn)
- **Safety nets toggle** (on theme select screen): OFF = after every correct answer in single-player, you're prompted "Continue or Walk Away?" — wrong answer with safety nets off = $0
- **Host Mode** is a separate mode that overrides the others — host clicks every button manually (start timer, mark correct/wrong, advance, etc.)

---

## Lifelines

All lifelines: **one use per game**, **shared in team modes**.

| Lifeline | What it does |
|---|---|
| **50:50** | Hides 2 wrong answers |
| **Google (20s)** | Opens a blank Google tab on host PC, 20-second timer. Phone players verbally tell host what to search |
| **Ask AI (20s)** | Opens blank ChatGPT tab on host PC, same as above |
| **Ask the Audience** | Hard 10-second vote. 10 AI voters with mixed accuracies (~53% mean) + every connected viewer can vote from their phone. Results show as classic-style percentage bars after the timer expires |

The browser may not be able to auto-close the Google/Ask AI tabs (cross-origin restriction). The game compensates: when the lifeline timer hits 0, the host shows a **RESUME** modal with a loud chime. The question timer stays paused until the player clicks RESUME, so no time is lost.

---

## The Lobby System

The QR + 6-character room code appears on the **main menu**, before any game starts. Viewers scan or type the code to join.

### How a viewer joins
1. Scan QR (or visit `viewer.html` and type the 6-char code manually)
2. Enter their name
3. Land in the lobby — they wait for the host to start a game

### What viewers can become

After the host clicks **Play → mode → theme**, they hit the **Roster screen**:

For each player slot, the host picks one of:
- **Local (at PC)** — the host types a name; that player sits at the host's keyboard
- **From Phone** — picks a connected viewer's name from a dropdown; that player plays from their phone

Anyone not picked stays as **audience** — they see questions on their phone (read-only) and vote during Ask the Audience.

### What phone players control during the game

- Tap an answer to select it
- Tap **FINAL ANSWER** → confirmation screen (YES/NO) appears on phone
- Trigger lifelines (50/50, Google, Ask AI, Ask the Audience)
- Walk away

For Google / Ask AI lifelines, the **tab opens on the host PC**. Phone players verbally tell the host what to search. The 20-second timer applies.

### Audience phones during the game

- See the current question + answers (read-only)
- See whose turn it is
- During Ask the Audience: get a 10-second voting screen with tap-to-vote buttons
- Eliminated players keep watching (but don't vote — eliminated = audience role)

---

## In-Game Host Controls

The side panel shows a **Players** panel listing every player. For each non-eliminated player you'll see two buttons:

### REPLACE
Click → modal appears with a list of connected audience members. Pick one. They take over the slot, **inheriting all the original player's correct-answer tally**. The replaced player moves to audience role.

Use this when:
- A phone player loses connection (you'll see "⚠ OFFLINE" next to their name)
- A player needs to step away mid-game
- Anyone else: drop a player and bring in someone fresh

### TAKE OVER
Click → enter your name (defaults to "Host") → you take the slot as a **local** player at the host PC. You inherit the tally. The previous phone-player goes back to audience.

Use this when there's no audience member to replace from, or you just want to take over directly.

---

## Pack Design Philosophy

Every theme pack should target **100 questions** total, spread across 5 difficulty groups:

| Difficulty | Tiers | Total Questions | Per-Tier |
|---|---|---|---|
| **Very Easy** | 1, 2, 3 | 20 | 6 / 7 / 7 |
| **Easy** | 4, 5, 6 | 20 | 6 / 7 / 7 (Tier 5 = ★ safety net) |
| **Medium** | 7, 8, 9, 10 | 20 | 5 / 5 / 5 / 5 (Tier 10 = ★ safety net) |
| **Hard** | 11, 12, 13 | 20 | 6 / 7 / 7 |
| **Extreme** | 14, 15 | 20 | 10 / 10 |

### Why this distribution

- **20 per difficulty group** = real replay variety
- **Even split within a group** prevents the "always Q14" syndrome at the top
- **Top tiers get the largest pools** (10 each) because reaching them is rare — when a player hits Q15, you don't want it to feel scripted
- **Medium gets 4 tiers × 5 each** because it's the longest gameplay stretch and needs steady pacing

The engine works with any count ≥ 2 per tier. The 100/20-per-group target is the **quality bar**, not a hard requirement. Smaller packs work, they just have less replay value.

### Difficulty by tier (writing guide)

Use this when writing or auditing questions. The test: **"Would an average adult immediately know this?"**

#### 🟢 Very Easy (Q1–3)
Should never make a player sweat. Wrong answers should be almost comically wrong.
- **Tier 1 ($100)** — A child could answer this. Example: "How many days in a week?"
- **Tier 2 ($200)** — Anyone in the topic knows it. Example: "Which planet is closest to the Sun?"
- **Tier 3 ($300)** — One step deeper than absolute basics. Example: "Largest ocean on Earth?"

#### 🟡 Easy (Q4–6)
Player needs to actually think a little.
- **Tier 4 ($500)** — Standard fan knowledge. Example: "In My Hero Academia, what's Izuku's hero name?"
- **Tier 5 ★ ($1,000)** — Solid general knowledge. First safety net. "Who wrote Romeo and Juliet?"
- **Tier 6 ($2,000)** — Slightly deeper recall. "Who wrote Dragon Ball?"

#### 🟠 Medium (Q7–10)
The longest stretch. Tier 10 is the second safety net.
- **Tier 7 ($4,000)** — Engaged-fan knowledge. Someone who's read/watched the full work knows it.
- **Tier 8 ($8,000)** — Detail-level recall. Specific names, dates, mechanics.
- **Tier 9 ($16,000)** — Specialized knowledge. Subtle mechanic, secondary character.
- **Tier 10 ★ ($32,000)** — Hardcore fan territory.

#### 🔴 Hard (Q11–13)
Top half. Players will lean on lifelines here.
- **Tier 11 ($64,000)** — Expert territory. Facts only serious fans retain.
- **Tier 12 ($125,000)** — Deep cuts. Obscure characters, specific story events.
- **Tier 13 ($250,000)** — Scholarly / encyclopedic. Real niche stuff.

#### 🟣 Extreme (Q14–15)
The endgame. Largest pools (10 each) so they feel fresh on replay.
- **Tier 14 ($500,000)** — Very few people know this without looking it up. Production history, obscure canon details, hard puzzles.
- **Tier 15 ($1,000,000)** — The pack-defining question. Must have a clean, unambiguous answer. Avoid contested or recent-event questions. Verify with multiple sources.

### Rules every tier follows

1. **One unambiguously correct answer.** If two could be defended, rewrite.
2. **Plausible distractors.** Wrong answers belong to the same category as the right one. "Banana, Shakespeare, 42, Tokyo" = bad. "Picasso, Van Gogh, Da Vinci, Michelangelo" = good.
3. **Consistent tone within a tier.** Don't mix 30-word and 5-word questions in the same difficulty.
4. **Verify facts.** Especially Hard and Extreme. One wrong "correct" answer poisons trust in the whole pack.

### Distractor quality scales with difficulty

At Very Easy, silly distractors are fine. At Extreme, distractors must be **genuinely plausible**. If you're asking about a character's ultimate form, the three wrong options should be real forms from that universe, not made-up nonsense.

---

## Adding Questions

All question data lives in **`questions.js`**. The format:

```js
{
  q: "Question text?",
  a: ["Option A", "Option B", "Option C", "Option D"],
  correct: 2  // zero-indexed: 0=A, 1=B, 2=C, 3=D
}
```

To add one question, find the right tier in the right pack and add another object to the array:

```js
4: [
  { q: "Existing question?", a: [...], correct: 1 },
  // NEW:
  { q: "Your new question?", a: ["Wrong", "Right", "Wrong", "Wrong"], correct: 1 },
],
```

### Pre-commit checklist

- `q` ends with a `?`
- `a` has **exactly 4** items
- `correct` is `0`, `1`, `2`, or `3`
- `a[correct]` is genuinely the right answer (most common bug)
- Distractors are plausible, same category as the answer
- The question fits the tier's difficulty (see guide above)
- **Comma after** the closing `}` if it's not the last item in the array
- No curly quotes (`"` `"`) — only straight ones (`"`)

---

## Adding a New Theme Pack

The theme-select menu auto-populates from `QUESTION_PACKS`. Add a new pack and a button appears.

### Full pack template

```js
window.QUESTION_PACKS = {
  // ... existing packs ...

  my_pack_key: {
    name: "Display Name",
    description: "Short blurb shown on theme select screen.",
    difficulty_notes: "Optional second line — e.g. skews toward modern Z and Super",
    questions: {
      // VERY EASY (Tiers 1-3, 20 questions total)
      1:  [ /* 6 questions */ ],
      2:  [ /* 7 questions */ ],
      3:  [ /* 7 questions */ ],
      // EASY (Tiers 4-6, 20 questions total — Tier 5 is safety net)
      4:  [ /* 6 questions */ ],
      5:  [ /* 7 questions */ ],
      6:  [ /* 7 questions */ ],
      // MEDIUM (Tiers 7-10, 20 questions total — Tier 10 is safety net)
      7:  [ /* 5 questions */ ],
      8:  [ /* 5 questions */ ],
      9:  [ /* 5 questions */ ],
      10: [ /* 5 questions */ ],
      // HARD (Tiers 11-13, 20 questions total)
      11: [ /* 6 questions */ ],
      12: [ /* 7 questions */ ],
      13: [ /* 7 questions */ ],
      // EXTREME (Tiers 14-15, 20 questions total)
      14: [ /* 10 questions */ ],
      15: [ /* 10 questions */ ],
    }
  },
};
```

- **Key** (`my_pack_key`) — internal ID. Lowercase, no spaces. Used in saved scores.
- **Name** — display label. Anything.
- **`description`** — optional. Short blurb under the name on theme select.
- **`difficulty_notes`** — optional. Second line about scope/range.
- **All 15 tiers must be populated.** Empty tiers crash the game when the player reaches them.

Save → reload → the new theme appears.

---

## Code Walkthrough

### `index.html` (main game)

| Section | Purpose |
|---|---|
| `<style>` | All CSS, with CSS variables for theming |
| `<script src="...">` | Loads `questions.js`, `audio.js`, `firebase.js` |
| Constants | `PRIZE_LADDER`, `SAFETY_NET_TIERS`, `TIMER_FOR_TIER`, `LIFELINE_*_SECONDS`, `AI_VOTER_*` |
| State | One big `state` object. Every mutation flows through flow functions, then `render()` |
| Persistence | Layered: `window.storage` (Claude env) → `localStorage` (any browser) → in-memory |
| Voice | `speak()` / `stopSpeaking()`. Gated by `state.screen === 'game'` |
| Question picking | Random from tier pool, excludes already-used |
| Game flow | `startNewGame`, `loadQuestionForCurrentTier`, `selectAnswer`, `revealAndResolve`, `endGame` |
| Timer | `startTimer`, warning pulse last 10s, distinct buzzer at 0 |
| Lifelines | `useFiftyFifty`, `useGoogleSearch`, `useAskAI`, `useAudience`. Audience uses 10s hard timer |
| **Broadcast + Intents** | `buildGameStateForBroadcast()`, `broadcastGameState()`, `setupIntentListener()`, `handleIntent()` — sync to/from phones |
| Render | Dispatches to screen renderers (`renderMenu`, `renderModeSelect`, `renderRoster`, `renderGame`, `renderResult`, etc.) |
| Modal renderers | `renderFinalConfirmModal`, `renderLifelineEndModal`, `renderContinueModal`, `renderAudienceModal`, `renderReplaceModal` |
| Event wiring | Every interactive element has `data-action="..."` → routed in `handleAction()` |
| Cleanup | `fullCleanup()` resets game state but **keeps the lobby room alive** for the next game |
| Init | `setupLobbyRoom()` creates the Firebase room on app load (so QR shows from main menu) |

### `viewer.html` (phone-side)

Mirrors the host's broadcast game state. Determines the user's role (active player / inactive player / audience / eliminated) and renders accordingly. Phone-side actions submit "intents" via Firebase, which the host receives, validates, and applies.

### `firebase.js`

Wraps Firebase Realtime Database. Exposes a clean API:
- **Host**: `createRoom`, `setMeta`, `setGameState`, `setViewerRole`, `subscribeToViewers`, `subscribeToIntents`, `consumeIntent`, `setAudience`, `subscribeToAudienceVotes`
- **Viewer**: `joinRoomAsViewer`, `subscribeToRoomFull`, `submitIntent`, `castAudienceVote`, `roomExists`
- **Both**: `isConfigured`, `getStatus`, `getLastError`, `init`

Falls back gracefully if not configured — game runs as before, just no QR / no live audience.

### `audio.js`

Web Audio synthesis. ~14 named SFX functions + ambient BGM. Edit any function to retune. See [Audio System](#audio-system) for the full sound list.

### `questions.js`

Pure data. Just `window.QUESTION_PACKS = {...}`.

---

## Audio System

All synthesized via Web Audio. No external files.

### Architecture
```
AudioContext
 └── masterGain (global volume; 0 when muted)
      ├── per-SFX nodes (created and disposed per effect)
      └── bgmGain → filter → 4 detuned oscillators + LFO shimmer
```

### Named SFX

| Function | When | Character |
|---|---|---|
| `click()` | Nav buttons | Short square blip |
| `select()` | Selecting an answer | Two-tone chime |
| `finalAnswerTension()` | Opening "Final Answer?" modal | Rising low drone |
| `correct()` | Reveals correct | Ascending major arpeggio |
| `wrong()` | Reveals wrong | Descending minor + buzz |
| `tierAdvance()` | Moving up a tier | Quick rising scale |
| `warning()` | Each of last 10 seconds | Heartbeat pulse |
| `timerZeroBuzzer()` | Question timer hits 0 | Harsh two-stage buzzer |
| `timeUp()` | Reveal phase after timeout | Sustained sawtooth + noise |
| `win()` | Winning $1M | Big fanfare + held chord |
| `lifelineActivate()` | Triggering any lifeline | Ascending whoosh |
| `lifelineEnd()` | Lifeline timer hits 0 | Loud 4-note alert |
| `walkAway()` | Walking away | Bittersweet descending fifth |
| `voteBlip()` | Each AI vote during Ask the Audience | Soft tone |
| `playerEliminated()` | Team mode wrong answer | Sub-bass slam |
| `startBGM` / `stopBGM` | Game start / end | Ambient A-minor drone |

### Swapping to real audio files

Replace any function with file playback:
```js
correct() {
  if (!this.enabled) return;
  const a = new Audio('sounds/correct.mp3');
  a.volume = 0.6;
  a.play().catch(() => {});
}
```

For BGM use `<audio loop>`. Synthesized and file-based can mix freely.

---

## Common Modifications

### Change prize ladder
```js
const PRIZE_LADDER = [500, 1000, 2500, ...]; // must stay 15 numbers
```

### Change safety net positions (zero-indexed)
```js
const SAFETY_NET_TIERS = [4, 9];      // default: Q5, Q10
const SAFETY_NET_TIERS = [2, 6, 10];  // alt: Q3, Q7, Q11
```

### Change timer durations
```js
const TIMER_FOR_TIER = (tierIdx) => {
  if (tierIdx <= 4) return 45;   // Q1-5
  if (tierIdx <= 9) return 60;   // Q6-10
  return 90;                      // Q11-15
};
```

### Change lifeline durations
```js
const LIFELINE_GOOGLE_SECONDS = 30;
const LIFELINE_AI_SECONDS = 30;
const AUDIENCE_VOTE_SECONDS = 15; // Ask the Audience window
```

### Change AI voter accuracies
```js
const AI_VOTER_ACCURACIES = [0.75, 0.75, 0.60, 0.60, 0.60, 0.45, 0.45, 0.45, 0.30, 0.30];
// Higher = audience more reliable. Lower = more chaotic.
```

### Master volume
In `audio.js` → `setEnabled()`, change the `0.6` value (range 0–1).

### Open Claude instead of ChatGPT for Ask AI
In `useAskAI()`:
```js
openLifelineTab('https://claude.ai/new', LIFELINE_AI_SECONDS, 'ai');
```

---

## Upgrade Ideas

### Easy wins
- Keyboard shortcuts (A/B/C/D, Enter for final answer, 1/2/3/4 for lifelines)
- Pack stats display next to each theme on select screen
- Hard-reset high scores button in Settings
- Animated prize ladder filling in gold as cleared
- Photosensitive-safe mode (no flashing reveals)

### Gameplay
- Daily challenge mode (same 15 Qs everyone seeded by date)
- Streak mode (infinite tiers, no prize ladder)
- Practice mode (pick starting tier, no money)
- Wrong-answer review at end-of-game

### Streaming
- Overlay mode (`?overlay=1`) — strips menu chrome for OBS browser source
- Host/viewer URL split for multi-device hosting
- Real Twitch chat integration for "Ask the Stream" lifeline

### Content tools
- Question validator (loops `QUESTION_PACKS` at load, warns about malformed entries in console)
- Pack export/import as JSON
- CSV→pack converter

### Bigger projects
- Backend leaderboard (Cloudflare Workers + KV)
- Tournament bracket mode
- Lifeline trade system (give up a tier for a refilled lifeline)

### Hardening
- Save game state on tab close (`beforeunload`)
- Replace native `confirm()` with styled modals (Walk Away, Quit)
- Visual timer bar alongside the number
- Auto-validate `QUESTION_PACKS` on load and console-warn on errors

---

## Known Quirks

1. **Pop-up blockers** can stop Google / Ask AI lifelines from opening. Allow pop-ups for the page.
2. **Tab close may fail silently** for Google/Ask AI — once the tab navigates cross-origin, JS can't always close it. The RESUME modal + chime exist to compensate (timer stays paused).
3. **Audio needs a user gesture** before it can start (browser policy). The first click on the page unlocks it.
4. **Voices load async** in some browsers. If voice host doesn't speak on first load, reload once.
5. **Host Mode timer doesn't auto-resume** after lifelines (intentional — host has full control).
6. **Phones must reach your URL.** `file://` URLs don't work for phones. Use a local server or hosting (see Running the Game).

---

## Troubleshooting

### "Error: questions.js not loaded"
Check `questions.js` is in the same folder as `index.html`. Open DevTools (F12) → Console for syntax errors. Most common: missing comma after a question, or curly quotes.

### Theme doesn't appear on select screen
Verify the new pack is **inside** `window.QUESTION_PACKS = { ... }`. Pack key must be unique. Hard-reload (Ctrl/Cmd+Shift+R).

### QR code shows "Firebase Connection Failed"
Press F12 → Console → look for `[firebaseSync]` messages. Common causes:
- `databaseURL` missing or commented in `firebase.js`
- Realtime Database not enabled (only Firestore was — they're different)
- Database rules denying writes — set to `{ "rules": { ".read": true, ".write": true } }`

### Phone scans QR but says "no data"
The QR is encoding a `file://` URL your phone can't reach. You need to serve the game over HTTP. See [Running the Game](#running-the-game).

### Phone player taps FINAL ANSWER and nothing happens
Check the host PC's browser console for errors. The most common version of this bug was a Firebase listener attaching incorrectly — if it's recurring, paste the console output for diagnosis.

### High scores don't save
On `file://` URLs `localStorage` works but Private/Incognito blocks it. Confirm you're not in private mode.

### Audience modal stuck open
If the 10s timer didn't reach 0, it might be the page was hidden. Refresh the page; the host's audience state should reset when you start the next question.

### "Replace" / "Take Over" buttons don't show
Only render in **team modes** (Co-op, Versus). Won't show in Single Player or Host Mode.
