# TODO: Footer Bar Complete Redesign

Based on: `AWWWARDS_FOOTER_REDESIGN.md`

---

## Phase 1: HTML Structure 🏗️

### 1.1 Remove Old Footer
- [ ] Delete current footer HTML in `index.html`
- [ ] Remove unused CSS classes
- [ ] Clean up related JS references

### 1.2 Create New Footer Structure
- [ ] Add semantic `<footer class="corpus-footer">` wrapper
- [ ] Create three sections: tracking, controls, info
- [ ] Add ARIA labels for accessibility

### 1.3 Tracking Section (Left)
- [ ] Add "TRACKING" label
- [ ] Create body tracking indicator with icon + label
- [ ] Create hands tracking indicator with icon + label  
- [ ] Create face tracking indicator with icon + label
- [ ] Add IDs for JS updates

### 1.4 Controls Section (Center)
- [ ] Create sound toggle button with icon + state
- [ ] Create scale selector with label + value
- [ ] Create spark status indicator
- [ ] Add gesture hint text area

### 1.5 Info Section (Right)
- [ ] Create help button with icon
- [ ] Create FPS counter (far right corner)
- [ ] Add proper positioning

---

## Phase 2: CSS Styling 🎨

### 2.1 Footer Container
- [ ] Set fixed height (56px)
- [ ] Add glassmorphic background
- [ ] Add top border accent
- [ ] Position fixed at bottom
- [ ] Add z-index layering
- [ ] Implement backdrop blur

### 2.2 Section Layout
- [ ] Use CSS Grid for 3-column layout
- [ ] Left section: auto width
- [ ] Center section: flex-grow
- [ ] Right section: auto width
- [ ] Add section gaps (24px)

### 2.3 Tracking Indicators
- [ ] Style indicator containers
- [ ] Create dot/icon styling
- [ ] Add active state (gold/green glow)
- [ ] Add inactive state (muted gray)
- [ ] Add subtle pulse animation for active
- [ ] Style labels (9px uppercase)

### 2.4 Control Buttons
- [ ] Style sound toggle button
- [ ] Create ON/OFF visual states
- [ ] Style scale selector dropdown
- [ ] Style spark status display
- [ ] Add hover states
- [ ] Add focus outlines
- [ ] Add active/pressed states

### 2.5 Info Section
- [ ] Style help button
- [ ] Style FPS counter (monospace, muted)
- [ ] Position FPS in far right corner

### 2.6 Color Variables
- [ ] Define `--footer-bg`
- [ ] Define `--footer-border`
- [ ] Define `--footer-text`
- [ ] Define `--footer-text-active`
- [ ] Define `--footer-accent`
- [ ] Define `--footer-success`
- [ ] Define `--footer-inactive`

### 2.7 Dark Mode Support
- [ ] Verify colors work in dark theme
- [ ] Verify colors work in light theme
- [ ] Test contrast ratios

---

## Phase 3: JavaScript Integration 🔧

### 3.1 Element References
- [ ] Update `getElements()` with new footer elements
- [ ] Remove old footer element references
- [ ] Add new tracking indicator refs
- [ ] Add new control refs
- [ ] Add new info refs

### 3.2 Tracking Status Updates
- [ ] Update body tracking indicator in `updateUI()`
- [ ] Update hands tracking indicator
- [ ] Update face tracking indicator
- [ ] Add smooth transitions (not instant on/off)
- [ ] Add landmark count tooltips

### 3.3 Sound Toggle
- [ ] Connect sound toggle to `toggleSound()`
- [ ] Update visual state on toggle
- [ ] Show/hide scale selector based on sound state
- [ ] Update icon (speaker/muted)

### 3.4 Scale Selector
- [ ] Connect to `handleScaleChange()`
- [ ] Update display when changed via gesture
- [ ] Show current scale name
- [ ] Style dropdown options

### 3.5 Spark Status
- [ ] Show "Ready" when sound enabled
- [ ] Show "Active" when sparks active
- [ ] Show hint "Make a fist!" when idle
- [ ] Add sparkle animation when active

### 3.6 Help Button
- [ ] Connect to help modal toggle
- [ ] Update styling on modal open

### 3.7 FPS Counter
- [ ] Move FPS update logic
- [ ] Show in corner
- [ ] Consider hiding in production (or < 30fps only)

---

## Phase 4: Animations 🎬

### 4.1 Entry Animation
- [ ] Footer slides up from bottom on load
- [ ] Sections fade in left → center → right
- [ ] Stagger timing (100ms between sections)

### 4.2 State Transitions
- [ ] Tracking indicators: 200ms color fade
- [ ] Sound toggle: icon morph animation
- [ ] Scale change: gold flash effect
- [ ] Spark activation: shimmer effect

### 4.3 Idle Animations
- [ ] Subtle breathing on active indicators
- [ ] Occasional sparkle on spark icon
- [ ] Pulse on help button (if never clicked)

### 4.4 GSAP Integration
- [ ] Use GSAP for entry sequence
- [ ] Use GSAP for state transitions
- [ ] Ensure 60fps performance

---

## Phase 5: Responsive Design 📱

### 5.1 Desktop (>1024px)
- [ ] Full layout with all labels
- [ ] All sections visible
- [ ] FPS visible

### 5.2 Tablet (768-1024px)
- [ ] Compact layout
- [ ] Icons only (labels as tooltips)
- [ ] Reduced gaps

