# Who Wants to Be a Millionaire — Internet Edition

A browser-based game modeled after the classic show, with three "internet-themed" lifelines: **50/50**, **Google Search** (15s), and **Ask the AI** (25s). Runs as a single page — no backend, no build step, no external audio files.

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Running the Game](#running-the-game)
3. [Pack Design Philosophy](#pack-design-philosophy)
4. [Balancing Difficulty — Full Per-Tier Guide](#balancing-difficulty--full-per-tier-guide)
5. [Adding Questions](#adding-questions)
6. [Adding a New Theme](#adding-a-new-theme)
7. [Code Walkthrough — `index.html`](#code-walkthrough--indexhtml)
8. [Audio System](#audio-system)
9. [Common Modifications](#common-modifications)
10. [Upgrade Ideas](#upgrade-ideas)
11. [Known Quirks](#known-quirks)
12. [Troubleshooting](#troubleshooting)

---

## File Structure

```
.
├── index.html      # Main game: HTML, CSS, game logic, audio synthesis. Open this to play.
├── questions.js    # All question/answer data. Edit this to add content.
└── README.md       # This file.
```

Both files must be in the **same folder**. `index.html` loads `questions.js` via:

```html
<script src="questions.js"></script>
```

The game then reads from a global `window.QUESTION_PACKS` object defined inside `questions.js`.

---

## Running the Game

### Option 1 — Open directly (easiest)
Double-click `index.html`. Works in any modern browser. Saves, high scores, and settings persist via `localStorage`.

### Option 2 — Local server (cleaner)
From a terminal in the folder:
```bash
# Python 3
python -m http.server 8000
# OR Node
npx serve .
```
Then open `http://localhost:8000`.

### Option 3 — In the Claude artifact environment
Upload both files together; the game uses Claude's artifact storage API for persistence.

> **Storage fallback chain:** `window.storage` (Claude) → `localStorage` (normal browser) → in-memory (private / disabled storage). The game never crashes from missing storage — it just won't persist across sessions in the last case.

---

## Pack Design Philosophy

A **pack** is a themed set of questions spanning the full 15-tier prize ladder. Each pack is a complete gameplay experience — players don't mix themes within a single playthrough.

### Target pack size: **100 questions**

Split across **5 difficulty groups**, each covering specific tiers:

| Difficulty Group | Tiers     | Questions | Distribution (per tier) |
|---|---|---|---|
| **Very Easy**   | 1, 2, 3       | 20 | **6 · 7 · 7** |
| **Easy**        | 4, 5, 6       | 20 | **6 · 7 · 7** (Tier 5 is a ★ safety net) |
| **Medium**      | 7, 8, 9, 10   | 20 | **5 · 5 · 5 · 5** (Tier 10 is a ★ safety net) |
| **Hard**        | 11, 12, 13    | 20 | **6 · 7 · 7** |
| **Extreme**     | 14, 15        | 20 | **10 · 10** |

### Why this split?

- **20 per group** gives real variety — a player can't replay 3 times and see everything.
- **Even within groups** prevents awkward "every replay hits the same Q14" patterns that happen when pools are tiny at the top.
- **Top tiers get the biggest pools** (10 each at Extreme) because those are the most replay-sensitive — reaching Q15 is rare, so players want the moment to feel fresh.
- **Medium gets 4 tiers at 5 each** — it's the long middle stretch of the game and needs steady variety without any tier pool feeling thin.

### Minimum enforced by the engine: **2 questions per tier**

Fewer than 2 and the first-played question will immediately repeat on replay. The engine won't crash below that, but the gameplay feels broken.

### Can I make smaller packs?

Yes — the engine works with any count ≥ 2 per tier. The 100-question target is a **quality bar**, not a requirement. Your existing packs (Random Trivia, Anime, Dragon Ball, Common Sense) sit at various sizes; the 100/20-per-group target is the new standard going forward.

---

## Balancing Difficulty — Full Per-Tier Guide

Use this as a writing reference. Each tier has a clear difficulty expectation. When in doubt: **"Would an average adult immediately know this?"** Yes → early tier. Needs a moment → middle. Needs real knowledge → late. Needs expertise or careful thought → top.

### 🟢 Very Easy (Tiers 1–3) — $100 / $200 / $300

The player should never sweat these. Their role is to **ease the player in**, build momentum, and warm up voice/audio cues. Wrong answers here should be almost comically wrong.

**Tier 1 — $100 · "a child could answer this"**
- The most basic facts in the domain.
- Example (general): "How many days are in a week?" → 7
- Example (Dragon Ball): "What color is Goku's hair as a Super Saiyan?" → Yellow/Gold
- Wrong answers: obviously nonsensical. Players should smile at the distractors.

**Tier 2 — $200 · "everyone who knows the topic knows this"**
- Still extremely basic, but with slightly more specificity.
- Example (general): "Which planet is closest to the Sun?" → Mercury
- Example (Dragon Ball): "Who is Goku's first son?" → Gohan

**Tier 3 — $300 · "common knowledge for anyone paying attention"**
- Requires one extra piece of context beyond the absolute basics.
- Example (general): "Largest ocean on Earth?" → Pacific
- Example (Dragon Ball): "Who trained Goku to use Kaio-ken?" → King Kai

### 🟡 Easy (Tiers 4–6) — $500 / $1,000★ / $2,000

Player starts needing to actually think. Tier 5 is the **first safety net** — players who clear it can't drop below $1,000.

**Tier 4 — $500 · "standard fan-level knowledge"**
- Something a casual fan of the topic remembers without effort.
- Example (Anime): "In My Hero Academia, what is Izuku's hero name?" → Deku

**Tier 5 — $1,000 ★ · "solid general knowledge (first safety net)"**
- Should feel like a mild accomplishment to answer correctly.
- Example (general): "Who wrote Romeo and Juliet?" → Shakespeare
- This tier's difficulty sets the tone — if it's too easy, the $1K safety net feels meaningless. If too hard, early game feels punishing.

**Tier 6 — $2,000 · "requires slightly deeper knowledge"**
- The first tier where a less-engaged player might genuinely hesitate.
- Example (Dragon Ball): "Who is the author/mangaka of Dragon Ball?" → Akira Toriyama

### 🟠 Medium (Tiers 7–10) — $4,000 to $32,000★

The **longest stretch of the game** and the biggest test of pack quality. Tier 10 is the **second safety net** — clearing it locks in $32,000.

**Tier 7 — $4,000 · "engaged fan knowledge"**
- Someone who's read / watched the full work should know this.
- Example (general): "Who was the first US President?" → Washington (early tier classic, but could work as T7 for younger audiences)

**Tier 8 — $8,000 · "detail-level recall"**
- Names, dates, specific mechanics. Requires attention while engaging with the material.
- Example (Dragon Ball): "What is the name of Frieza's second form attack?" or "Which transformation comes directly after Super Saiyan 2?"

**Tier 9 — $16,000 · "specialized knowledge"**
- Either a subtle mechanic, a secondary character, or a lesser-known fact that only committed fans catch.
- Example (general): "Smallest country by area?" → Vatican City

**Tier 10 — $32,000 ★ · "hardcore fan territory (second safety net)"**
- This is the gateway to the upper half. Should feel difficult without being obscure.
- Example (Dragon Ball): "In Dragon Ball GT, what is Baby's true form revealed in the final arc?" or "Which Spirit Bomb finally defeats Kid Buu?"

### 🔴 Hard (Tiers 11–13) — $64,000 / $125,000 / $250,000

The top half. Players without deep expertise will rely heavily on lifelines here. Questions should reward **mastery**.

**Tier 11 — $64,000 · "expert territory"**
- Facts that only serious fans / scholars retain.
- Example (Dragon Ball): "What is the name of Gohan's ultimate form when unleashed by the Old Kai?" → Mystic/Ultimate Gohan

**Tier 12 — $125,000 · "deep cuts"**
- Obscure character names, specific story events, minor but canon details.
- Example (general): "Hardest naturally occurring substance?" → Diamond (borderline T12 — real T12 might be about hardness scale specifics)

**Tier 13 — $250,000 · "scholarly / encyclopedic"**
- Real niche. Production details, obscure arc specifics, pedantic wording.
- Example (Anime): "Who directed the 1997 TV series Revolutionary Girl Utena?" → Kunihiko Ikuhara

### 🟣 Extreme (Tiers 14–15) — $500,000 / $1,000,000

The endgame. **These questions should be rare enough that reaching them feels like a moment.** Give them the biggest pools (10 each) so replays keep feeling fresh.

**Tier 14 — $500,000 · "very few people know this without looking it up"**
- Production history, obscure canon details, tricky calculations, classic hard puzzles.
- Example (general puzzle): "9 identical balls, one heavier — minimum weighings to find it?" → 2
- Example (Anime): "Who directed Royal Space Force: The Wings of Honnêamise (1987)?" → Hiroyuki Yamaga

**Tier 15 — $1,000,000 · "the question that defines the pack"**
- The one players will remember. Should be genuinely hard, but **must have a clean, unambiguous answer**.
- Avoid questions that could be contested (disputed dates, "best" anything, recent events that might change). Safety-check with 2+ sources.
- Example (general puzzle): "Bat and ball cost $1.10 total. Bat costs $1 more than ball. Cost of ball?" → $0.05
- Example (Dragon Ball canonical trivia): "What is the full name of the character who fuses with Zamasu to form Fused Zamasu?" → Goku Black

### Rules that apply to every tier

1. **One unambiguously correct answer.** If two options could both be defended, rewrite the question or the distractors.
2. **Plausible wrong answers.** Throwaway distractors ruin the tension. A bad distractor set: "Banana, Shakespeare, 42, Tokyo." A good distractor set uses options that belong to the same category as the answer.
3. **Consistent style within a tier.** Don't mix 30-word sentences with 5-word sentences in the same difficulty group.
4. **Verify facts.** Especially Hard and Extreme. Even one wrong "correct" answer will erode trust in the whole pack.

### Distractor quality matters more at higher tiers

At Very Easy, silly distractors are fine (even desirable — it rewards engagement). At Extreme, distractors must be **genuinely plausible** — ideally real facts from adjacent topics. If you're asking about a character's ultimate form, the three wrong options should be real forms from the same series, not made-up ones.

---

## Adding Questions

All questions live in **`questions.js`**. Nothing else needs editing.

### Quick example — adding one question

Open `questions.js`. Find the theme (e.g., `random`), find the tier (e.g., `4`), and add a new object:

```js
4: [
  { q: "Who painted the Mona Lisa?", a: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 },
  { q: "What is the capital of Japan?", a: ["Osaka", "Kyoto", "Tokyo", "Seoul"], correct: 2 },
  // NEW:
  { q: "In what year did the Titanic sink?", a: ["1905", "1912", "1918", "1923"], correct: 1 },
],
```

Save. Refresh. Done.

### The question object format

| Field | Type | Description |
|---|---|---|
| `q` | string | The question. End with `?`. Aim for under ~120 chars for mobile. |
| `a` | array of 4 strings | Options in order A, B, C, D. |
| `correct` | integer 0–3 | **Zero-indexed.** 0=A, 1=B, 2=C, 3=D. |

### Pre-commit validation checklist

Before adding any question, verify:

- [ ] `q` ends with a `?`
- [ ] `a` has **exactly 4** items
- [ ] `correct` is `0`, `1`, `2`, or `3`
- [ ] `a[correct]` really is the right answer (most common bug)
- [ ] Distractors are plausible and belong to the same category
- [ ] Question fits the tier's difficulty (see the per-tier guide above)
- [ ] **Comma after** the closing `}` if not the last item in the array
- [ ] No curly quotes (`"` `"`) — use straight quotes (`"`)

---

## Adding a New Theme

The theme-select menu is **data-driven** — add a pack to `QUESTION_PACKS`, and a new button appears automatically.

```js
window.QUESTION_PACKS = {
  // ... existing packs ...

  my_new_pack: {
    name: "My New Pack",
    questions: {
      1:  [ /* ~6 Very Easy questions */ ],
      2:  [ /* ~7 Very Easy */ ],
      3:  [ /* ~7 Very Easy */ ],
      4:  [ /* ~6 Easy */ ],
      5:  [ /* ~7 Easy (safety net) */ ],
      6:  [ /* ~7 Easy */ ],
      7:  [ /* 5 Medium */ ],
      8:  [ /* 5 Medium */ ],
      9:  [ /* 5 Medium */ ],
      10: [ /* 5 Medium (safety net) */ ],
      11: [ /* ~6 Hard */ ],
      12: [ /* ~7 Hard */ ],
      13: [ /* ~7 Hard */ ],
      14: [ /* 10 Extreme */ ],
      15: [ /* 10 Extreme */ ],
    }
  },
};
```

- **Key** (`my_new_pack`) — internal ID. Lowercase, no spaces. Used in saved games and high score entries.
- **Name** (`"My New Pack"`) — display label. Anything goes.
- **All 15 tiers must be populated** — empty tiers break the game when the player reaches them.

Save → refresh → the new theme button appears on the theme-select screen.

---

## Code Walkthrough — `index.html`

Three main parts:

1. **`<style>` block** — CSS with CSS variables for theming.
2. **Question loader** — `<script src="questions.js"></script>`.
3. **Main `<script>` block** — game logic.

### CSS variables (top of `<style>`)

```css
:root {
  --bg-deep: #020814;   /* Deepest background */
  --gold:    #f4c430;   /* Primary accent */
  --correct: #2ecc71;
  --wrong:   #e74c3c;
  --selected:#ff8c00;
  --safety:  #4aa8ff;
  /* ... */
}
```

All colors reference these — change one to re-skin the game globally.

### Script sections

| Section | Purpose |
|---|---|
| Constants | `PRIZE_LADDER`, `SAFETY_NET_TIERS`, `TIMER_FOR_TIER`, lifeline durations |
| Audio module | Web Audio synthesis — see [Audio System](#audio-system) |
| State | Single `state` object. Every mutation flows through flow functions, then `render()` |
| Persistence | Layered `window.storage` → `localStorage` → in-memory. Save, high scores, settings |
| Voice | `speak()` / `stopSpeaking()`. Gated by `state.screen === 'game'` |
| Question picking | Random from tier pool, excluding already-used |
| Game flow | `startNewGame`, `loadQuestionForCurrentTier`, `selectAnswer`, confirmation flow, `endGame` |
| Timer | `startTimer`, `pauseTimer`, `resumeTimer`, `adjustTimer`. Warning pulse at last 10s; buzzer at 0 |
| Lifelines | 50/50, Google (15s pre-filled), Ask AI (25s blank). RESUME modal when done |
| Render | Dispatches to screen renderers; modals overlay the game screen |
| Event wiring | All elements use `data-action="..."`. `handleAction(e)` routes |
| Cleanup | `fullCleanup()` called on Quit / Main Menu — kills timer, voice, BGM, lifeline tab |
| Init | Checks `QUESTION_PACKS`, loads settings/save, primes voices, renders menu |

### Key behaviors worth knowing

- **Final Answer is a two-step commit** in single-player: click FINAL ANSWER → modal with YES/NO. Voice plays during the modal; clicking NO resumes the timer.
- **Lifeline tabs don't reliably close** (browser security). After the lifeline countdown, a loud chime plays and a RESUME modal appears. The question timer stays paused until RESUME is clicked — so no time can be lost even if the tab won't close.
- **Voice is gated** by `state.screen === 'game'`. Quitting mid-question silences everything; delayed `speak()` callbacks check the screen and drop silently.
- **Audio requires a user gesture** (browser autoplay policy). Initialized on the first click.

---

## Audio System

All audio is **synthesized on the fly** via Web Audio API. No external files. Edit any named function in the `audio` object.

### Architecture

```
AudioContext
 └── masterGain (global volume, 0 when muted)
      ├── individual SFX nodes (spawn/destroy per effect)
      └── bgmGain → filter → 4 drone oscillators + LFO
```

### Named sound functions

| Function | When | Character |
|---|---|---|
| `click()` | Nav button | Short square blip |
| `select()` | Selecting an answer | Two-tone chime |
| `finalAnswerTension()` | Opening "Final Answer?" modal | Rising low drone |
| `correct()` | Reveals correct | Ascending major arpeggio |
| `wrong()` | Reveals wrong | Descending minor + buzz |
| `tierAdvance()` | Moving to next Q | Quick rising scale |
| `warning()` | Each of the last 10s | Heartbeat pulse |
| `timerZeroBuzzer()` | Question timer hits 0 | Harsh two-stage buzzer |
| `timeUp()` | Reveal after timeout | Sustained sawtooth + noise |
| `win()` | Winning $1M | Big fanfare + sustained major chord |
| `lifelineActivate()` | Starting a lifeline | Ascending whoosh |
| `lifelineEnd()` | Lifeline countdown done | Loud 4-note alert chime |
| `walkAway()` | Walking away | Bittersweet descending fifth |
| `startBGM` / `stopBGM` | Game start / end | Ambient A-minor drone with LFO |

### Swapping to real audio files

```js
correct() {
  if (!this.enabled) return;
  const a = new Audio('sounds/correct.mp3');
  a.volume = 0.6;
  a.play().catch(() => {});
}
```

For BGM, use `<audio loop>`. You can mix synthesized and file-based sounds freely.

---

## Common Modifications

### Change the prize ladder
```js
const PRIZE_LADDER = [500, 1000, 2500, ...]; // must be 15 numbers
```

### Change safety nets
```js
const SAFETY_NET_TIERS = [2, 6, 10]; // three nets at Q3, Q7, Q11 (zero-indexed)
```

### Change timer durations
```js
const TIMER_FOR_TIER = (tierIdx) => {
  if (tierIdx <= 4) return 45;   // was 30
  if (tierIdx <= 9) return 60;   // was 45
  return 90;                      // was 60
};
```

### Change lifeline durations
```js
const LIFELINE_GOOGLE_SECONDS = 20;
const LIFELINE_AI_SECONDS = 30;
```

### Remove a lifeline
In `startNewGame`:
```js
state.lifelines = { googleSearch: true, fiftyFifty: false, askAI: true };
```

### Add a new lifeline ("Skip Question")
1. Add to `state.lifelines` in `startNewGame` and `resumeSavedGame` defaults.
2. Add the button in `renderLifelineButtons()`.
3. Implement `useSkip()`.
4. Add `case 'lifeline-skip':` in `handleAction`.

### Change the ChatGPT URL
```js
openLifelineTab(`https://claude.ai/new`, LIFELINE_AI_SECONDS, 'ai');
```

### Change voice characteristics
```js
u.rate = 0.95;   // 0.1–10
u.pitch = 0.85;  // 0–2
const preferred = voices.find(v => /female|samantha|karen/i.test(v.name));
```

### Adjust master volume
In `audio.setEnabled()`, change `0.6` to your preference (0–1).

### Kill BGM but keep SFX
Remove `audio.startBGM()` calls from `startNewGame()` and `resumeSavedGame()`.

---

## Upgrade Ideas

### Easy wins
- **Keyboard shortcuts** — `A/B/C/D` to select, `Enter` for final answer, `1/2/3` for lifelines.
- **Pack stats display** — show "X questions available" next to each theme on select screen.
- **Hard-reset high scores button** in Settings.
- **Animated prize ladder** — each cleared row fills gold as you climb.
- **Photosensitive-safe mode** — disables flashing answer reveals.

### Gameplay modes
- **Daily Challenge** — same 15 Qs for everyone on a given day (seed by date). Leaderboard-friendly.
- **Streak Mode** — infinite tiers, no prize ladder, max streak = score. Good for quick-play loops.
- **Practice Mode** — pick any starting tier, no money, no safety nets, just study.
- **Team Mode** — 2+ players pass questions around. Each gets 1 lifeline.
- **Handicap Mode** — start at Q5 or Q10 with reduced max prize. Good for speed runs.
- **Wrong-Answer Review** — after game ends, show all missed questions with the correct answer.

### Streaming & hosting
- **Overlay mode** — `?overlay=1` strips menu chrome, transparent background, question + timer only. Perfect for OBS browser source.
- **Host/viewer split** — `?role=host` vs `?role=viewer`. Host sees controls; viewer sees only the question panel.
- **WebSocket sync** — two browser tabs share state. Real multi-device hosting (phone as controller, laptop on screen).
- **QR-code "join the stream"** — viewers vote on answers via a mobile page; top vote shows as a stream poll.
- **OBS browser-source tick hooks** — events fire when tiers advance so OBS can auto-switch scenes.

### Content tools
- **Question validator** — pass over `QUESTION_PACKS` at startup: check `a.length === 4`, `correct` is 0–3, no duplicate questions within a tier, flag questions with uneven distractor lengths. Log warnings to console.
- **Pack stats page** — breakdown per pack: questions per tier, average question length, longest/shortest, which tiers are under-provisioned.
- **CSV/JSON import** — paste a spreadsheet into a hidden editor page (`#editor`), get back formatted pack code.
- **Pack export** — download the current pack as a standalone `.json` for sharing.
- **Duplicate detector** — warn if two questions across different packs are near-identical.

### Polish
- **Letter-by-letter question reveal** — each letter fades in, Regis-style dramatic pacing.
- **Spotlight lighting on selected answer** — subtle vignette focuses attention.
- **Particle effects on correct answer** — gold confetti burst.
- **Haptic feedback on mobile** — short vibration on select/correct/wrong (via `navigator.vibrate`).
- **Custom accessibility themes** — colorblind-friendly palette option.

### Bigger projects
- **Framework rewrite (Preact)** — no build step, but enables better animations and component reuse.
- **Backend leaderboard** — Cloudflare Workers + KV store for global high scores.
- **Tournament bracket mode** — multiple players take turns on the same ladder; highest survivor wins.
- **Lifeline trade system** — trade current prize tier for a refilled lifeline after answering correctly.
- **Procedural question generation** — for math/logic packs, generate infinite variants (e.g., "What's X% of Y?" with random X and Y).

### Fixes / hardening
- **Autosave on tab close** — `window.addEventListener('beforeunload', saveCurrentGame)`.
- **Validate `QUESTION_PACKS` at load** — loop through all packs/tiers/questions, console.warn on malformed entries.
- **Replace native `confirm()` dialogs** — use the existing styled modal pattern for Walk Away and Quit prompts.
- **Handle browser pop-up blocks gracefully** — instead of `alert()`, show a "copy query" button the player can click to open Google manually.
- **Visual timer bar** — progress bar drains alongside the countdown number.

---

## Known Quirks

1. **Pop-up blockers** — Google and Ask-AI lifelines use `window.open`. Some browsers block this. The game alerts the user; they need to allow pop-ups for the page.

2. **Tab close may fail silently** — Once the lifeline tab navigates to Google or ChatGPT, `tab.close()` often fails due to cross-origin restrictions. This is why the RESUME modal + loud chime exist — so the player can't lose time even when close fails.

3. **Audio needs a user gesture** — Browsers block audio until the user clicks. The game initializes audio on the first `handleAction()` call. If no sound plays on the very first interaction, click once more.

4. **Voices load async** — Chrome returns an empty list from `speechSynthesis.getVoices()` on first load. Reload once; it caches after.

5. **Host Mode doesn't auto-resume timer after a lifeline** — Intentional. Host has full manual control.

6. **Native `confirm()` dialogs look ugly** — Walk Away and Quit use browser-native `confirm()`. See Fixes / Hardening above for the styled-modal upgrade.

---

## Troubleshooting

### "Error: questions.js not loaded"
- Check `questions.js` is in the **same folder** as `index.html`.
- Open DevTools (F12) → Console. Look for syntax errors — most common: missing comma after a question, or curly quotes (`"` vs `"`).

### New theme doesn't appear on the theme select screen
- Verify the new pack is **inside** `window.QUESTION_PACKS = { ... }`.
- Pack key must be unique (no two packs with the same key).
- Hard-reload: `Ctrl+Shift+R` / `Cmd+Shift+R`.

### Lifeline doesn't open a tab
- Browser blocked the pop-up. Check address bar for a pop-up icon; allow pop-ups for the page.

### Voice doesn't play
- Enable in **Settings** (off by default).
- Confirm support: DevTools console → `'speechSynthesis' in window` → should be `true`.

### No audio at all
- Toggle **Sound & Music** in Settings.
- Click somewhere in the page first — audio needs a user gesture to start.
- Check the browser tab isn't muted (right-click tab → Unmute).

### High scores don't save
- If running from plain `file://`, `localStorage` should still work. If it doesn't, the browser might be in Private/Incognito mode, which blocks storage.
- Check DevTools console for warnings.

### Game feels too easy or too hard
- Rebalance questions across tiers — move harder ones up, easier ones down.
- Adjust `TIMER_FOR_TIER`.
- Review the per-tier difficulty guide above to audit your pack.
