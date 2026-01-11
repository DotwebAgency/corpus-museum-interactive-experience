/**
 * CORPUS — Musical Body Instrument
 * Transform body movements into music using Web Audio API + Tone.js
 * 
 * "The body is the instrument. The algorithm is the composer. The user is the virtuoso."
 */

// ==============================================
// SCALE & NOTE DEFINITIONS
// ==============================================

// Extended scales with wider ranges for more dramatic effect
const SCALES = {
  pentatonic: ['C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5'],
  minor: ['A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'],
  major: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4'],
  blues: ['C3', 'Eb3', 'F3', 'Gb3', 'G3', 'Bb3', 'C4', 'Eb4', 'F4', 'Gb4', 'G4', 'Bb4'],
  japanese: ['C3', 'Db3', 'F3', 'G3', 'Ab3', 'C4', 'Db4', 'F4', 'G4', 'Ab4', 'C5', 'Db5'],
  dorian: ['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4']
};

// Bass notes also scale-aware for richer sound
const BASS_SCALES = {
  pentatonic: ['C2', 'D2', 'E2', 'G2', 'A2', 'C3'],
  minor: ['A1', 'C2', 'D2', 'E2', 'G2', 'A2'],
  major: ['C2', 'E2', 'G2', 'C3', 'E3', 'G3'],
  blues: ['C2', 'Eb2', 'F2', 'G2', 'Bb2', 'C3'],
  japanese: ['C2', 'F2', 'G2', 'C3', 'F3', 'G3'],
  dorian: ['D2', 'F2', 'G2', 'A2', 'C3', 'D3']
};

// Scale-specific chords
const SCALE_CHORDS = {
  pentatonic: ['C4', 'E4', 'G4', 'A4'],
  minor: ['A3', 'C4', 'E4'],
  major: ['C4', 'E4', 'G4'],
  blues: ['C4', 'Eb4', 'G4', 'Bb4'],
  japanese: ['C4', 'F4', 'G4'],
  dorian: ['D4', 'F4', 'A4']
};

// Scale-specific synth settings for tonal variety
const SCALE_SYNTH_SETTINGS = {
  pentatonic: { type: 'sine', attack: 0.08, decay: 0.3, sustain: 0.6, release: 0.8 },
  minor: { type: 'triangle', attack: 0.15, decay: 0.4, sustain: 0.4, release: 1.2 },
  major: { type: 'sine', attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.5 },
  blues: { type: 'sawtooth', attack: 0.02, decay: 0.3, sustain: 0.5, release: 0.6 },
  japanese: { type: 'sine', attack: 0.2, decay: 0.5, sustain: 0.3, release: 1.5 },
  dorian: { type: 'triangle', attack: 0.1, decay: 0.35, sustain: 0.5, release: 0.9 }
};

const CHORDS = {
  major: ['C4', 'E4', 'G4'],
  minor: ['A3', 'C4', 'E4'],
  seventh: ['C4', 'E4', 'G4', 'Bb4'],
  sus4: ['C4', 'F4', 'G4']
};

// ==============================================
// BODY INSTRUMENT CLASS
// ==============================================

export class BodyInstrument {
  constructor() {
    this.isInitialized = false;
    this.isMuted = false;
    this.isEnabled = false; // Start disabled until user enables
    this.currentScale = 'pentatonic';
    this.masterVolume = -12; // dB
    
    // Tone.js reference (injected)
    this.Tone = null;
    
    // Synth instances
    this.melodySynth = null;
    this.bassSynth = null;
    this.padSynth = null;
    this.kickSynth = null;
    this.snareSynth = null;
    
    // === NEW: Continuous arm synths (MonoSynth for smooth glides) ===
    this.rightArmSynth = null;  // Melody - right arm
    this.leftArmSynth = null;   // Bass - left arm
    
    // Continuous control state
    this.continuousMode = true; // Enable by default
    this.rightArmActive = false;
    this.leftArmActive = false;
    this.lastRightFreq = 0;
    this.lastLeftFreq = 0;
    this.armSmoothFactor = 0.12; // Lower = more responsive
    
    // Pitch ranges (Hz)
    this.melodyRange = { min: 130.81, max: 523.25, octaves: 2 }; // C3 to C5
    this.bassRange = { min: 65.41, max: 196.00, octaves: 1.5 };  // C2 to G3
    
    // Arm visibility threshold
    this.armVisibilityThreshold = 0.5;
    
    // Effects chain
    this.reverb = null;
    this.delay = null;
    this.filter = null;
    this.limiter = null;
    
    // State tracking
    this.lastNotes = { melody: null, bass: null };
    this.noteHoldTimers = {};
    this.activeNotes = new Set();
    this.lastGestureTime = { left: 0, right: 0 };
    this.lastChordTime = 0;
    
    // Velocity tracking for smoother response
    this.velocityHistory = { left: [], right: [] };
    this.historyLength = 5;
    
    // Thresholds - lower = more sensitive
    this.velocityThreshold = 0.001; // Extremely sensitive - almost any movement plays notes
    this.gestureDebounce = 300; // ms between gesture triggers
    this.chordDebounce = 500; // ms between chord strums
    
    // Visual feedback callback
    this.onSoundTrigger = null;
  }
  
