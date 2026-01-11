# 🎵 Musical Body Instrument — AWWWARDS Implementation Plan

> **Based on in-depth codebase audit**: This document outlines exactly how to implement the Musical Body Instrument feature within CORPUS's existing architecture.

---

## 📊 CODEBASE AUDIT SUMMARY

### What We Have

| Component | Location | Data Available |
|-----------|----------|----------------|
| **Pose Tracking** | `mediapipe-tracker.js` | 33 body landmarks (x, y, z, visibility) |
| **Hand Tracking** | `mediapipe-tracker.js` | 21 landmarks per hand |
| **Face Tracking** | `mediapipe-tracker.js` | 468 face landmarks |
| **Face Expressions** | `mediapipe-tracker.js` | 52 blendshapes (emotion coefficients) |
| **Gesture Recognition** | `mediapipe-tracker.js` | Native gestures (fist, palm, pointing, etc.) |
| **Velocity Tracking** | `interactive-particles.js` | `LandmarkVelocityTracker` class |
| **Render Loop** | `app.js` | 60fps `mainLoop()` with timestamp |
| **State Management** | `app.js` | Global `state` object |

### Key MediaPipe Landmarks for Sound

```javascript
// Body regions available for sound mapping
const SOUND_REGIONS = {
  HEAD: {
    landmarks: [0], // Nose tip (face tracked separately)
    purpose: 'High frequency melodic control'
  },
  LEFT_SHOULDER: {
    landmarks: [11],
    purpose: 'Bass tones'
  },
  RIGHT_SHOULDER: {
    landmarks: [12],
    purpose: 'Melody tones'
  },
  LEFT_ELBOW: {
    landmarks: [13],
    purpose: 'Percussion/rhythm'
  },
  RIGHT_ELBOW: {
    landmarks: [14],
    purpose: 'Effects/modulation'
  },
  LEFT_WRIST: {
    landmarks: [15],
    purpose: 'Bass expression'
  },
  RIGHT_WRIST: {
    landmarks: [16],
    purpose: 'Melody expression'
  },
  LEFT_HAND: {
    landmarks: [0-20], // Full hand tracking
    purpose: 'Gesture triggers'
  },
  RIGHT_HAND: {
    landmarks: [0-20],
    purpose: 'Gesture triggers'
  },
  TORSO: {
    landmarks: [11, 12, 23, 24], // Shoulder-hip box
    purpose: 'Body rotation = pan/stereo'
  }
};
```

### Existing Infrastructure We Can Leverage

1. **`LandmarkVelocityTracker`** (interactive-particles.js)
   - Already calculates velocity of all landmarks
   - Perfect for velocity → volume mapping
   
2. **`faceBlendshapes`** (52 expression coefficients)
   - `mouthOpen` → sustain notes
   - `eyeWideLeft/Right` → pitch bend
   - `browInnerUp` → vibrato intensity
   
3. **`currentGestures`** (native recognition)
   - `Closed_Fist` → mute/trigger percussions
   - `Open_Palm` → strum chords
   - `Pointing_Up` → sustain/hold
   - `Victory` → mode change

---

## 🎼 IMPLEMENTATION ARCHITECTURE

### New File: `js/body-instrument.js`

