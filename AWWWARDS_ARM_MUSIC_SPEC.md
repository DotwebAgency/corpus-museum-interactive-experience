# Senior Audio Engineer Specification: Dual-Arm Musical Instrument

## 🎵 Executive Summary

Transform body tracking into an **expressive musical instrument** where:
- **Right Arm Height** → Melody pitch (continuous)
- **Left Arm Height** → Bass/Harmony pitch (continuous)
- **Arm Movement Speed** → Volume/Expression
- **Gestures** → Special effects (drums, chords, scale changes)

---

## 🎹 Audio Engineering Analysis

### Current Implementation Review

The existing `body-instrument.js` uses:
- **Discrete note selection** based on Y position
- **Velocity-based triggering** (movement threshold)
- **Note debouncing** (100ms between notes)
- **PolySynth** for melody/bass/pad
- **Effects chain**: Reverb → Delay → Filter → Limiter

### Problems with Current Approach:
1. **Discrete notes feel robotic** — No smooth pitch glides
2. **Velocity threshold blocks sustained playing** — Can't hold notes
3. **Both arms use same logic** — No instrument differentiation
4. **No visual pitch feedback** — User can't see their pitch

---

## 🎯 Target Experience

### What User Should Feel:
> "Raising my right arm feels like sliding up a piano.
> My left arm plays a deep bass that rumbles.
> When I move slowly, notes sustain beautifully.
> When I move fast, I can play rapid passages."

### Reference Experiences:
- **Theremin** — Continuous pitch control via hand position
- **Ribbon Controller** — Slide between notes smoothly
- **Trombone** — Position-based pitch with smooth glides

---

## 📐 Technical Specification

### Dual-Arm Architecture

```
RIGHT ARM (Melody)                    LEFT ARM (Bass/Harmony)
┌─────────────────────┐              ┌─────────────────────┐
│    High Position    │ → C5 (523Hz) │    High Position    │ → G3 (196Hz)
│         ↕          │              │         ↕          │
│  Continuous Glide  │              │  Continuous Glide   │
│         ↕          │              │         ↕          │
│    Low Position     │ → C3 (131Hz) │    Low Position     │ → C2 (65Hz)
└─────────────────────┘              └─────────────────────┘
        │                                    │
        ▼                                    ▼
   MonoSynth                            MonoSynth
   (Lead Tone)                         (Bass Tone)
        │                                    │
        └───────────┬────────────────────────┘
                    ▼
              Reverb → Delay → Filter → Master
```

### Pitch Mapping

#### Right Arm (Melody)
```javascript
// Y position 0.0 (top) to 1.0 (bottom) of frame
// Maps to C3 (131Hz) to C5 (523Hz) — 2 octaves

const melodyRange = {
  minFreq: 130.81,  // C3
  maxFreq: 523.25,  // C5
  octaves: 2
};

function yToMelodyFreq(y) {
  // Invert Y (0 = bottom in screen coords)
  const normalized = 1 - Math.max(0, Math.min(1, y));
  
  // Exponential mapping for musical intervals
  const freq = melodyRange.minFreq * Math.pow(2, normalized * melodyRange.octaves);
  
  return freq;
}
```

#### Left Arm (Bass)
```javascript
// Lower range, deeper octave
const bassRange = {
  minFreq: 65.41,   // C2
  maxFreq: 196.00,  // G3
  octaves: 1.5
};

function yToBassFreq(y) {
  const normalized = 1 - Math.max(0, Math.min(1, y));
  const freq = bassRange.minFreq * Math.pow(2, normalized * bassRange.octaves);
  return freq;
}
```

### Synth Configuration

#### Melody Synth (MonoSynth for smooth glides)
```javascript
const melodySynth = new Tone.MonoSynth({
  oscillator: {
    type: "sine"  // Pure, theremin-like
  },
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
  // CRITICAL: Portamento for smooth glides
  portamento: 0.05  // 50ms glide between notes
}).toDestination();
```

#### Bass Synth (MonoSynth with different character)
```javascript
const bassSynth = new Tone.MonoSynth({
  oscillator: {
    type: "triangle"  // Warmer, rounder bass
  },
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
    baseFrequency: 100,
    octaves: 2.5
  },
  portamento: 0.08  // Slightly slower glide for bass
}).toDestination();
```

---

## 🔧 Implementation Details

### State Management

```javascript
class DualArmInstrument {
  constructor() {
    // Synths
    this.melodySynth = null;
    this.bassSynth = null;
    
    // State
    this.melodyActive = false;
    this.bassActive = false;
    this.lastMelodyFreq = 0;
    this.lastBassFreq = 0;
    
    // Smoothing
    this.melodySmooth = 0.15;  // Lower = more responsive
    this.bassSmooth = 0.2;    // Bass slightly smoother
    
    // Activity detection
    this.rightArmVisible = false;
    this.leftArmVisible = false;
    
    // Thresholds
    this.visibilityThreshold = 0.5;
    this.frequencyChangeThreshold = 1; // Hz - ignore tiny changes
  }
}
```