  // ==============================================
  // INITIALIZATION
  // ==============================================
  
  async initialize(Tone) {
    if (this.isInitialized) return;
    
    this.Tone = Tone;
    
    try {
      // Must be called after user interaction (browser audio policy)
      await Tone.start();
      console.log('[BodyInstrument] 🎵 Audio context started');
      
      // Create effects first
      this.createEffects();
      
      // Create synths
      this.createSynths();
      
      // Set master volume with limiter
      this.limiter = new Tone.Limiter(-3).toDestination();
      Tone.Destination.volume.value = this.masterVolume;
      
      this.isInitialized = true;
      console.log('[BodyInstrument] 🎵 Synths initialized - Ready to play!');
      
      return true;
    } catch (error) {
      console.error('[BodyInstrument] Failed to initialize:', error);
      return false;
    }
  }
  
  createEffects() {
    const Tone = this.Tone;
    
    // Lush reverb for ambient feel
    this.reverb = new Tone.Reverb({
      decay: 4,
      wet: 0.35,
      preDelay: 0.01
    });
    
    // Subtle delay for melody
    this.delay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.25,
      wet: 0.2
    });
    
    // Dynamic filter controlled by face
    this.filter = new Tone.Filter({
      frequency: 2000,
      type: 'lowpass',
      rolloff: -24,
      Q: 1
    });
    
    // Chain effects
    this.delay.connect(this.reverb);
    this.reverb.toDestination();
    this.filter.connect(this.reverb);
  }
  
  createSynths() {
    const Tone = this.Tone;
    
    // Melody synth - warm, expressive
    this.melodySynth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 4,
      voice: Tone.Synth,
      options: {
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.08,
          decay: 0.3,
          sustain: 0.6,
          release: 0.8
        }
      }
    });
    this.melodySynth.connect(this.delay);
    
    // Bass synth - deep and warm
    this.bassSynth = new Tone.MonoSynth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.05,
        decay: 0.4,
        sustain: 0.5,
        release: 1.0
      },
      filter: {
        Q: 1,
        type: 'lowpass',
        rolloff: -24
      },
      filterEnvelope: {
        attack: 0.06,
        decay: 0.3,
        sustain: 0.4,
        release: 1,
        baseFrequency: 100,
        octaves: 3
      }
    });
    this.bassSynth.connect(this.filter);
    
    // Pad synth - for chord strums
    this.padSynth = new Tone.PolySynth(Tone.FMSynth, {
      maxPolyphony: 6,
      voice: Tone.FMSynth,
      options: {
        harmonicity: 2,
        modulationIndex: 3,
        envelope: {
          attack: 0.3,
          decay: 0.5,
          sustain: 0.7,
          release: 2.0
        }
      }
    });
    this.padSynth.volume.value = -8;
    this.padSynth.connect(this.reverb);
    
    // Kick drum
    this.kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 0.4
      }
    });
    this.kickSynth.volume.value = -6;
    this.kickSynth.toDestination();
    
    // Snare
    this.snareSynth = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0
      }
    });
    this.snareSynth.volume.value = -12;
    this.snareSynth.toDestination();
    
    // === NEW: Continuous arm synths (MonoSynth for smooth glides) ===
    this.createContinuousArmSynths();
  }
  
  createContinuousArmSynths() {
    const Tone = this.Tone;
    
    // Right arm = Melody synth (theremin-like, smooth glides)
    this.rightArmSynth = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.8,
        release: 0.5
      },
      filterEnvelope: {
        attack: 0.06,
        decay: 0.2,
        sustain: 0.5,
        release: 0.5,
        baseFrequency: 200,
        octaves: 4
      },
      portamento: 0.05  // Smooth glide between notes
    });
    this.rightArmSynth.volume.value = -8;
    this.rightArmSynth.connect(this.delay);
    
    // Left arm = Bass synth (warmer, slower glides)
    this.leftArmSynth = new Tone.MonoSynth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.7,
        release: 0.8
      },
      filterEnvelope: {
        attack: 0.1,
        decay: 0.4,
        sustain: 0.4,
        release: 0.8,
        baseFrequency: 80,
        octaves: 2.5
      },
      portamento: 0.08  // Slightly slower glide for bass
    });
    this.leftArmSynth.volume.value = -10;
    this.leftArmSynth.connect(this.filter);
    
    console.log('[BodyInstrument] 🎸 Continuous arm synths created');
  }
  
  // === CONTINUOUS ARM PITCH CONTROL ===
  updateContinuousArms(pose) {
    if (!this.continuousMode || !this.rightArmSynth || !this.leftArmSynth) return;
    
    const rightWrist = pose[16];  // Right wrist
    const leftWrist = pose[15];   // Left wrist
    
    // === RIGHT ARM (MELODY) ===
    if (rightWrist && rightWrist.visibility > this.armVisibilityThreshold) {
      const targetFreq = this.yToMelodyFreq(rightWrist.y);
      
      // Smooth frequency changes
      if (this.lastRightFreq === 0) this.lastRightFreq = targetFreq;
      this.lastRightFreq = this.lerp(this.lastRightFreq, targetFreq, this.armSmoothFactor);
      
      if (!this.rightArmActive) {
        // Start playing
        this.rightArmSynth.triggerAttack(this.lastRightFreq);
        this.rightArmActive = true;
        console.log('[BodyInstrument] 🎹 Right arm ON:', Math.round(this.lastRightFreq), 'Hz');
      } else {
        // Update frequency (portamento handles smoothing)
        this.rightArmSynth.setNote(this.lastRightFreq);
      }
      
      // Visual feedback
      if (this.onSoundTrigger) {
        this.onSoundTrigger('continuous_melody', this.lastRightFreq, rightWrist.y);
      }
    } else if (this.rightArmActive) {
      // Arm left frame - release note
      this.rightArmSynth.triggerRelease();
      this.rightArmActive = false;
      console.log('[BodyInstrument] 🎹 Right arm OFF');
    }
    
    // === LEFT ARM (BASS) ===
    if (leftWrist && leftWrist.visibility > this.armVisibilityThreshold) {
      const targetFreq = this.yToBassFreq(leftWrist.y);
      
      if (this.lastLeftFreq === 0) this.lastLeftFreq = targetFreq;
      this.lastLeftFreq = this.lerp(this.lastLeftFreq, targetFreq, this.armSmoothFactor);
      
      if (!this.leftArmActive) {
        this.leftArmSynth.triggerAttack(this.lastLeftFreq);
        this.leftArmActive = true;
        console.log('[BodyInstrument] 🎸 Left arm ON:', Math.round(this.lastLeftFreq), 'Hz');
      } else {
        this.leftArmSynth.setNote(this.lastLeftFreq);
      }
      
      if (this.onSoundTrigger) {
        this.onSoundTrigger('continuous_bass', this.lastLeftFreq, leftWrist.y);
      }
    } else if (this.leftArmActive) {
      this.leftArmSynth.triggerRelease();
      this.leftArmActive = false;
      console.log('[BodyInstrument] 🎸 Left arm OFF');
    }
  }
  
  // Convert Y position to melody frequency (exponential mapping)
  yToMelodyFreq(y) {
    // Y: 0 = top of frame, 1 = bottom
    // Invert so raising arm = higher pitch
    const normalized = 1 - Math.max(0, Math.min(1, y));
    
    // Exponential mapping for musical intervals
    return this.melodyRange.min * Math.pow(2, normalized * this.melodyRange.octaves);
  }
  
  // Convert Y position to bass frequency
  yToBassFreq(y) {
    const normalized = 1 - Math.max(0, Math.min(1, y));
    return this.bassRange.min * Math.pow(2, normalized * this.bassRange.octaves);
  }
  
  // Linear interpolation helper
  lerp(a, b, t) {
    return a + (b - a) * t;
  }
  
  // Toggle continuous mode
  setContinuousMode(enabled) {
    this.continuousMode = enabled;
    
    // Stop any active continuous sounds when disabling
    if (!enabled) {
      if (this.rightArmActive && this.rightArmSynth) {
        this.rightArmSynth.triggerRelease();
        this.rightArmActive = false;
      }
      if (this.leftArmActive && this.leftArmSynth) {
        this.leftArmSynth.triggerRelease();
        this.leftArmActive = false;
      }
    }
    
    console.log('[BodyInstrument] Continuous mode:', enabled ? 'ON' : 'OFF');
  }
  
  // ==============================================
  // MAIN UPDATE (called every frame)
  // ==============================================
  
  update(pose, hands, velocityTracker, gestures, faceBlendshapes) {
    if (!this.isInitialized || this.isMuted || !this.isEnabled) {
      // Debug: log why we're not playing
      if (this.isEnabled && !this.isInitialized) {
        console.log('[BodyInstrument] Skipping - not initialized');
      }
      return;
    }
    if (!pose || pose.length < 17) {
      console.log('[BodyInstrument] Skipping - no valid pose. Length:', pose?.length);
      return; // Need at least wrist landmarks
    }
    
    // Ensure audio context is running (can get suspended)
    if (this.Tone && this.Tone.context.state !== 'running') {
      this.Tone.context.resume().catch(e => console.warn('[BodyInstrument] Context resume failed:', e));
    }
    
    // === NEW: Continuous arm pitch control (like a theremin) ===
    if (this.continuousMode) {
      this.updateContinuousArms(pose);
    }
    
    // Extract relevant landmarks
    const rightWrist = pose[16];
    const leftWrist = pose[15];
    const rightElbow = pose[14];
    const leftElbow = pose[13];
    
    // Safety check - need valid wrists
    if (!rightWrist && !leftWrist) return;
    
    // Get velocities from tracker or calculate
    let rightVel = 0, leftVel = 0;
    
    if (velocityTracker) {
      const vels = velocityTracker.getVelocities?.() || {};
      rightVel = vels.wrists?.[1] || (rightWrist ? this.calculateVelocity(rightWrist, 'right') : 0);
      leftVel = vels.wrists?.[0] || (leftWrist ? this.calculateVelocity(leftWrist, 'left') : 0);
    } else {
      rightVel = rightWrist ? this.calculateVelocity(rightWrist, 'right') : 0;
      leftVel = leftWrist ? this.calculateVelocity(leftWrist, 'left') : 0;
    }
    
    // Smooth velocities
    rightVel = this.smoothVelocity(rightVel, 'right');
    leftVel = this.smoothVelocity(leftVel, 'left');
    
    // ===== RIGHT ARM = MELODY =====
    if (rightWrist && rightWrist.visibility > 0.5) {
      // Debug logging
      if (rightVel > this.velocityThreshold) {
        const note = this.positionToNote(rightWrist.y, this.currentScale);
        const volume = this.velocityToVolume(rightVel);
        console.log('[BodyInstrument] 🎵 Playing melody:', note, 'vel:', rightVel.toFixed(4));
        this.playMelody(note, volume);
      }
    }
    
    // ===== LEFT ARM = BASS =====
    if (leftWrist && leftWrist.visibility > 0.5) {
      if (leftVel > this.velocityThreshold) {
        const note = this.positionToBassNote(leftWrist.y);
        const volume = this.velocityToVolume(leftVel);
        this.playBass(note, volume);
      }
    }
    
    // ===== GESTURES = SPECIAL TRIGGERS =====
    this.handleGestures(gestures);
    
    // ===== FACE = EXPRESSION MODULATION =====
    this.handleFaceExpression(faceBlendshapes);
  }
  
  // ==============================================
  // VELOCITY HELPERS
  // ==============================================
  
  calculateVelocity(landmark, side) {
    if (!landmark || !this.lastPositions) {
      this.lastPositions = { left: null, right: null };
    }
    
    const last = this.lastPositions[side];
    if (!last) {
      this.lastPositions[side] = { x: landmark.x, y: landmark.y };
      return 0;
    }
    
    const dx = landmark.x - last.x;
    const dy = landmark.y - last.y;
    const velocity = Math.sqrt(dx * dx + dy * dy);
    
    this.lastPositions[side] = { x: landmark.x, y: landmark.y };
    return velocity;
  }
  
  smoothVelocity(velocity, side) {
    const history = this.velocityHistory[side];
    history.push(velocity);
    
    if (history.length > this.historyLength) {
      history.shift();
    }
    
    // Weighted average - recent values matter more
    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < history.length; i++) {
      const weight = i + 1;
      sum += history[i] * weight;
      weightSum += weight;
    }
    
    return sum / weightSum;
  }
  
  // ==============================================
  // SOUND TRIGGERS
  // ==============================================
  
  playMelody(note, volume = -6) {
    if (!this.melodySynth) return;
    if (this.lastNotes.melody === note) return; // Debounce same note
    
    try {
      this.melodySynth.triggerAttackRelease(
        note, 
        '8n', 
        undefined, 
        this.Tone.dbToGain(volume)
      );
      
      this.lastNotes.melody = note;
      
      // Visual feedback
      if (this.onSoundTrigger) {
        this.onSoundTrigger('melody', note, volume);
      }
      
      // Reset after delay
      clearTimeout(this.noteHoldTimers.melody);
      this.noteHoldTimers.melody = setTimeout(() => {
        this.lastNotes.melody = null;
      }, 150);
      
    } catch (e) {
      console.warn('[BodyInstrument] Melody error:', e);
    }
  }
  
  playBass(note, volume = -12) {
    if (!this.bassSynth) return;
    if (this.lastNotes.bass === note) return;
    
    try {
      this.bassSynth.triggerAttackRelease(
        note, 
        '4n', 
        undefined,
        this.Tone.dbToGain(volume)
      );
      
      this.lastNotes.bass = note;
      
      // Visual feedback
      if (this.onSoundTrigger) {
        this.onSoundTrigger('bass', note, volume);
      }
      
      clearTimeout(this.noteHoldTimers.bass);
      this.noteHoldTimers.bass = setTimeout(() => {
        this.lastNotes.bass = null;
      }, 400);
      
    } catch (e) {
      console.warn('[BodyInstrument] Bass error:', e);
    }
  }
  
  playPadChord() {
    if (!this.padSynth) return;
    
    const now = Date.now();
    if (now - this.lastChordTime < this.chordDebounce) return;
    this.lastChordTime = now;
    
    // Use scale-specific chord
    const notes = SCALE_CHORDS[this.currentScale] || SCALE_CHORDS.pentatonic;
    
    try {
      this.padSynth.triggerAttackRelease(notes, '2n', undefined, 0.4);
      console.log('[BodyInstrument] 🎶 Playing chord:', notes.join('-'), 'for scale:', this.currentScale);
      
      if (this.onSoundTrigger) {
        this.onSoundTrigger('chord', this.currentScale, 0);
      }
    } catch (e) {
      console.warn('[BodyInstrument] Pad error:', e);
    }
  }
  
  triggerKick() {
    if (!this.kickSynth) return;
    
    try {
      this.kickSynth.triggerAttackRelease('C1', '8n');
      
      if (this.onSoundTrigger) {
        this.onSoundTrigger('kick', 'C1', 0);
      }
    } catch (e) {
      console.warn('[BodyInstrument] Kick error:', e);
    }
  }
  
  triggerSnare() {
    if (!this.snareSynth) return;
    
    try {
      this.snareSynth.triggerAttackRelease('8n');
      
      if (this.onSoundTrigger) {
        this.onSoundTrigger('snare', null, 0);
      }
    } catch (e) {
      console.warn('[BodyInstrument] Snare error:', e);
    }
  }
  
  // ==============================================
  // GESTURE HANDLERS
  // ==============================================
  
  handleGestures(gestures) {
    if (!gestures || gestures.length === 0) return;
    
    const now = Date.now();
    
    // DEBUG: Log raw gesture data once per second
    if (now - (this._lastGestureLog || 0) > 1000) {
      console.log('[BodyInstrument] 📡 All gestures:', JSON.stringify(gestures.map(g => g?.name)));
      this._lastGestureLog = now;
    }
    
    gestures.forEach((gesture, idx) => {
      if (!gesture || !gesture.name) return;
      
      const side = idx === 0 ? 'left' : 'right';
      const gestureName = gesture.name;
      
      // Skip "None" gestures
      if (gestureName === 'None') return;
      
      // Debounce gestures (except for scale changes which use longer debounce)
      const timeSinceLast = now - this.lastGestureTime[side];
      const isScaleGesture = gestureName === 'Victory' || gestureName === 'ILoveYou' || gestureName === 'Thumb_Down';
      const debounceTime = isScaleGesture ? 800 : this.gestureDebounce; // Longer debounce for scale changes
      
      if (timeSinceLast < debounceTime) {
        return;
      }
      
      switch(gestureName) {
        case 'Open_Palm':
          this.playPadChord('major');
          this.lastGestureTime[side] = now;
          break;
          
        case 'Closed_Fist':
          // Left fist = kick, Right fist = snare
          if (side === 'left') {
            this.triggerKick();
          } else {
            this.triggerSnare();
          }
          this.lastGestureTime[side] = now;
          break;
        
        // === SCALE CHANGE GESTURES ===
        // Multiple gestures can change scale for reliability:
        // - Victory (✌️ peace sign)
        // - ILoveYou (🤟 rock/metal sign - pinky, index, thumb up)
        // - Thumb_Down (👎 thumbs down)
        case 'Victory':
        case 'ILoveYou':
        case 'Thumb_Down':
          console.log(`[BodyInstrument] 🎼 Scale change gesture: ${gestureName} (${side})`);
          const newScale = this.cycleScale();
          console.log(`[BodyInstrument] 🎼 Now playing: ${newScale}`);
          this.lastGestureTime[side] = now;
          // Also update the other hand's debounce to prevent double-triggers
          this.lastGestureTime[side === 'left' ? 'right' : 'left'] = now;
          break;
          
        case 'Pointing_Up':
          // Sustain mode - increase release time temporarily
          if (this.melodySynth) {
            this.melodySynth.set({ envelope: { release: 2 } });
            setTimeout(() => {
              this.melodySynth.set({ envelope: { release: 0.8 } });
            }, 2000);
          }
          this.lastGestureTime[side] = now;
          break;
          
        case 'Thumb_Up':
          // Toggle mute
          this.setMuted(!this.isMuted);
          this.lastGestureTime[side] = now;
          break;
      }
    });
  }
  
  handleFaceExpression(blendshapes) {
    if (!blendshapes || blendshapes.length === 0) return;
    
    const shapes = blendshapes[0]?.categories;
    if (!shapes) return;
    
    // Convert to map for easy access
    const shapeMap = {};
    shapes.forEach(s => shapeMap[s.categoryName] = s.score);
    
    // Mouth open = filter cutoff (wah effect)
    const mouthOpen = shapeMap['jawOpen'] || 0;
    if (this.filter) {
      const targetFreq = 400 + (mouthOpen * 4000); // 400-4400 Hz
      this.filter.frequency.rampTo(targetFreq, 0.1);
    }
    
    // Eyebrows up = more reverb
    const browUp = shapeMap['browInnerUp'] || 0;
    if (this.reverb) {
      const targetWet = 0.2 + (browUp * 0.5); // 0.2-0.7
      this.reverb.wet.rampTo(targetWet, 0.2);
    }
    
    // Smile = detune (subtle vibrato)
    const smile = (shapeMap['mouthSmileLeft'] || 0) + (shapeMap['mouthSmileRight'] || 0);
    if (this.melodySynth && smile > 0.3) {
      // Add slight detune when smiling
      this.melodySynth.set({
        oscillator: { detune: smile * 10 }
      });
    }
  }
  
  // ==============================================
  // UTILITY METHODS
  // ==============================================
  
  positionToNote(y, scaleName) {
    const scale = SCALES[scaleName] || SCALES.pentatonic;
    // Y is 0 (top) to 1 (bottom), invert so higher = higher notes
    const normalizedY = 1 - Math.max(0, Math.min(1, y));
    const index = Math.floor(normalizedY * scale.length);
    return scale[Math.min(index, scale.length - 1)];
  }
  
  positionToBassNote(y) {
    const bassScale = BASS_SCALES[this.currentScale] || BASS_SCALES.pentatonic;
    const normalizedY = 1 - Math.max(0, Math.min(1, y));
    const index = Math.floor(normalizedY * bassScale.length);
    return bassScale[Math.min(index, bassScale.length - 1)];
  }
  
  velocityToVolume(velocity) {
    // Velocity 0-0.15 maps to -24dB to -3dB
    const normalized = Math.min(1, velocity / 0.15);
    return -24 + (normalized * 21);
  }
  
  cycleScale() {
    const scaleNames = Object.keys(SCALES);
    const currentIdx = scaleNames.indexOf(this.currentScale);
    const nextIdx = (currentIdx + 1) % scaleNames.length;
    this.setScale(scaleNames[nextIdx]);
    return this.currentScale;
  }
  
  setScale(scaleName) {
    if (!SCALES[scaleName]) {
      console.warn('[BodyInstrument] Unknown scale:', scaleName);
      return;
    }
    
    this.currentScale = scaleName;
    console.log('[BodyInstrument] 🎼 Scale changed to:', this.currentScale);
    
    // Update synth sound based on scale
    this.updateSynthForScale(scaleName);
    
    if (this.onSoundTrigger) {
      this.onSoundTrigger('scale', this.currentScale, 0);
    }
  }
  
  updateSynthForScale(scaleName) {
    if (!this.melodySynth) return;
    
    const settings = SCALE_SYNTH_SETTINGS[scaleName] || SCALE_SYNTH_SETTINGS.pentatonic;
    
    try {
      // Update oscillator type for tonal variety
      this.melodySynth.set({
        oscillator: { type: settings.type },
        envelope: {
          attack: settings.attack,
          decay: settings.decay,
          sustain: settings.sustain,
          release: settings.release
        }
      });
      
      // Update bass synth too
      if (this.bassSynth) {
        const bassType = settings.type === 'sawtooth' ? 'triangle' : settings.type;
        this.bassSynth.set({
          oscillator: { type: bassType },
          envelope: {
            attack: settings.attack * 1.5,
            decay: settings.decay * 1.2,
            sustain: settings.sustain * 0.8,
            release: settings.release * 1.5
          }
        });
      }
      
      // Adjust reverb based on scale mood
      if (this.reverb) {
        const isAmbient = ['japanese', 'minor', 'dorian'].includes(scaleName);
        this.reverb.set({ wet: isAmbient ? 0.45 : 0.3 });
      }
      
      console.log('[BodyInstrument] 🎹 Synth updated for', scaleName, '- type:', settings.type);
    } catch (e) {
      console.warn('[BodyInstrument] Failed to update synth:', e);
    }
  }
  
  // ==============================================
  // PUBLIC API
  // ==============================================
  
  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log('[BodyInstrument]', enabled ? '🔊 Enabled' : '🔇 Disabled');
    
    // When enabling, ensure audio context is running
    if (enabled && this.Tone) {
      if (this.Tone.context.state !== 'running') {
        this.Tone.context.resume().then(() => {
          console.log('[BodyInstrument] Audio context resumed');
        }).catch(e => {
          console.warn('[BodyInstrument] Failed to resume context:', e);
        });
      }
    }
  }
  
  setMuted(muted) {
    this.isMuted = muted;
    if (this.Tone) {
      this.Tone.Destination.mute = muted;
    }
    console.log('[BodyInstrument]', muted ? '🔇 Muted' : '🔊 Unmuted');
  }
  
  setVolume(db) {
    this.masterVolume = db;
    if (this.Tone) {
      this.Tone.Destination.volume.value = db;
    }
  }
  
  setScale(scaleName) {
    if (SCALES[scaleName]) {
      this.currentScale = scaleName;
      console.log('[BodyInstrument] Scale set to:', scaleName);
    }
  }
  
  getScales() {
    return Object.keys(SCALES);
  }
  
  getCurrentScale() {
    return this.currentScale;
  }
  
  dispose() {
    // Clear timers
    Object.values(this.noteHoldTimers).forEach(timer => clearTimeout(timer));
    
    // Dispose synths
    this.melodySynth?.dispose();
    this.bassSynth?.dispose();
    this.padSynth?.dispose();
    this.kickSynth?.dispose();
    this.snareSynth?.dispose();
    
    // Dispose effects
    this.reverb?.dispose();
    this.delay?.dispose();
    this.filter?.dispose();
    this.limiter?.dispose();
    
    this.isInitialized = false;
    console.log('[BodyInstrument] Disposed');
  }
}

// Export singleton instance
export const bodyInstrument = new BodyInstrument();
