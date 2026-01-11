# 🎵 MUSICAL BODY INSTRUMENT — IMPLEMENTATION TODO LIST

> **Comprehensive task breakdown for transforming CORPUS into a musical instrument**

---

## 📅 PHASE 1: Foundation (Day 1)

### Setup & Infrastructure
- [ ] Create `js/body-instrument.js` file
- [ ] Add Tone.js import via CDN (skypack.dev/tone@14)
- [ ] Add module type to script imports in index.html
- [ ] Create BodyInstrument class with constructor
- [ ] Add initialize() method for audio context
- [ ] Import BodyInstrument in app.js
- [ ] Create instance in startApp() function
- [ ] Call initialize() after button click (browser audio policy)
- [ ] Add error handling for audio context failures
- [ ] Test audio context starts on Chrome
- [ ] Test audio context starts on Safari
- [ ] Test audio context starts on Firefox
- [ ] Add console logging for debug

---

## 📅 PHASE 2: Basic Sound Generation (Day 2)

### Melody Synth (Right Arm)
- [ ] Create PolySynth for melody
- [ ] Configure oscillator type (sine/triangle)
- [ ] Configure ADSR envelope
- [ ] Map right wrist Y position to note index
- [ ] Create pentatonic scale array
- [ ] Create position-to-note conversion function
- [ ] Test note changes as arm moves up/down
- [ ] Add note debouncing (prevent rapid retriggering)
- [ ] Add last-note tracking
- [ ] Add 200ms reset timer

### Bass Synth (Left Arm)
- [ ] Create MonoSynth for bass
- [ ] Configure oscillator type (sawtooth)
- [ ] Configure low-pass filter
- [ ] Map left wrist Y position to bass note
- [ ] Create bass note array (C2-E3 range)
- [ ] Test bass notes as arm moves
- [ ] Add 500ms note hold timer
- [ ] Tune bass envelope for deep sound

### Velocity Mapping
- [ ] Import velocity data from main tracking
- [ ] Create velocityToVolume() function
- [ ] Map velocity 0-0.3 to -24dB to 0dB
- [ ] Add velocity threshold (0.02 minimum)
- [ ] Test louder sounds with faster movement
- [ ] Calibrate threshold for natural feel

---

## 📅 PHASE 3: Gesture Integration (Day 3)

### Gesture Handlers
- [ ] Add handleGestures() method
- [ ] Import currentGestures from state
- [ ] Detect Open_Palm gesture
- [ ] Detect Closed_Fist gesture
- [ ] Detect Pointing_Up gesture
- [ ] Detect Victory gesture
- [ ] Detect Thumb_Up gesture

### Gesture → Sound Mapping
- [ ] Open_Palm → pad chord strum (C-E-G)
- [ ] Closed_Fist → drum hit (works alongside sparks)
- [ ] Left fist → kick drum
- [ ] Right fist → snare
- [ ] Pointing_Up → sustain mode (longer release)
- [ ] Victory → cycle to next scale
- [ ] Thumb_Up → toggle mute

### Chord Pad Synth
- [ ] Create FMSynth for pad sounds
- [ ] Configure harmonicity
- [ ] Configure modulation index
- [ ] Set long attack and release
- [ ] Create playPadChord() method
- [ ] Test chord strums
- [ ] Add multiple chord options

### Drum Sounds
- [ ] Create MembraneSynth for kick
- [ ] Create NoiseSynth for snare
- [ ] Create triggerDrum() method
- [ ] Tune kick frequency (C1)
- [ ] Tune snare noise decay
- [ ] Test drum triggers
- [ ] Add hi-hat option

---

## 📅 PHASE 4: Face Expression Modulation (Day 4)

### Blendshape Extraction
- [ ] Import faceBlendshapes from tracking
- [ ] Create blendshape-to-object mapping
- [ ] Extract jawOpen value (0-1)
- [ ] Extract browInnerUp value (0-1)
- [ ] Extract eyeWideLeft value
- [ ] Extract eyeWideRight value
- [ ] Extract mouthSmileLeft value
- [ ] Extract mouthSmileRight value

### Expression → Effect Mapping
- [ ] jawOpen → filter cutoff (500-4000 Hz)
- [ ] browInnerUp → reverb wet (0.2-0.8)
- [ ] eyeWide → delay feedback
- [ ] mouthSmile → detune/vibrato
- [ ] Test smooth parameter changes
- [ ] Add smoothing/interpolation
- [ ] Prevent sudden parameter jumps

---

## 📅 PHASE 5: Effects Chain (Day 5)

### Reverb
- [ ] Create Tone.Reverb
- [ ] Set decay time (3 seconds)
- [ ] Set initial wet level (0.4)
- [ ] Connect melody synth → reverb
- [ ] Connect bass synth → reverb
- [ ] Connect pad synth → reverb
- [ ] Test reverb tail

### Delay
- [ ] Create Tone.FeedbackDelay
- [ ] Set delay time (8th note)
- [ ] Set feedback (0.3)
- [ ] Connect melody synth → delay → reverb
- [ ] Test delay effect
- [ ] Add expression modulation hook

### Filter
- [ ] Create Tone.Filter
- [ ] Set type (lowpass)
- [ ] Set initial frequency (2000 Hz)
- [ ] Set Q factor (1)
- [ ] Connect bass synth → filter
- [ ] Test filter sweep
- [ ] Hook up to face expression

### Master Chain
- [ ] Set master volume (-12 dB)
- [ ] Create limiter/compressor
- [ ] Prevent clipping
- [ ] Test overall mix balance
- [ ] Tune synth volumes relative to each other

---

## 📅 PHASE 6: Scale System (Day 6)