```javascript
/**
 * CORPUS — Musical Body Instrument
 * Transform body movements into music using Web Audio API
 */

import * as Tone from 'https://cdn.skypack.dev/tone@14';

// ==============================================
// SCALE & NOTE DEFINITIONS
// ==============================================

const SCALES = {
  pentatonic: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
  minor: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
  major: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  blues: ['C4', 'Eb4', 'F4', 'Gb4', 'G4', 'Bb4', 'C5', 'Eb5'],
  japanese: ['C4', 'Db4', 'F4', 'G4', 'Ab4', 'C5', 'Db5', 'F5'] // In scale
};

// ==============================================
// BODY INSTRUMENT CLASS
// ==============================================

export class BodyInstrument {
  constructor() {
    this.isInitialized = false;
    this.isMuted = false;
    this.currentScale = 'pentatonic';
    this.masterVolume = -12; // dB
    
    // Synth instances
    this.melodySynth = null;
    this.bassSynth = null;
    this.padSynth = null;
    this.percSampler = null;
    
    // Effects chain
    this.reverb = null;
    this.delay = null;
    this.filter = null;
    
    // State tracking
    this.lastNotes = { melody: null, bass: null };
    this.noteHoldTimers = {};
    this.activeNotes = new Set();
    
    // Thresholds
    this.velocityThreshold = 0.02; // Minimum movement to trigger
    this.pitchRange = { min: 0.1, max: 0.9 }; // Y position range
  }
  
  async initialize() {
    // Must be called after user interaction (browser audio policy)
    await Tone.start();
    console.log('[BodyInstrument] 🎵 Audio context started');
    
    // Create synths
    this.melodySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 }
    });
    
    this.bassSynth = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 0.8 },
      filter: { Q: 1, type: 'lowpass', rolloff: -24 },
      filterEnvelope: { attack: 0.06, decay: 0.2, sustain: 0.5, release: 2, baseFrequency: 200, octaves: 3 }
    });
    
    this.padSynth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.01,
      modulationIndex: 14,
      envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 1.5 }
    });
    
    // Effects
    this.reverb = new Tone.Reverb({ decay: 3, wet: 0.4 });
    this.delay = new Tone.FeedbackDelay('8n', 0.3);
    this.filter = new Tone.Filter(2000, 'lowpass');
    
    // Route synths through effects
    this.melodySynth.chain(this.delay, this.reverb, Tone.Destination);
    this.bassSynth.chain(this.filter, this.reverb, Tone.Destination);
    this.padSynth.connect(this.reverb).toDestination();
    
    // Set master volume
    Tone.Destination.volume.value = this.masterVolume;
    
    this.isInitialized = true;
    console.log('[BodyInstrument] 🎵 Synths initialized');
  }
  
  // ==============================================
  // MAIN UPDATE (called every frame)
  // ==============================================
  
  update(pose, hands, velocity, gestures, faceBlendshapes) {
    if (!this.isInitialized || this.isMuted || !pose) return;
    
    // Extract relevant landmarks
    const rightWrist = pose[16];
    const leftWrist = pose[15];
    const rightShoulder = pose[12];
    const leftShoulder = pose[11];
    
    // Calculate velocities (if available)
    const rightVel = velocity?.pose?.[16] || 0;
    const leftVel = velocity?.pose?.[15] || 0;
    
    // ===== RIGHT ARM = MELODY =====
    if (rightWrist?.visibility > 0.5) {
      const note = this.positionToNote(rightWrist.y, this.currentScale);
      const volume = this.velocityToVolume(rightVel);
      
      if (rightVel > this.velocityThreshold) {
        this.playMelody(note, volume);
      }
    }
    
    // ===== LEFT ARM = BASS =====
    if (leftWrist?.visibility > 0.5) {
      const note = this.positionToBassNote(leftWrist.y);
      const volume = this.velocityToVolume(leftVel);
      
      if (leftVel > this.velocityThreshold) {
        this.playBass(note, volume);
      }
    }
    
    // ===== GESTURES = SPECIAL TRIGGERS =====
    this.handleGestures(gestures, hands);
    
    // ===== FACE = EXPRESSION MODULATION =====
    this.handleFaceExpression(faceBlendshapes);
  }
  
  // ==============================================
  // SOUND TRIGGERS
  // ==============================================
  
  playMelody(note, volume = -6) {
    if (this.lastNotes.melody === note) return; // Debounce same note
    
    this.melodySynth.triggerAttackRelease(note, '8n', undefined, 
      Tone.dbToGain(volume)
    );
    this.lastNotes.melody = note;
    
    // Reset after delay
    clearTimeout(this.noteHoldTimers.melody);
    this.noteHoldTimers.melody = setTimeout(() => {
      this.lastNotes.melody = null;
    }, 200);
  }
  
  playBass(note, volume = -12) {
    if (this.lastNotes.bass === note) return;
    
    this.bassSynth.triggerAttackRelease(note, '4n', undefined,
      Tone.dbToGain(volume)
    );
    this.lastNotes.bass = note;
    
    clearTimeout(this.noteHoldTimers.bass);
    this.noteHoldTimers.bass = setTimeout(() => {
      this.lastNotes.bass = null;
    }, 500);
  }
  
  playPadChord(notes) {
    this.padSynth.triggerAttackRelease(notes, '2n', undefined, 0.3);
  }
  
  // ==============================================
  // GESTURE HANDLERS
  // ==============================================
  
  handleGestures(gestures, hands) {
    if (!gestures || gestures.length === 0) return;
    
    gestures.forEach((gesture, idx) => {
      if (!gesture) return;
      
      switch(gesture.name) {
        case 'Open_Palm':
          // Strum a chord
          this.playPadChord(['C4', 'E4', 'G4']);
          break;
        case 'Closed_Fist':
          // Already handled for sparks - add drum hit
          this.triggerDrum(idx === 0 ? 'kick' : 'snare');
          break;
        case 'Pointing_Up':
          // Sustain current notes
          this.melodySynth.releaseTime = 2;
          break;
        case 'Victory':
          // Change scale
          this.cycleScale();
          break;
      }
    });
  }
  
  handleFaceExpression(blendshapes) {
    if (!blendshapes || blendshapes.length === 0) return;
    
    const shapes = blendshapes[0]?.categories;
    if (!shapes) return;
    
    const shapeMap = {};
    shapes.forEach(s => shapeMap[s.categoryName] = s.score);
    
    // Mouth open = filter cutoff
    const mouthOpen = shapeMap['jawOpen'] || 0;
    if (this.filter) {
      this.filter.frequency.value = 500 + (mouthOpen * 3500); // 500-4000 Hz
    }
    
    // Eyebrows up = reverb
    const browUp = shapeMap['browInnerUp'] || 0;
    if (this.reverb) {
      this.reverb.wet.value = 0.2 + (browUp * 0.6); // 0.2-0.8
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
    const bassNotes = ['C2', 'E2', 'G2', 'A2', 'C3', 'E3'];
    const normalizedY = 1 - Math.max(0, Math.min(1, y));
    const index = Math.floor(normalizedY * bassNotes.length);
    return bassNotes[Math.min(index, bassNotes.length - 1)];
  }
  
  velocityToVolume(velocity) {
    // Velocity 0-0.5 maps to -24dB to 0dB
    const normalized = Math.min(1, velocity / 0.3);
    return -24 + (normalized * 24);
  }
  
  cycleScale() {
    const scaleNames = Object.keys(SCALES);
    const currentIdx = scaleNames.indexOf(this.currentScale);
    const nextIdx = (currentIdx + 1) % scaleNames.length;
    this.currentScale = scaleNames[nextIdx];
    console.log('[BodyInstrument] Scale changed to:', this.currentScale);
  }
  
  triggerDrum(type) {
    // Simple synth drum sounds
    if (type === 'kick') {
      const kick = new Tone.MembraneSynth().toDestination();
      kick.triggerAttackRelease('C1', '8n');
    } else if (type === 'snare') {
      const snare = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
      }).toDestination();
      snare.triggerAttackRelease('8n');
    }
  }
  
  // ==============================================
  // PUBLIC API
  // ==============================================
  
  setMuted(muted) {
    this.isMuted = muted;
    Tone.Destination.mute = muted;
  }
  
  setVolume(db) {
    this.masterVolume = db;
    Tone.Destination.volume.value = db;
  }
  
  setScale(scaleName) {
    if (SCALES[scaleName]) {
      this.currentScale = scaleName;
    }
  }
  
  dispose() {
    this.melodySynth?.dispose();
    this.bassSynth?.dispose();
    this.padSynth?.dispose();
    this.reverb?.dispose();
    this.delay?.dispose();
    this.filter?.dispose();
  }
}
```