### 5.3 Mobile (<768px)
- [ ] Single row of essential icons
- [ ] Tap to reveal controls
- [ ] FPS hidden
- [ ] Stacked on very small screens

### 5.4 Media Queries
- [ ] Add tablet breakpoint styles
- [ ] Add mobile breakpoint styles
- [ ] Test on real devices
- [ ] Test touch interactions

---

## Phase 6: Accessibility ♿

### 6.1 Keyboard Navigation
- [ ] All controls focusable
- [ ] Logical tab order
- [ ] Enter/Space activates buttons
- [ ] Arrow keys for dropdown

### 6.2 Screen Reader Support
- [ ] Add ARIA labels to all controls
- [ ] Add ARIA live regions for status changes
- [ ] Test with VoiceOver/NVDA

### 6.3 Visual Accessibility
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] No color-only information

---

## Phase 7: Tooltips 💬

### 7.1 Tracking Tooltips
- [ ] Body: "Body tracking active - 33 landmarks"
- [ ] Hands: "Hand tracking - gestures enabled"
- [ ] Face: "Face tracking - expressions detected"

### 7.2 Control Tooltips
- [ ] Sound: "Toggle musical instrument (S key)"
- [ ] Scale: "Current musical scale - gesture 🤟 to change"
- [ ] Sparks: "Make a fist to summon sparks"

### 7.3 Info Tooltips
- [ ] Help: "Open guide (H key)"
- [ ] FPS: "Frames per second"

### 7.4 Tooltip Styling
- [ ] Consistent design
- [ ] 300ms delay before show
- [ ] Position above element
- [ ] Dark background, light text

---

## Phase 8: Polish & QA 🔍

### 8.1 Visual Polish
- [ ] Verify alignment is pixel-perfect
- [ ] Check all hover states
- [ ] Verify animations are smooth
- [ ] Test glassmorphism effect

### 8.2 Cross-Browser Testing
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

### 8.3 Performance
- [ ] No layout shifts
- [ ] Animations at 60fps
- [ ] Minimal repaints
- [ ] Lighthouse audit

### 8.4 Bug Fixes
- [ ] Fix any discovered issues
- [ ] Test edge cases
- [ ] Verify all states work

---

## Phase 9: Documentation 📚

### 9.1 Code Comments
- [ ] Document new CSS classes
- [ ] Document new JS functions
- [ ] Document state management

### 9.2 Update Help Content
- [ ] Update help modal with new footer info
- [ ] Update tutorial references
- [ ] Update README if needed

---

## Estimated Effort

| Phase | Tasks | Time |
|-------|-------|------|
| 1. HTML | 15 | 1h |
| 2. CSS | 25 | 2h |
| 3. JavaScript | 20 | 2h |
| 4. Animations | 12 | 1.5h |
| 5. Responsive | 10 | 1h |
| 6. Accessibility | 8 | 1h |
| 7. Tooltips | 10 | 0.5h |
| 8. Polish | 10 | 1h |
| 9. Documentation | 5 | 0.5h |
| **TOTAL** | **115** | **~10.5h** |

---

## Quick Reference: New Footer HTML Structure

```html
<footer class="corpus-footer">
  <!-- Section 1: Tracking Status -->
  <div class="footer-tracking">
    <span class="footer-section-label">TRACKING</span>
    <div class="tracking-indicators">
      <div class="tracking-item" id="track-body">
        <span class="tracking-dot"></span>
        <span class="tracking-label">Body</span>
      </div>
      <div class="tracking-item" id="track-hands">
        <span class="tracking-dot"></span>
        <span class="tracking-label">Hands</span>
      </div>
      <div class="tracking-item" id="track-face">
        <span class="tracking-dot"></span>
        <span class="tracking-label">Face</span>
      </div>
    </div>
  </div>

  <!-- Section 2: Controls -->
  <div class="footer-controls">
    <button class="control-btn" id="footer-sound-toggle">
      <span class="control-icon">🔊</span>
      <span class="control-label">Sound</span>
      <span class="control-state" id="sound-state">OFF</span>
    </button>
    
    <div class="control-item" id="footer-scale-control">
      <span class="control-icon">🎹</span>
      <span class="control-label">Scale</span>
      <select id="footer-scale-select" class="control-select">
        <option value="pentatonic">Pentatonic</option>
        <option value="minor">Minor</option>
        <option value="major">Major</option>
        <option value="blues">Blues</option>
        <option value="japanese">Japanese</option>
        <option value="dorian">Dorian</option>
      </select>
    </div>
    
    <div class="control-item" id="footer-spark-status">
      <span class="control-icon">✨</span>
      <span class="control-label">Sparks</span>
      <span class="control-state" id="spark-state">Ready</span>
    </div>
  </div>

  <!-- Section 3: Info -->
  <div class="footer-info">
    <button class="info-btn" id="footer-help-btn" title="Help & Guide">
      <span class="info-icon">?</span>
    </button>
    <span class="fps-display" id="footer-fps">60 fps</span>
  </div>
</footer>
```

---

## Success Checklist ✅

Before marking complete:
- [ ] User understands footer in < 3 seconds
- [ ] All tracking states visible and clear
- [ ] Sound toggle is obvious and works
- [ ] Scale selector updates on gesture
- [ ] Help is accessible
- [ ] FPS is in corner, not distracting
- [ ] Works on mobile
- [ ] No accessibility issues
- [ ] Animations are smooth
- [ ] Matches brand identity
