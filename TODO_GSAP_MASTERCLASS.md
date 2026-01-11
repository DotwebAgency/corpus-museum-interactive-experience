# CORPUS GSAP Masterclass Implementation TODO

> Based on AWWWARDS Jury Specification. Each item must be completed for production release.

---

## 🔴 CRITICAL: Character Entrance (BROKEN)

### Root Cause Analysis
- [x] Identified dual animation system conflict (`emergeProgress` vs `entranceProgress`)
- [x] Unified to single `entranceProgress` system
- [x] Added debug logging to trace animation progress
- [ ] **VERIFY: Animation actually triggers on first detection**
- [ ] **VERIFY: Character builds up anatomically (not instant pop)**
- [ ] **VERIFY: Joints pop with elastic ease during entrance**
- [ ] **VERIFY: Bones draw outward from center**
- [ ] **VERIFY: Face appears last (50%+ progress)**

### Debug Steps
1. Open browser console
2. Step into frame
3. Look for: `[CORPUS] 🎭 Starting entrance animation!`
4. Look for: `[CORPUS] 🎭 Entrance progress: X%`
5. Look for: `[CORPUS] 🎭 Entrance animation COMPLETE!`
6. If logs don't appear, investigate `updateEntranceAnimation()` call order

---

## 🟡 Phase 1: Foundation

### GSAP Configuration
- [ ] Create `gsap-config.js` with global settings
- [ ] Define custom eases: `museumEase`, `portalOpen`, `breathe`
- [ ] Remove all CSS transitions from animated elements
- [ ] Ensure all animations use `transform` and `opacity` only
- [ ] Add `will-change` hints for animated elements

### Accessibility
- [ ] Implement `prefers-reduced-motion` detection
- [ ] Create instant-skip mode for reduced motion users
- [ ] Test with system accessibility settings

---

## 🟡 Phase 2: Intro Screen Redesign

### Visual Elements
- [ ] Design golden grain texture (SVG filter or canvas)
- [ ] Create ambient particle dust in corners
- [ ] Implement cursor-following radial gradient
- [ ] Add golden vignette that "breathes"

### Logo Animation
- [ ] Export SVG with stroke paths (not filled)
- [ ] Implement DrawSVG for outer frame
- [ ] Add golden glow emanation from logo
- [ ] Create pulse effect on completion

### Title Animation
- [ ] Implement custom TextSplitter (not premium SplitText)
- [ ] Each character: slide + rotate + scale spring
- [ ] Add micro-delay between characters (0.03s)
- [ ] Golden dust trail follows each letter

### Tagline/Subtitle
- [ ] Word-by-word reveal with blur
- [ ] Fade-blur transition (10px → 0px)
- [ ] Stagger timing: 0.1s between words

### CTA Button
- [ ] Ghost outline draws first (DrawSVG)
- [ ] Fill sweeps in from left to right
- [ ] Text typewriter effect
- [ ] Hover: scale + glow intensify
- [ ] Shimmer loop on ready state

### Privacy & Footer
- [ ] Simple fade-in with slight rise
- [ ] Delayed start (after CTA ready)

---

## 🟡 Phase 3: Button → Portal Transition

### On Click Sequence
- [ ] CTA button shrinks toward center
- [ ] Button morphs into golden ring
- [ ] Ring expands to full-screen portal
- [ ] Golden light burst flash (0.3s)
- [ ] Loading screen revealed behind portal

### Technical Requirements
- [ ] No layout shifts during transition
- [ ] Seamless handoff to loading state
- [ ] Camera "pull through" effect

---

## 🟡 Phase 4: Loading Screen Overhaul

### Eye Symbol SVG
- [ ] Redesign eye SVG with stroke paths
- [ ] Outer ring: draw around (360° → 720°)
- [ ] Inner iris: scale + rotate
- [ ] Pupil: pulse with heartbeat rhythm

### Progress Visualization
- [ ] Replace percentage with arc stroke
- [ ] Arc follows eye outer ring
- [ ] Color shifts: warm gold → bright gold
- [ ] Glow intensifies as progress increases

### Status Messages
- [ ] "The canvas stirs..." (0-20%)
- [ ] "Light gathers..." (20-50%)
- [ ] "The artist takes position..." (50-80%)
- [ ] "Your portrait awaits." (80-100%)
- [ ] Crossfade transition between messages