### Update Loop (60fps)

```javascript
update(pose) {
  const rightWrist = pose[16];  // Right wrist landmark
  const leftWrist = pose[15];   // Left wrist landmark
  
  // === RIGHT ARM (MELODY) ===
  if (rightWrist && rightWrist.visibility > this.visibilityThreshold) {
    const targetFreq = this.yToMelodyFreq(rightWrist.y);
    
    // Smooth frequency changes
    this.lastMelodyFreq = this.lerp(
      this.lastMelodyFreq, 
      targetFreq, 
      this.melodySmooth
    );
    
    if (!this.melodyActive) {
      // Start playing
      this.melodySynth.triggerAttack(this.lastMelodyFreq);
      this.melodyActive = true;
    } else {
      // Update frequency (portamento handles smoothing)
      this.melodySynth.setNote(this.lastMelodyFreq);
    }
  } else if (this.melodyActive) {
    // Arm left frame - release note
    this.melodySynth.triggerRelease();
    this.melodyActive = false;
  }
  
  // === LEFT ARM (BASS) ===
  if (leftWrist && leftWrist.visibility > this.visibilityThreshold) {
    const targetFreq = this.yToBassFreq(leftWrist.y);
    
    this.lastBassFreq = this.lerp(
      this.lastBassFreq, 
      targetFreq, 
      this.bassSmooth
    );
    
    if (!this.bassActive) {
      this.bassSynth.triggerAttack(this.lastBassFreq);
      this.bassActive = true;
    } else {
      this.bassSynth.setNote(this.lastBassFreq);
    }
  } else if (this.bassActive) {
    this.bassSynth.triggerRelease();
    this.bassActive = false;
  }
}

lerp(a, b, t) {
  return a + (b - a) * t;
}
```

### Scale Quantization (Optional)

For more musical results, quantize to scale:

```javascript
quantizeToScale(freq, scale) {
  const scaleFreqs = this.getScaleFrequencies(scale);
  
  // Find nearest scale frequency
  let nearest = scaleFreqs[0];
  let minDiff = Math.abs(freq - nearest);
  
  for (const scaleFreq of scaleFreqs) {
    const diff = Math.abs(freq - scaleFreq);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = scaleFreq;
    }
  }
  
  return nearest;
}

getScaleFrequencies(scaleName) {
  const scales = {
    pentatonic: [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
    minor: [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25],
    // ... etc
  };
  return scales[scaleName] || scales.pentatonic;
}
```

---

## 🎨 Visual Feedback

### Pitch Indicator UI

```
┌─────────────────────────────────────────────┐
│                                             │
│    ┌───┐                         ┌───┐     │
│    │ R │ ←── Melody indicator    │ L │     │
│    │   │     (gold dot on rail)  │   │     │
│    │ ● │                         │   │     │
│    │   │                         │ ● │     │
│    │   │                         │   │     │
│    └───┘                         └───┘     │
│                                             │
└─────────────────────────────────────────────┘
```

### CSS for Pitch Rails
```css
.pitch-rail {
  position: absolute;
  width: 4px;
  height: 200px;
  background: linear-gradient(
    to bottom,
    var(--gold-bright) 0%,
    var(--gold-muted) 100%
  );
  opacity: 0.3;
}

.pitch-indicator {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold-bright);
  box-shadow: 0 0 12px var(--gold-glow);
  transform: translateX(-4px);
  transition: top 50ms ease-out;
}
```

---

## 🔊 Effects Chain

```javascript
// Create effects chain
const reverb = new Tone.Reverb({
  decay: 2.5,
  wet: 0.3
}).toDestination();

const delay = new Tone.FeedbackDelay({
  delayTime: "8n",
  feedback: 0.2,
  wet: 0.15
}).connect(reverb);

const filter = new Tone.Filter({
  frequency: 2000,
  type: "lowpass",
  rolloff: -12
}).connect(delay);

// Connect synths
melodySynth.connect(filter);
bassSynth.connect(filter);
```

---

## 📱 Mode Options

### Mode 1: Continuous (Default)
- Smooth theremin-like glides
- No scale quantization
- Most expressive

### Mode 2: Quantized
- Snaps to nearest scale note
- Easier to play "correctly"
- Still has portamento between notes

### Mode 3: Discrete (Current)
- Only triggers when velocity threshold met
- Traditional note-by-note playing
- Compatible with existing logic

---

## ✅ Success Metrics

1. **Latency**: < 20ms from arm movement to pitch change
2. **Smoothness**: No audible stepping between frequencies
3. **Separation**: Bass and melody clearly distinguishable
4. **Control**: User can hit specific pitches after practice
5. **Expression**: Volume responds to movement speed

---

## 🏆 Summary

This specification transforms the body instrument from:
- **Discrete note triggers** → **Continuous pitch control**
- **Single instrument feel** → **Dual independent instruments**
- **Velocity-gated** → **Position-sustained**
- **Robotic** → **Expressive and theremin-like**

The result is a truly musical experience where the user's body becomes their instrument.
