# 📋 CORPUS Enter Page Redesign — MASTER TODO LIST

> **Goal**: Transform the enter page from "static landing page" to "GSAP-first interactive art experience"

---

## 🔴 PHASE 1: Foundation & Assets (Critical Path)

### 1.1 Typography Setup
- [ ] Add Google Fonts: Playfair Display, Cormorant Garamond, EB Garamond
- [ ] Create typography CSS variables
- [ ] Set up responsive clamp() font sizes
- [ ] Test font loading performance (preload)
- [ ] Create fallback font stack

### 1.2 Historical Instrument Icons
- [ ] Create lyre SVG icon (Greek)
- [ ] Create lute SVG icon (Renaissance)
- [ ] Create harpsichord SVG icon (Baroque)
- [ ] Create piano SVG icon (Classical)
- [ ] Create synthesizer SVG icon (Modern)
- [ ] Optimize all SVGs for DrawSVG animation
- [ ] Ensure consistent stroke width (1.5px)
- [ ] Add to icon sprite or inline

### 1.3 Sound Assets
- [ ] Create/source ambient drone loop (5-10 sec)
- [ ] Create letter appearance notes (C, O, R, P, U, S)
- [ ] Create wind chime transition sound
- [ ] Create button hover preview sound
- [ ] Create button click crescendo sound
- [ ] Create portal expansion whoosh
- [ ] Create loading drum hits
- [ ] Create loading harp arpeggios
- [ ] Create loading flute breath
- [ ] Create loading synth pads
- [ ] Create completion orchestral hit
- [ ] Convert all to web-optimized format (MP3/OGG)
- [ ] Implement lazy audio loading

### 1.4 GSAP Plugin Setup
- [ ] Verify GSAP core is latest version
- [ ] Add DrawSVGPlugin (or use free alternative)
- [ ] Add MotionPathPlugin for orbit
- [ ] Create custom TextSplitter utility (if no SplitText)
- [ ] Create plugin initialization module
- [ ] Add feature detection for graceful degradation

---

## 🟠 PHASE 2: Background Canvas Redesign

### 2.1 Canvas Environment
- [ ] Add subtle grain texture overlay
- [ ] Implement golden vignette that breathes
- [ ] Make vignette breathing sync with ambient drone
- [ ] Update particle colors to warm palette
- [ ] Implement cursor magnetic repulsion for particles
- [ ] Add particle attraction to UI elements
- [ ] Create particle speed variation based on position

### 2.2 Audio Visualizer Bars
- [ ] Create edge audio visualizer component
- [ ] Position bars on left and right edges
- [ ] Connect to ambient sound frequency data
- [ ] Animate bars with subtle movement
- [ ] Fade in during Phase 1 of entry

### 2.3 Responsive Canvas
- [ ] Test canvas performance on mobile
- [ ] Implement particle count reduction for mobile
- [ ] Disable complex effects on low-end devices
- [ ] Add prefers-reduced-motion support

---

## 🟡 PHASE 3: Title Assembly Animation

### 3.1 Letter Construction
- [ ] Design SVG path for "C" (musical note curve)
- [ ] Design SVG path for "O" (Vitruvian circle expansion)
- [ ] Design SVG path for "R" (geometric lines)
- [ ] Design SVG path for "P" (treble clef morph)
- [ ] Design SVG path for "U" (sound wave)
- [ ] Design SVG path for "S" (serpentine/string)
- [ ] Implement DrawSVG animation for each letter
- [ ] Add micro-wobble on letter completion
- [ ] Add golden glow pulse effect
- [ ] Add particle burst at letter completion
- [ ] Create staggered timing for letter sequence
- [ ] Test timing feels natural (not too fast/slow)

### 3.2 Instrument Orbit
- [ ] Create SVG sprite of all 5 instruments
- [ ] Implement MotionPath circular orbit
- [ ] Create fade/morph between instruments
- [ ] Set orbit speed (one rotation = 20 seconds)
- [ ] Position orbit around title
- [ ] Scale instruments based on position (parallax)
- [ ] Add instrument tooltip on hover (optional)
- [ ] Mobile: static positioned instruments instead

### 3.3 Title Sound Integration
- [ ] Trigger note sound for each letter
- [ ] Use scale from current selection (pentatonic default)
- [ ] Create cumulative sound (letters build chord)
- [ ] Final letter triggers chord resolution

---

## 🟢 PHASE 4: Tagline Animation

### 4.1 Typewriter Effect
- [ ] Split tagline "Behold the form." into characters
- [ ] Implement typewriter animation
- [ ] Each character triggers soft note
- [ ] Cursor blink effect during typing
- [ ] Curve text path around title (optional)
- [ ] Add golden ink spread behind text

