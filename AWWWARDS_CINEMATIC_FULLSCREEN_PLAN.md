# AWWWARDS + LOUVRE: CINEMATIC FULLSCREEN MODE

**Project Name:** CORPUS — Behold the Form
**Date of Plan:** January 2026
**Prepared For:** AWWWARDS Jury, Louvre Senior Director

---

## EXECUTIVE SUMMARY

To transform "CORPUS" into a true cinematic experience suitable for music video production and artistic screen recording, we propose a sophisticated fullscreen mode. This mode will prioritize visual immersion by intelligently hiding UI elements, providing elegant transitions, and optimizing the visual output for capture.

---

## 1. VISION: THE CINEMATIC EXPERIENCE

**Goal**: Create a mode where users can "perform" in front of the camera, with the digital portrait becoming a living music video visual. The interface should disappear entirely, leaving only the art.

**Use Cases**:
- Music video production with body-reactive visuals
- Art installations in gallery/museum settings
- Performance documentation for dancers/artists
- Social media content creation with artistic overlays

---

## 2. FULLSCREEN MODE DESIGN

### 2.1. Mode Toggle

**Entry Method**:
- Press `F` key for instant toggle
- Double-click canvas for touch/mouse activation
- Dedicated "Cinema" button in header (optional, hidden in fullscreen)

**Exit Method**:
- Press `F` or `Escape` key
- Move mouse to top of screen to reveal exit button
- Timeout: Auto-reveal UI after 3 seconds of inactivity

### 2.2. UI Behavior in Fullscreen

**Elements to HIDE** (with elegant fade-out):
- Detection Panel ("ANATOMIA")
- Header bar with status
- Footer with technical info
- Frame borders
- All text overlays

**Elements to KEEP** (optional toggle):
- Spark effect particles
- Body skeleton visualization
- Face mesh overlay
- Dust motes ambient effect

### 2.3. Transition Animations (GSAP)

**Entry Sequence** (1.2s total):
1. **Frame Borders** (0-0.3s): Scale inward and fade out
2. **Header/Footer** (0.1-0.4s): Slide up/down respectively with blur effect
3. **Detection Panel** (0.2-0.5s): Slide right + fade + blur
4. **Canvas** (0.3-0.8s): Subtle zoom (1.02x) + brightness boost
5. **Vignette** (0.5-1.0s): Intensify edges for cinematic look
6. **Grain Overlay** (0.8-1.2s): Subtle film grain fades in

**Exit Sequence** (1.0s total):
1. **Grain Overlay** (0-0.3s): Fade out
2. **Canvas** (0-0.4s): Return to normal scale
3. **Vignette** (0.1-0.5s): Reduce intensity
4. **Header/Footer** (0.3-0.7s): Slide back into view
5. **Detection Panel** (0.4-0.8s): Slide back + fade in
6. **Frame Borders** (0.6-1.0s): Scale back out

### 2.4. Cinematic Visual Enhancements

**Active in Fullscreen Mode**:
- **Film Grain**: Subtle noise overlay (CSS or canvas)
- **Enhanced Vignette**: Stronger edge darkening
- **Color Grading**: Slight color temperature shift (warmer for intimacy)
- **Letterbox Option**: 2.39:1 aspect ratio black bars for ultra-cinematic feel
- **Glow Enhancement**: Increased bloom on skeleton and particles

---

## 3. TECHNICAL IMPLEMENTATION TO-DO LIST

### Phase 1: Core Fullscreen Infrastructure

- [ ] **fs-1**: Create `CinemaMode` class in `js/cinema-mode.js`
- [ ] **fs-2**: Add fullscreen API integration (`document.documentElement.requestFullscreen()`)
- [ ] **fs-3**: Create keyboard listener for `F` key toggle
- [ ] **fs-4**: Create double-click canvas listener
- [ ] **fs-5**: Track state: `isCinemaMode` boolean in app state
- [ ] **fs-6**: Add CSS class `.cinema-mode` to body for styling hooks

### Phase 2: UI Element Management

- [ ] **fs-7**: Define list of elements to hide/show
- [ ] **fs-8**: Create GSAP timeline for entry transition
- [ ] **fs-9**: Create GSAP timeline for exit transition
- [ ] **fs-10**: Add `pointer-events: none` to hidden elements
- [ ] **fs-11**: Implement mouse-to-top reveal for exit option

### Phase 3: Visual Enhancements

- [ ] **fs-12**: Create film grain overlay (CSS `background-image` noise or canvas)
- [ ] **fs-13**: Enhance vignette intensity via CSS variable
- [ ] **fs-14**: Add subtle zoom animation to canvas
- [ ] **fs-15**: Optional: Add letterbox bars (aspect ratio toggle)
- [ ] **fs-16**: Adjust particle glow intensity in cinema mode