### Scale Definitions
- [ ] Create SCALES object
- [ ] Add pentatonic scale
- [ ] Add minor scale
- [ ] Add major scale
- [ ] Add blues scale
- [ ] Add Japanese (In) scale
- [ ] Add harmonic minor scale
- [ ] Add dorian mode

### Scale Cycling
- [ ] Create cycleScale() method
- [ ] Track current scale index
- [ ] Update positionToNote() for current scale
- [ ] Test scale changes with Victory gesture
- [ ] Add scale name display
- [ ] Add smooth transition between scales

---

## 📅 PHASE 7: UI Controls (Day 7)

### Sound Toggle Button
- [ ] Add button to header or footer
- [ ] Create SVG icon (speaker/mute)
- [ ] Style to match CORPUS aesthetic
- [ ] Add click handler
- [ ] Connect to setMuted() method
- [ ] Add visual state indicator
- [ ] Add GSAP hover animation

### Scale Selector
- [ ] Add dropdown/select element
- [ ] Populate with scale names
- [ ] Style dropdown to match theme
- [ ] Add change handler
- [ ] Connect to setScale() method
- [ ] Show current scale

### Volume Control
- [ ] Add slider element
- [ ] Style slider track and thumb
- [ ] Map 0-100 to -40dB to 0dB
- [ ] Add change handler
- [ ] Connect to setVolume() method
- [ ] Add visual feedback

### Mobile Touch
- [ ] Ensure audio context starts on touch
- [ ] Add touch-specific initialization
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Handle audio interruptions

---

## 📅 PHASE 8: Visual Feedback (Day 8)

### Active Region Indicators
- [ ] Add glow to limbs when producing sound
- [ ] Right arm glow for melody
- [ ] Left arm glow for bass
- [ ] Pulse effect on note trigger
- [ ] Color intensity = volume
- [ ] Smooth fade out after note

### Note Visualization
- [ ] Display current note on screen
- [ ] Animate note name appearance
- [ ] Color code by pitch
- [ ] Position near playing limb
- [ ] GSAP scale animation

### Percussion Feedback
- [ ] Particle burst on drum hits
- [ ] Screen pulse on kick
- [ ] Smaller burst on snare
- [ ] Color matches drum type
- [ ] Integrate with existing spark system

### Scale Change Animation
- [ ] Display scale name on change
- [ ] GSAP text reveal animation
- [ ] Golden text color
- [ ] Center screen position
- [ ] Auto-fade after 2 seconds

---

## 📅 PHASE 9: Performance Optimization (Day 9)

### Audio Performance
- [ ] Profile CPU usage with audio
- [ ] Limit polyphony (max voices)
- [ ] Use lightweight oscillators
- [ ] Reuse synth instances
- [ ] Avoid creating new synths per note

### Frame Rate
- [ ] Test FPS with audio running
- [ ] Identify audio bottlenecks
- [ ] Optimize update frequency
- [ ] Consider 30fps audio updates
- [ ] Maintain 60fps visuals

### Memory Management
- [ ] Implement dispose() method
- [ ] Clean up synths on unmount
- [ ] Clear timers on dispose
- [ ] Remove event listeners
- [ ] Test for memory leaks

### Browser Compatibility
- [ ] Full test on Chrome (Mac)
- [ ] Full test on Chrome (Windows)
- [ ] Full test on Safari
- [ ] Full test on Firefox
- [ ] Full test on Edge
- [ ] Document any limitations

---

## 📅 PHASE 10: Polish & Launch (Day 10)

### Sound Design Refinement
- [ ] Fine-tune melody synth timbre
- [ ] Fine-tune bass synth warmth
- [ ] Perfect pad chord voicings
- [ ] Balance dry/wet mix
- [ ] Remove any harsh frequencies
- [ ] Add subtle chorus/detune

### User Experience
- [ ] Test with users who've never seen it
- [ ] Watch for confusion points
- [ ] Add subtle onboarding hints
- [ ] Ensure intuitive discovery
- [ ] Test 5+ minute engagement

### Documentation
- [ ] Add JSDoc comments to all methods
- [ ] Update README with sound feature
- [ ] Add keyboard shortcuts if applicable
- [ ] Document browser requirements
- [ ] Note mobile limitations

### Accessibility
- [ ] Ensure works without sound (visual only mode)
- [ ] Add prefers-reduced-motion check
- [ ] Test with VoiceOver
- [ ] Provide captions for instructions

### Launch Checklist
- [ ] Remove all console.logs
- [ ] Set production volumes
- [ ] Test on slow connection
- [ ] Create demo video
- [ ] Update GitHub description
- [ ] Tweet/share announcement

---

## 🎯 SUCCESS DEFINITION

When all checkboxes above are complete, the Musical Body Instrument will:

1. **Play naturally** — Users make music without thinking
2. **Sound beautiful** — Professional-quality synths and effects
3. **Feel responsive** — Sub-100ms latency on all triggers
4. **Look integrated** — Visual feedback matches CORPUS aesthetic
5. **Perform well** — 60fps maintained at all times
6. **Work everywhere** — Chrome, Safari, Firefox, mobile
7. **Engage deeply** — Users spend 5+ minutes playing

---

## 📊 ESTIMATED EFFORT

| Phase | Hours | Priority |
|-------|-------|----------|
| Foundation | 2h | Critical |
| Basic Sounds | 4h | Critical |
| Gestures | 3h | High |
| Face Expression | 2h | Medium |
| Effects | 2h | High |
| Scale System | 1h | Medium |
| UI Controls | 3h | High |
| Visual Feedback | 4h | Medium |
| Performance | 3h | High |
| Polish | 4h | High |

**Total: ~28 hours**

---

*"Transform the human body into a musical instrument. This is the future of interactive art."*

— CORPUS Development Team