### Completion Effect
- [ ] Eye opens fully (iris reveal)
- [ ] Radial rays burst outward
- [ ] Brief pause for anticipation
- [ ] Transition to main app

---

## 🟡 Phase 5: Loading → Main Transition

### Timeline Choreography
```javascript
// Target: 1.5s total duration
portalTransition
  .to('.eye-symbol', { scale: 0.1, duration: 0.4 })
  .to('.light-burst', { scale: 30, duration: 0.3 }, '-=0.2')
  .to('.awakening-overlay', { opacity: 0, duration: 0.3 })
  .from('.app-header', { y: -80, duration: 0.6 }, '-=0.2')
  .from('.app-footer', { y: 80, duration: 0.6 }, '-=0.5')
  .from('.canvas-frame', { scale: 0.9, duration: 0.5 }, '-=0.4');
```

### Implementation Tasks
- [ ] Eye contracts to center point
- [ ] Golden light burst overlay element
- [ ] Header descends (elastic ease)
- [ ] Footer rises (elastic ease)
- [ ] Canvas frame appears (back ease)
- [ ] Detection status begins pulsing

---

## 🟡 Phase 6: Character Entrance Animation

### Anatomical Build-Up (Current System)
- [ ] Verify `entrancePhase` state machine works
- [ ] Verify `entranceProgress` increments over 2s
- [ ] Verify `getJointVisibility()` returns graduated values
- [ ] Verify `getBoneVisibility()` returns graduated values
- [ ] Verify `getSpineVisibility()` returns graduated values
- [ ] Verify `getFaceVisibility()` returns graduated values

### Joint Reveal Order
```
0.00: Shoulders (11, 12)
0.05: Hips (23, 24)
0.15: Elbows (13, 14)
0.20: Knees (25, 26)
0.25: Wrists (15, 16)
0.30: Ankles (27, 28)
0.40: Feet (29-32)
0.50+: Face features
```

### Visual Effects During Entrance
- [ ] Joints pop with elastic scale
- [ ] Bones draw from joint A to joint B
- [ ] Soft glow bloom on first appearance
- [ ] Particle burst on completion

---

## 🟡 Phase 7: Polish & Performance

### Performance Targets
- [ ] 60fps during ALL animations
- [ ] No jank on button transitions
- [ ] Smooth loading progress updates
- [ ] Character entrance: butter-smooth

### Testing Matrix
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Chrome mobile (Android)
- [ ] Safari mobile (iOS)
- [ ] Low-end device test

### Code Cleanup
- [ ] Remove debug console.logs
- [ ] Remove unused CSS
- [ ] Remove deprecated `emergeProgress` references
- [ ] Consolidate animation timelines
- [ ] Document animation system

---

## 🟡 Phase 8: Final Review

### Full Journey Walkthrough
1. [ ] Page load → Intro animations play
2. [ ] Hover button → Micro-interactions work
3. [ ] Click button → Portal transition smooth
4. [ ] Loading → Progress animations work
5. [ ] Loading complete → Main transition smooth
6. [ ] Camera permission → Granted
7. [ ] Subject detected → Character builds up
8. [ ] Full detection → All elements visible
9. [ ] Fist gesture → Sparks activate
10. [ ] Theme toggle → Smooth color transition
11. [ ] Fullscreen → Seamless mode change

### Timing Fine-Tuning
- [ ] Intro total duration: ~5s
- [ ] Button → Loading: ~1s
- [ ] Loading screen: 5-15s (camera dependent)
- [ ] Loading → Main: ~1.5s
- [ ] Character entrance: 2s

### GitHub Release
- [ ] Write comprehensive commit message
- [ ] Push all changes
- [ ] Verify Netlify deployment
- [ ] Test live URL

---

## 📊 PROGRESS TRACKER

| Phase | Status | Completion |
|-------|--------|------------|
| Critical Fixes | 🔴 In Progress | 60% |
| Foundation | ⚪ Not Started | 0% |
| Intro Screen | ⚪ Not Started | 0% |
| Button → Portal | ⚪ Not Started | 0% |
| Loading Screen | ⚪ Not Started | 0% |
| Loading → Main | 🟡 Partial | 40% |
| Character Entrance | 🟡 Debugging | 50% |
| Polish | ⚪ Not Started | 0% |
| Final Review | ⚪ Not Started | 0% |

---

*Last Updated: January 11, 2026*