### Phase 4: Integration & Polish

- [ ] **fs-17**: Integrate with GSAP animations module
- [ ] **fs-18**: Test fullscreen API across browsers (Chrome, Firefox, Safari)
- [ ] **fs-19**: Add `document.exitFullscreen()` cleanup
- [ ] **fs-20**: Handle edge cases (ESC key, losing focus)
- [ ] **fs-21**: Add optional audio reactive mode (future enhancement)

---

## 4. LOADING ANIMATION ON START

### 4.1. The Problem
When user presses Space/Enter to start, there's no visual feedback while MediaPipe loads.

### 4.2. Solution: Elegant Loading Sequence

**Visual Design**:
- Centered pulsing ring (inspired by particle aesthetic)
- Typography: "AWAKENING..." text with letter stagger animation
- Progress percentage (0-100%) with smooth counter animation
- Particle swirl effect around loading indicator

**Implementation**:
- [ ] **load-1**: Create `loading-awakening` overlay div in HTML
- [ ] **load-2**: Style with glassmorphic background
- [ ] **load-3**: Add pulsing ring animation (CSS keyframes or GSAP)
- [ ] **load-4**: Add staggered text reveal for "AWAKENING..." 
- [ ] **load-5**: Connect progress callback from MediaPipe init to percentage display
- [ ] **load-6**: Create exit animation (expand + fade) when loading completes

---

## 5. PERFORMANCE OPTIMIZATIONS

### 5.1. Identified Issues
- High particle count (350) causing frame drops
- O(n*m) collision detection complexity
- Excessive `Math.random()` and `Math.hypot()` calls
- Array recreation via `.filter()` every frame
- Hand jitter from insufficient smoothing

### 5.2. Optimization To-Do List

- [ ] **perf-1**: Reduce maxPetals to 200 (was 350)
- [ ] **perf-2**: Reduce spawnRate to 0.75 (was 0.95)
- [ ] **perf-3**: Replace `Math.hypot(dx, dy)` with squared distance checks
- [ ] **perf-4**: Use spatial partitioning (grid) for collision detection
- [ ] **perf-5**: Reuse particle objects instead of creating new ones (object pooling)
- [ ] **perf-6**: Replace `.filter()` with in-place removal
- [ ] **perf-7**: Increase hand landmark smoothing factor (0.35 → 0.25)
- [ ] **perf-8**: Throttle collision checks (every 2nd frame)
- [ ] **perf-9**: Cache random values instead of calling Math.random() every frame
- [ ] **perf-10**: Use requestAnimationFrame timing for consistent dt

---

## 6. ENHANCED FACE DETAIL

### 6.1. Current State
Using 468 landmarks from `FaceLandmarker`.

### 6.2. Maximum Detail Approach

**Lip Enhancement** (for lip-reading overlay):
- [ ] **face-1**: Extract all 80+ lip landmarks separately
- [ ] **face-2**: Render inner and outer lip contours
- [ ] **face-3**: Add lip color gradient (center lighter)
- [ ] **face-4**: Render lip thickness variations
- [ ] **face-5**: Add subtle lip shadow/highlight

**Face Mesh Enhancement**:
- [ ] **face-6**: Render full tessellated face mesh (468 triangles)
- [ ] **face-7**: Add subtle depth shading based on z-coordinates
- [ ] **face-8**: Enhance eye rendering (iris tracking if available)
- [ ] **face-9**: Add eyebrow detail rendering
- [ ] **face-10**: Render nose bridge and nostril contours

---

## 7. LEFT/RIGHT FIST DETECTION UI

### 7.1. Enhancement Request
Display individual left and right fist detection in the ANATOMIA panel.

### 7.2. Implementation

- [ ] **lr-1**: Add `gesture-left` and `gesture-right` sections to detection panel HTML
- [ ] **lr-2**: Track handedness from `gestureResults.handednesses`
- [ ] **lr-3**: Map gesture states to correct hand (left/right)
- [ ] **lr-4**: Update panel to show: "LEFT: ✊" and "RIGHT: 🖐️" indicators
- [ ] **lr-5**: Style with labels "L" and "R" for compact display

---

## CONCLUSION

This cinematic fullscreen mode will transform "CORPUS" from an interactive installation into a professional-grade visual tool for artistic expression. Combined with performance optimizations and enhanced face detail, the experience will be worthy of both a Louvre exhibition and an AWWWARDS recognition.

---

**Priority Order**:
1. Performance fixes (laggy experience kills everything)
2. Loading animation (user experience on start)
3. Enhanced face/lip detail
4. Cinematic fullscreen mode
5. Left/right fist UI enhancement