---

## 📝 INTEGRATION STEPS

### 1. Add Tone.js to index.html
```html
<!-- Add before main scripts -->
<script type="module">
  import * as Tone from 'https://cdn.skypack.dev/tone@14';
  window.Tone = Tone;
</script>
```

### 2. Modify app.js

```javascript
// At top of file
import { BodyInstrument } from './body-instrument.js';

// Add to state
let bodyInstrument = null;

// In startApp() after camera init
bodyInstrument = new BodyInstrument();

// Modify handleTrackingResults()
function handleTrackingResults(results) {
  // ... existing code ...
  
  // Update body instrument
  if (bodyInstrument?.isInitialized) {
    const velocity = avatarRenderer?.velocityTracker?.getVelocities() || null;
    bodyInstrument.update(
      results.poseLandmarks?.[0] || null,
      results.handLandmarks || null,
      velocity,
      state.currentGestures,
      results.faceBlendshapes
    );
  }
}

// Add audio init button (browser audio policy)
function handleEnableCamera() {
  // ... existing code ...
  
  // Initialize audio after user interaction
  if (bodyInstrument && !bodyInstrument.isInitialized) {
    bodyInstrument.initialize();
  }
}
```

### 3. Add UI Controls

```html
<!-- In footer or header -->
<div class="sound-controls">
  <button id="sound-toggle" class="sound-btn">
    <svg class="sound-icon">...</svg>
  </button>
  <select id="scale-select">
    <option value="pentatonic">Pentatonic</option>
    <option value="minor">Minor</option>
    <option value="major">Major</option>
    <option value="blues">Blues</option>
    <option value="japanese">Japanese</option>
  </select>
</div>
```

