/**
 * CORPUS — Musical Body Instrument
 * Transform body movements into music using Web Audio API + Tone.js
 * 
 * "The body is the instrument. The algorithm is the composer. The user is the virtuoso."
 */

// ==============================================
// SCALE & NOTE DEFINITIONS
// ==============================================

const SCALES = {
  pentatonic: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
  minor: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
  major: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  blues: ['C4', 'Eb4', 'F4', 'Gb4', 'G4', 'Bb4', 'C5', 'Eb5'],
  japanese: ['C4', 'Db4', 'F4', 'G4', 'Ab4', 'C5', 'Db5', 'F5'],
  dorian: ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5']
};

const BASS_NOTES = ['C2', 'E2', 'G2', 'A2', 'C3', 'E3', 'G3', 'A3'];

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
  
  playPadChord(chordName = 'major') {
    if (!this.padSynth) return;
    
    const now = Date.now();
    if (now - this.lastChordTime < this.chordDebounce) return;
    this.lastChordTime = now;
    
    const notes = CHORDS[chordName] || CHORDS.major;
    
    try {
      this.padSynth.triggerAttackRelease(notes, '2n', undefined, 0.4);
      
      if (this.onSoundTrigger) {
        this.onSoundTrigger('chord', chordName, 0);
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
    
    gestures.forEach((gesture, idx) => {
      if (!gesture || !gesture.name) return;
      
      const side = idx === 0 ? 'left' : 'right';
      
      // Debounce gestures
      if (now - this.lastGestureTime[side] < this.gestureDebounce) return;
      
      switch(gesture.name) {
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
          
        case 'Victory':
          this.cycleScale();
          this.lastGestureTime[side] = now;
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
    const normalizedY = 1 - Math.max(0, Math.min(1, y));
    const index = Math.floor(normalizedY * BASS_NOTES.length);
    return BASS_NOTES[Math.min(index, BASS_NOTES.length - 1)];
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
    this.currentScale = scaleNames[nextIdx];
    
    console.log('[BodyInstrument] 🎼 Scale changed to:', this.currentScale);
    
    if (this.onSoundTrigger) {
      this.onSoundTrigger('scale', this.currentScale, 0);
    }
    
    return this.currentScale;
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
