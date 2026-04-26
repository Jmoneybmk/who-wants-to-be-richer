/* =========================================================
   AUDIO MODULE — Who Wants to Be a Millionaire
   All sounds synthesized via Web Audio API. No external files.
   Edit any named function below to customize a sound.
   Exposes: window.audio
   ========================================================= */

window.audio = {
  ctx: null, masterGain: null,
  bgmNodes: null, bgmGain: null,
  enabled: true, initialized: false,

  init() {
    if (this.initialized) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.enabled ? 0.6 : 0;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) { console.warn('Audio init failed', e); }
  },

  unlock() {
    if (this.ctx && this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch (e) {}
    }
  },

  setEnabled(on) {
    this.enabled = on;
    if (this.masterGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(t);
        this.masterGain.gain.linearRampToValueAtTime(on ? 0.6 : 0, t + 0.1);
      } catch (e) {}
    }
    if (!on) this.stopBGM();
  },

  tone(freq, duration, opts = {}) {
    if (!this.enabled || !this.ctx) return;
    const { type = 'sine', volume = 0.3, attack = 0.01, when = 0, slideTo = null } = opts;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    if (slideTo) {
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(slideTo, t + duration);
    }
    const g = this.ctx.createGain();
    osc.connect(g); g.connect(this.masterGain);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + attack);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t); osc.stop(t + duration + 0.05);
  },

  noise(duration, opts = {}) {
    if (!this.enabled || !this.ctx) return;
    const { volume = 0.3, when = 0, filterFreq = 1000, filterType = 'bandpass', q = 1 } = opts;
    const t = this.ctx.currentTime + when;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType; filter.frequency.value = filterFreq; filter.Q.value = q;
    const g = this.ctx.createGain();
    src.connect(filter); filter.connect(g); g.connect(this.masterGain);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.start(t);
  },

  /* ---------- Named SFX ---------- */
  click() { this.tone(800, 0.04, { type: 'square', volume: 0.08 }); },
  select() {
    this.tone(523, 0.08, { type: 'sine', volume: 0.15 });
    this.tone(784, 0.1, { type: 'sine', volume: 0.1, when: 0.04 });
  },
  finalAnswerTension() {
    this.tone(110, 1.8, { type: 'sawtooth', volume: 0.12, attack: 0.4, slideTo: 138 });
    this.tone(146.8, 1.8, { type: 'sawtooth', volume: 0.08, attack: 0.4, slideTo: 174 });
    this.tone(55, 1.8, { type: 'triangle', volume: 0.15, attack: 0.4 });
  },
  correct() {
    [261.63, 329.63, 392.00, 523.25].forEach((f, i) => {
      this.tone(f, 0.4, { type: 'triangle', volume: 0.22, when: i * 0.07 });
    });
    this.tone(130.81, 1.2, { type: 'sine', volume: 0.1, when: 0.3 });
    this.tone(196.00, 1.2, { type: 'sine', volume: 0.1, when: 0.3 });
  },
  wrong() {
    this.tone(220.00, 0.25, { type: 'sawtooth', volume: 0.2 });
    this.tone(196.00, 0.25, { type: 'sawtooth', volume: 0.2, when: 0.15 });
    this.tone(174.61, 0.4, { type: 'sawtooth', volume: 0.22, when: 0.3 });
    this.tone(110.00, 1.0, { type: 'sawtooth', volume: 0.18, when: 0.5 });
    this.noise(0.5, { volume: 0.05, filterFreq: 200, when: 0.6 });
  },
  tierAdvance() {
    [392, 493.88, 587.33, 783.99].forEach((f, i) => {
      this.tone(f, 0.12, { type: 'sine', volume: 0.13, when: i * 0.05 });
    });
  },
  warning() {
    this.tone(80, 0.04, { type: 'square', volume: 0.18 });
    this.tone(80, 0.04, { type: 'square', volume: 0.13, when: 0.08 });
  },
  timerZeroBuzzer() {
    this.tone(220, 0.25, { type: 'square', volume: 0.32 });
    this.tone(165, 0.25, { type: 'square', volume: 0.28 });
    this.noise(0.3, { volume: 0.2, filterFreq: 400, q: 0.8 });
    this.tone(180, 0.6, { type: 'sawtooth', volume: 0.3, when: 0.28, slideTo: 90 });
    this.noise(0.6, { volume: 0.15, filterFreq: 250, when: 0.28 });
  },
  timeUp() {
    this.tone(150, 0.7, { type: 'sawtooth', volume: 0.3 });
    this.tone(120, 0.7, { type: 'sawtooth', volume: 0.25 });
    this.noise(0.7, { volume: 0.15, filterFreq: 200, q: 0.5 });
  },
  win() {
    [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((f, i) => {
      this.tone(f, 0.8, { type: 'triangle', volume: 0.2, when: i * 0.1 });
    });
    this.tone(261.63, 2.5, { type: 'triangle', volume: 0.13, when: 0.6 });
    this.tone(329.63, 2.5, { type: 'triangle', volume: 0.13, when: 0.6 });
    this.tone(392.00, 2.5, { type: 'triangle', volume: 0.13, when: 0.6 });
    this.tone(523.25, 2.5, { type: 'triangle', volume: 0.1, when: 0.6 });
  },
  lifelineActivate() {
    this.tone(200, 0.35, { type: 'sine', volume: 0.18, slideTo: 900 });
  },
  lifelineEnd() {
    this.tone(880, 0.18, { type: 'sine', volume: 0.3 });
    this.tone(660, 0.18, { type: 'sine', volume: 0.25, when: 0.18 });
    this.tone(880, 0.4, { type: 'sine', volume: 0.3, when: 0.36 });
    this.tone(1100, 0.4, { type: 'sine', volume: 0.25, when: 0.36 });
  },
  walkAway() {
    this.tone(392, 0.4, { type: 'triangle', volume: 0.18 });
    this.tone(261.63, 0.6, { type: 'triangle', volume: 0.18, when: 0.25 });
  },
  // Individual audience vote blip
  voteBlip(pitch = 1) {
    this.tone(600 * pitch, 0.05, { type: 'sine', volume: 0.08 });
  },
  // Played when a player is eliminated in team/versus mode
  playerEliminated() {
    this.tone(110, 0.4, { type: 'sawtooth', volume: 0.25, slideTo: 55 });
    this.noise(0.5, { volume: 0.1, filterFreq: 150, when: 0.1 });
  },

  /* ---------- BGM (ambient A-minor drone) ---------- */
  startBGM() {
    if (!this.enabled || !this.ctx) return;
    if (this.bgmNodes) return;
    try {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0;
      this.bgmGain.connect(this.masterGain);
      this.bgmGain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 2);

      const drone1 = this.ctx.createOscillator();
      drone1.type = 'sawtooth'; drone1.frequency.value = 110; drone1.detune.value = -7;
      const drone2 = this.ctx.createOscillator();
      drone2.type = 'sawtooth'; drone2.frequency.value = 110; drone2.detune.value = 7;
      const drone3 = this.ctx.createOscillator();
      drone3.type = 'sine'; drone3.frequency.value = 164.81;
      const drone4 = this.ctx.createOscillator();
      drone4.type = 'triangle'; drone4.frequency.value = 55;

      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 12;
      lfo.connect(lfoGain);
      lfoGain.connect(drone1.detune);
      lfoGain.connect(drone2.detune);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 700; filter.Q.value = 1.5;

      drone1.connect(filter); drone2.connect(filter);
      drone3.connect(filter); drone4.connect(filter);
      filter.connect(this.bgmGain);

      drone1.start(); drone2.start(); drone3.start(); drone4.start(); lfo.start();
      this.bgmNodes = [drone1, drone2, drone3, drone4, lfo];
    } catch (e) { console.warn('BGM start failed', e); }
  },

  stopBGM() {
    if (!this.bgmNodes || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      if (this.bgmGain) {
        this.bgmGain.gain.cancelScheduledValues(t);
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, t);
        this.bgmGain.gain.linearRampToValueAtTime(0, t + 0.8);
      }
      const nodesToStop = this.bgmNodes;
      this.bgmNodes = null;
      setTimeout(() => {
        nodesToStop.forEach(n => { try { n.stop(); } catch (e) {} });
      }, 900);
    } catch (e) {}
  },
};