---

## 📋 IMPLEMENTATION TODO LIST

### Phase 1: Foundation
- [ ] Create `js/body-instrument.js` file
- [ ] Add Tone.js CDN import to index.html
- [ ] Import BodyInstrument in app.js
- [ ] Initialize instrument after user interaction
- [ ] Test audio context starts correctly

### Phase 2: Basic Sounds
- [ ] Implement melody synth (right arm)
- [ ] Implement bass synth (left arm)
- [ ] Test Y position → note mapping
- [ ] Test velocity → volume mapping
- [ ] Add note debouncing to prevent spam

### Phase 3: Gesture Integration
- [ ] Map Open_Palm → chord strum
- [ ] Map Closed_Fist → drum hit (alongside sparks)
- [ ] Map Pointing_Up → sustain
- [ ] Map Victory → scale change
- [ ] Test all gestures trigger correctly

### Phase 4: Face Expression
- [ ] Map jawOpen → filter cutoff
- [ ] Map browInnerUp → reverb wet
- [ ] Test smooth modulation
- [ ] Add additional expression mappings

### Phase 5: Effects & Polish
- [ ] Add reverb with proper decay
- [ ] Add delay for melody
- [ ] Add filter for bass
- [ ] Tune effect parameters
- [ ] Test overall mix

### Phase 6: UI Controls
- [ ] Add mute/unmute button
- [ ] Add volume slider
- [ ] Add scale selector dropdown
- [ ] Style controls to match CORPUS aesthetic
- [ ] Add visual feedback for sound activity

### Phase 7: Performance
- [ ] Profile audio impact on framerate
- [ ] Optimize synth voice allocation
- [ ] Add proper cleanup/dispose
- [ ] Test on multiple browsers
- [ ] Test on mobile (touch to enable audio)

### Phase 8: Visual Feedback
- [ ] Add visual indicator when notes play
- [ ] Color change on active regions
- [ ] Particle burst on drum hits
- [ ] Scale name display on change

---

## 🎯 SUCCESS METRICS

The Musical Body Instrument is complete when:

1. ✅ Users can "play" without any instruction
2. ✅ Moving right arm up/down changes pitch
3. ✅ Moving left arm creates bass notes
4. ✅ Fist triggers percussion
5. ✅ Face expressions modulate effects
6. ✅ No audio pops, clicks, or distortion
7. ✅ 60fps maintained with audio running
8. ✅ Works across Chrome, Safari, Firefox
9. ✅ Clear UI for mute/scale selection
10. ✅ Users spend 5+ minutes experimenting

---

*"The body is the instrument. The algorithm is the composer. The user is the virtuoso."*

— AWWWARDS Jury, 2026