### 4.2 Historical Quotes
- [ ] Create quote array (5-7 quotes)
- [ ] Implement quote rotation (every 8 seconds)
- [ ] Fade out current quote
- [ ] Fade in next quote
- [ ] Add wind chime sound on transition
- [ ] Position quotes below tagline
- [ ] Style with EB Garamond italic

### 4.3 Subtitle Animation
- [ ] Add secondary description text
- [ ] Implement blur-to-sharp reveal
- [ ] Stagger animation after tagline
- [ ] Make text parchment-toned

---

## 🔵 PHASE 5: Portal Button

### 5.1 Portal Design
- [ ] Replace button with circular portal SVG
- [ ] Create golden ring DrawSVG animation
- [ ] Add inner circle (Vitruvian reference)
- [ ] Implement text typing "Enter the Canvas"
- [ ] Add heartbeat pulse animation
- [ ] Create particle attraction to portal edge

### 5.2 Portal Interactions
- [ ] Hover: portal expands slightly
- [ ] Hover: play sound preview (current scale)
- [ ] Hover: particles rush toward portal
- [ ] Hover: golden light rays emanate
- [ ] Hover: text changes to "Begin Your Sitting"
- [ ] Add accessibility focus states
- [ ] Add keyboard support (Enter/Space)

### 5.3 Portal Activation (Click)
- [ ] Portal ring expands to full screen
- [ ] Light burst flash effect
- [ ] Particles accelerate to center
- [ ] Sound crescendo (all notes)
- [ ] White flash transition
- [ ] Fade to loading screen

---

## 🟣 PHASE 6: Loading Screen Redesign

### 6.1 Loading UI Structure
- [ ] Create new loading screen HTML
- [ ] Position instrument display area
- [ ] Create progress indicator (circle or bar)
- [ ] Add loading text area
- [ ] Add subtle background animation

### 6.2 Phase 0-25%: Drums
- [ ] Create drum SVG illustration
- [ ] Implement materialization animation
- [ ] Add drum hit sound at intervals
- [ ] Display "Awakening rhythm..."
- [ ] Animate drumstick hits (optional)

### 6.3 Phase 25-50%: Strings
- [ ] Create lyre/harp SVG illustration
- [ ] Implement string vibration animation
- [ ] Add harp arpeggio sounds
- [ ] Display "Tuning the strings..."
- [ ] Animate string plucks (optional)

### 6.4 Phase 50-75%: Wind
- [ ] Create flute/wind SVG illustration
- [ ] Implement breath/air flow animation
- [ ] Add wind/breath sounds
- [ ] Display "Finding breath..."
- [ ] Animate air particles (optional)

### 6.5 Phase 75-100%: Synth
- [ ] Create synthesizer/waveform SVG
- [ ] Implement waveform animation
- [ ] Add synth pad sounds
- [ ] Display "Connecting to you..."
- [ ] Animate frequency visualizer

### 6.6 Loading Completion
- [ ] All instruments merge animation
- [ ] Morph into human silhouette
- [ ] Full chord resolution sound
- [ ] Flash transition to main app
- [ ] Ensure smooth handoff to camera init

### 6.7 Loading Progress Sync
- [ ] Connect actual MediaPipe loading to phases
- [ ] Add fake progress if loading too fast
- [ ] Handle loading errors gracefully
- [ ] Add retry mechanism
- [ ] Ensure minimum experience time (8-10 sec)

---

## 💜 PHASE 7: Sound System

### 7.1 Sound Manager
- [ ] Create SoundManager class
- [ ] Implement sound preloading
- [ ] Add volume control
- [ ] Add mute toggle
- [ ] Implement sound sprite for efficiency
- [ ] Add user gesture requirement handling

### 7.2 Enter Page Sounds
- [ ] Integrate ambient drone loop
- [ ] Connect letter sounds to animation
- [ ] Add quote transition sounds
- [ ] Connect button hover/click sounds
- [ ] Add portal expansion sound

### 7.3 Loading Screen Sounds
- [ ] Connect drum sounds to 0-25%
- [ ] Connect harp sounds to 25-50%
- [ ] Connect wind sounds to 50-75%
- [ ] Connect synth sounds to 75-100%
- [ ] Add completion sound

### 7.4 Sound Settings
- [ ] Remember sound preference in localStorage
- [ ] Add sound on/off toggle to enter page
- [ ] Respect prefers-reduced-motion
- [ ] Graceful degradation without sound

---

## 🖤 PHASE 8: Responsive Design

### 8.1 Desktop (1200px+)
- [ ] Full animation orchestration
- [ ] Active instrument orbit
- [ ] All sound effects
- [ ] Maximum particles
- [ ] Audio visualizer bars

### 8.2 Tablet (768-1199px)
- [ ] Simplified instrument display
- [ ] Reduced particle count
- [ ] Core animations preserved
- [ ] Smaller title font
- [ ] Adjusted spacing

### 8.3 Mobile (< 768px)
- [ ] Static instrument icons
- [ ] Minimal particles
- [ ] Portrait-optimized layout
- [ ] Touch-optimized portal
- [ ] Simplified loading screen
- [ ] Optional sound toggle

### 8.4 Accessibility
- [ ] Screen reader announcements
- [ ] Keyboard navigation complete
- [ ] Focus visible states
- [ ] prefers-reduced-motion support
- [ ] prefers-color-scheme support
- [ ] High contrast mode

---

## 🤍 PHASE 9: Performance Optimization

### 9.1 Asset Optimization
- [ ] Compress all SVGs
- [ ] Optimize audio files (128kbps MP3)
- [ ] Lazy load non-critical sounds
- [ ] Implement audio sprites
- [ ] Preload critical assets

### 9.2 Animation Optimization
- [ ] Use will-change sparingly
- [ ] Implement GSAP ticker optimization
- [ ] Reduce DOM operations
- [ ] Use requestAnimationFrame properly
- [ ] Test on low-end devices

### 9.3 Metrics
- [ ] Achieve Lighthouse Performance > 90
- [ ] Achieve < 1.5s First Contentful Paint
- [ ] Achieve < 3s Time to Interactive
- [ ] Maintain 60fps during animations
- [ ] Memory usage < 100MB

---

## ⬛ PHASE 10: Testing & Polish

### 10.1 Cross-Browser Testing
- [ ] Test Chrome (latest)
- [ ] Test Safari (latest)
- [ ] Test Firefox (latest)
- [ ] Test Edge (latest)
- [ ] Test Safari iOS
- [ ] Test Chrome Android

### 10.2 Device Testing
- [ ] Test on MacBook Pro
- [ ] Test on Windows laptop
- [ ] Test on iPad Pro
- [ ] Test on iPad Mini
- [ ] Test on iPhone 14 Pro
- [ ] Test on iPhone SE
- [ ] Test on Android flagship
- [ ] Test on low-end Android

### 10.3 User Testing
- [ ] Conduct 5 user tests
- [ ] Measure time to first interaction
- [ ] Measure comprehension of purpose
- [ ] Gather qualitative feedback
- [ ] Iterate based on feedback

### 10.4 Final Polish
- [ ] Review all timing (pacing feels right)
- [ ] Check all sound levels balanced
- [ ] Verify no animation jank
- [ ] Confirm responsive breakpoints smooth
- [ ] Final accessibility audit
- [ ] Final performance audit

---

## 📊 EFFORT ESTIMATES

| Phase | Tasks | Est. Hours |
|-------|-------|------------|
| Phase 1: Foundation | 18 | 6 |
| Phase 2: Background | 10 | 4 |
| Phase 3: Title | 18 | 8 |
| Phase 4: Tagline | 10 | 4 |
| Phase 5: Portal | 14 | 6 |
| Phase 6: Loading | 22 | 10 |
| Phase 7: Sound | 15 | 6 |
| Phase 8: Responsive | 16 | 8 |
| Phase 9: Performance | 12 | 4 |
| Phase 10: Testing | 16 | 8 |
| **TOTAL** | **151** | **~64 hours** |

---

## 🚀 PRIORITY ORDER

### Must Have (MVP)
1. ✅ Title animation (basic)
2. ✅ Portal button design
3. ✅ Loading screen redesign
4. ✅ Mobile responsive
5. ✅ Core sounds

### Should Have
1. Instrument orbit
2. Historical quotes
3. Full sound integration
4. Audio visualizer

### Nice to Have
1. Advanced particle physics
2. Instrument morphing
3. Full accessibility
4. Elaborate loading phases

---

## 📝 NOTES

### Dependencies
- GSAP 3.x (already installed)
- Tone.js (already installed)
- Web Audio API
- requestAnimationFrame
- CSS custom properties

### Potential Blockers
- Safari audio autoplay restrictions
- Mobile performance limitations
- SVG animation browser quirks
- Font loading delay

### Success Criteria
- User spends > 15 seconds on enter page
- > 40% enable sound
- > 85% click through
- 60fps maintained throughout
- Works on all major browsers

---

*"The enter page is not just a door. It's the overture to a symphony."*
