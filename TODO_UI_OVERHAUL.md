# 📋 CORPUS UI OVERHAUL — MASTER TODO LIST

> **Comprehensive task breakdown for the complete header, footer, and tutorial system redesign**

---

## 🔴 PHASE 1: TUTORIAL SYSTEM (Critical)

### 1.1 Tutorial Overlay Component
- [ ] Create `js/tutorial.js` module
- [ ] Define tutorial step data structure
- [ ] Create TutorialManager class
- [ ] Implement step navigation (next/prev/skip)
- [ ] Track tutorial completion in localStorage
- [ ] Add "Don't show again" option
- [ ] Style tutorial overlay container
- [ ] Add backdrop blur behind tutorial
- [ ] Implement focus trap for accessibility
- [ ] Add keyboard navigation (Enter/Escape)

### 1.2 Tutorial Steps Content
- [ ] Step 0: Welcome message
- [ ] Step 1: Move right arm (melody)
- [ ] Step 2: Move left arm (bass)
- [ ] Step 3: Make a fist (drums + sparks)
- [ ] Step 4: Open palm (chord strum)
- [ ] Step 5: Victory sign (change scale)
- [ ] Step 6: Face expressions (filter/reverb)
- [ ] Step 7: Completion celebration
- [ ] Add illustrations/icons for each step
- [ ] Add animated examples for each step

### 1.3 Tutorial Detection System
- [ ] Detect when user performs tutorial gesture
- [ ] Show success checkmark when detected
- [ ] Auto-advance after successful detection
- [ ] Add "Try it" prompt with countdown
- [ ] Handle detection timeout (show "Skip" option)
- [ ] Track which steps were completed vs skipped

### 1.4 Tutorial Trigger Logic
- [ ] Check localStorage for first-time user
- [ ] Show tutorial after camera enabled
- [ ] Add delay before tutorial (let user see themselves)
- [ ] Handle tutorial during loading
- [ ] Re-trigger tutorial from help button

### 1.5 Tutorial Animations (GSAP)
- [ ] Step entrance animation
- [ ] Step exit animation
- [ ] Success celebration animation
- [ ] Progress indicator animation
- [ ] Skip button hover animation
- [ ] Completion confetti effect

---

## 🔴 PHASE 2: GESTURE PALETTE (Critical)

### 2.1 Gesture Palette HTML Structure
- [ ] Create gesture palette container in footer
- [ ] Add gesture icon for Fist (✊)
- [ ] Add gesture icon for Palm (✋)
- [ ] Add gesture icon for Point (☝️)
- [ ] Add gesture icon for Victory (✌️)
- [ ] Add gesture icon for Thumb (👍)
- [ ] Add label text under each icon
- [ ] Add description text under each icon
- [ ] Add "Currently Active" indicator area

### 2.2 Gesture Palette CSS
- [ ] Style gesture palette container
- [ ] Style individual gesture items
- [ ] Style gesture icons (SVG)
- [ ] Style gesture labels
- [ ] Style gesture descriptions
- [ ] Add hover states for each gesture
- [ ] Style active/detected state
- [ ] Add pulse glow animation for active
- [ ] Style "Currently Active" section
- [ ] Mobile responsive layout for palette
- [ ] Tablet responsive layout
- [ ] Dark mode styles
- [ ] Light mode styles

### 2.3 Gesture Palette Icons (SVG)
- [ ] Design fist icon SVG
- [ ] Design palm icon SVG
- [ ] Design pointing icon SVG
- [ ] Design victory icon SVG
- [ ] Design thumb up icon SVG
- [ ] Ensure consistent stroke weight
- [ ] Optimize SVG file sizes
- [ ] Add animation-ready class structure

### 2.4 Gesture Detection Integration
- [ ] Map MediaPipe gestures to palette icons
- [ ] Update palette on gesture change
- [ ] Add debounce to prevent flicker
- [ ] Show multiple active gestures simultaneously
- [ ] Update "Currently Active" text
- [ ] Add gesture confidence indicator (optional)

### 2.5 Gesture Palette Animations
- [ ] Icon scale animation on activate
- [ ] Glow pulse animation
- [ ] Icon bounce on first detection
- [ ] Smooth transition between states
- [ ] Subtle idle animation
- [ ] Sound wave animation for audio gestures

---

## 🔴 PHASE 3: ACTIVE GESTURE INDICATORS (Critical)

### 3.1 Visual Feedback System
- [ ] Create feedback manager in app.js
- [ ] Define feedback types (visual, audio, haptic)
- [ ] Implement visual pulse on gesture detect
- [ ] Add screen edge glow for drums
- [ ] Add particle burst for chord strum
- [ ] Add scale name popup on change

### 3.2 Skeleton Glow Effects
- [ ] Add glow to right arm during melody
- [ ] Add glow to left arm during bass
- [ ] Add glow to fist when closed
- [ ] Add glow intensity based on volume
- [ ] Smooth transitions between glow states

### 3.3 Sound Visualization
- [ ] Create sound wave component
- [ ] Animate bars based on volume
- [ ] Show current note name
- [ ] Position near playing limb
- [ ] Fade out after note ends

---

## 🔴 PHASE 4: HELP MODAL (Critical)

### 4.1 Help Modal Structure
- [ ] Create help modal HTML
- [ ] Add header with title and close button
- [ ] Create two-column layout
- [ ] Left column: Sound controls section
- [ ] Right column: Visual effects section
- [ ] Add scales list section
- [ ] Add face effects section
- [ ] Add "Got it" close button
- [ ] Add keyboard shortcut hint

### 4.2 Help Modal Styles
- [ ] Style modal container
- [ ] Style modal backdrop
- [ ] Style header
- [ ] Style sections
- [ ] Style gesture icons in modal
- [ ] Style text descriptions
- [ ] Mobile responsive modal
- [ ] Dark/light mode variants

### 4.3 Help Modal Functionality
- [ ] Add [?] button to header
- [ ] Open modal on click
- [ ] Close on backdrop click
- [ ] Close on Escape key
- [ ] Close on "Got it" button
- [ ] Trap focus inside modal
- [ ] Restore focus on close

### 4.4 Help Modal Animations
- [ ] Modal entrance animation
- [ ] Modal exit animation
- [ ] Backdrop fade animation
- [ ] Content stagger animation

---

## 🟡 PHASE 5: HEADER REDESIGN (Important)

### 5.1 Header HTML Restructure
- [ ] Simplify brand section
- [ ] Add instrument status section
- [ ] Add now-playing section
- [ ] Reorganize action buttons
- [ ] Add help button [?]
- [ ] Remove redundant elements

### 5.2 Instrument Status Component
- [ ] Create instrument status container
- [ ] Add ON/OFF toggle with label
- [ ] Add current scale dropdown
- [ ] Style toggle button
- [ ] Style dropdown
- [ ] Add icons for clarity
- [ ] Mobile collapsed state

### 5.3 Now Playing Component
- [ ] Create now-playing container
- [ ] Add pitch slider/indicator
- [ ] Add current note display
- [ ] Add bass note display
- [ ] Animate pitch indicator movement
- [ ] Hide when sound is OFF
- [ ] Style for both themes

### 5.4 Header CSS Updates
- [ ] Update header layout (flexbox)
- [ ] Style instrument status
- [ ] Style now-playing section
- [ ] Style help button
- [ ] Update responsive breakpoints
- [ ] Mobile header layout
- [ ] Tablet header layout

### 5.5 Header Functionality
- [ ] Connect instrument toggle to body-instrument.js
- [ ] Connect scale dropdown to scale change
- [ ] Update now-playing on note trigger
- [ ] Show/hide now-playing based on sound state
- [ ] Add help button click handler

---

## 🟡 PHASE 6: FOOTER REDESIGN (Important)

### 6.1 Footer HTML Restructure
- [ ] Remove old hand indicators
- [ ] Add gesture palette section
- [ ] Simplify detection pills
- [ ] Move scale selector to header
- [ ] Update instruction text area
- [ ] Add performance stats (collapsible)

### 6.2 Footer Layout CSS
- [ ] Create new footer grid layout
- [ ] Style gesture palette area
- [ ] Style detection pills (smaller)
- [ ] Style performance stats
- [ ] Add collapse/expand for stats
- [ ] Mobile footer layout
- [ ] Tablet footer layout

### 6.3 Detection Pills Update
- [ ] Simplify to minimal dots
- [ ] Remove verbose labels
- [ ] Add tooltip on hover
- [ ] Green = detected, gray = not
- [ ] Position at bottom of footer

### 6.4 Footer Animations
- [ ] Gesture palette entrance
- [ ] Detection pill state change
- [ ] Footer expand/collapse
- [ ] Instruction text updates

---

## 🟡 PHASE 7: SOUND TOGGLE IMPROVEMENT (Important)

### 7.1 Enhanced Sound Toggle
- [ ] Add "INSTRUMENT" label next to icon
- [ ] Add ON/OFF text indicator
- [ ] Larger click target
- [ ] Better visual state difference
- [ ] Add sound wave animation when ON
- [ ] Tooltip with full explanation

### 7.2 Sound State Indicators
- [ ] Global "sound active" indicator
- [ ] Per-limb activity indicator
- [ ] Volume level indicator (optional)
- [ ] Mute indicator

---

## 🟢 PHASE 8: NOW-PLAYING INDICATOR (Polish)

### 8.1 Pitch Visualization
- [ ] Create pitch track component
- [ ] Add moving indicator dot
- [ ] Show scale range (low to high)
- [ ] Label with note names
- [ ] Animate smoothly with arm movement

### 8.2 Note Display
- [ ] Show current note name (e.g., "C4")
- [ ] Show current bass note
- [ ] Add visual keyboard representation (optional)
- [ ] Fade in/out with note

### 8.3 Integration
- [ ] Connect to body-instrument callbacks
- [ ] Update in real-time
- [ ] Handle rapid note changes
- [ ] Performance optimization

---

## 🟢 PHASE 9: CELEBRATION ANIMATIONS (Polish)

### 9.1 First Gesture Celebration
- [ ] Detect first successful gesture
- [ ] Show celebratory popup
- [ ] Add confetti particles
- [ ] Play success sound (subtle)
- [ ] Track in localStorage

### 9.2 Milestone Celebrations
- [ ] Track gesture count
- [ ] Celebrate 10th, 50th, 100th gestures
- [ ] Show achievement popup
- [ ] Add variety to celebrations

### 9.3 Session End Summary (Optional)
- [ ] Track session stats
- [ ] Show on page exit (optional)
- [ ] Display gestures performed
- [ ] Display time spent

---

## 🟢 PHASE 10: PROGRESSIVE HINTS (Polish)

### 10.1 Contextual Hints
- [ ] Show hint after 10s of inactivity
- [ ] Rotate through different hints
- [ ] Point to relevant UI element
- [ ] Dismiss on interaction

### 10.2 Discovery Hints
- [ ] Hint for undiscovered gestures
- [ ] Track which gestures user has tried
- [ ] Suggest new gestures to try
- [ ] "Did you know?" style hints

---

## 📱 PHASE 11: MOBILE OPTIMIZATION

### 11.1 Mobile Header
- [ ] Collapse to minimal brand
- [ ] Hide now-playing section
- [ ] Stack action buttons
- [ ] Hamburger menu for settings

### 11.2 Mobile Footer
- [ ] Hide gesture palette
- [ ] Show simple detection status
- [ ] Touch-friendly controls
- [ ] Simplified layout

### 11.3 Mobile Tutorial
- [ ] Simplified tutorial steps
- [ ] Focus on visual-only interactions
- [ ] Note that sound requires desktop
- [ ] Touch gesture alternatives

### 11.4 Mobile Testing
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Test on iPad
- [ ] Fix any touch issues
- [ ] Optimize performance

---

## 🔧 PHASE 12: TECHNICAL IMPROVEMENTS

### 12.1 Code Organization
- [ ] Create `js/ui-components.js` module
- [ ] Create `js/tutorial.js` module
- [ ] Create `js/help-modal.js` module
- [ ] Refactor gesture detection into module
- [ ] Clean up app.js

### 12.2 Performance
- [ ] Profile animation performance
- [ ] Optimize DOM updates
- [ ] Batch style changes
- [ ] Use CSS containment
- [ ] Reduce reflows

### 12.3 Accessibility
- [ ] Add ARIA labels to all buttons
- [ ] Ensure keyboard navigation
- [ ] Test with screen reader
- [ ] Add focus indicators
- [ ] Support reduced motion

### 12.4 Testing
- [ ] Test all gestures after changes
- [ ] Test tutorial flow
- [ ] Test help modal
- [ ] Test responsive layouts
- [ ] Cross-browser testing

---

## 📊 ESTIMATED EFFORT

| Phase | Tasks | Est. Hours | Priority |
|-------|-------|------------|----------|
| Phase 1: Tutorial | 25+ | 8-10h | 🔴 Critical |
| Phase 2: Gesture Palette | 20+ | 6-8h | 🔴 Critical |
| Phase 3: Active Indicators | 12+ | 4-5h | 🔴 Critical |
| Phase 4: Help Modal | 15+ | 3-4h | 🔴 Critical |
| Phase 5: Header Redesign | 18+ | 5-6h | 🟡 Important |
| Phase 6: Footer Redesign | 15+ | 4-5h | 🟡 Important |
| Phase 7: Sound Toggle | 8+ | 2-3h | 🟡 Important |
| Phase 8: Now Playing | 10+ | 3-4h | 🟢 Polish |
| Phase 9: Celebrations | 10+ | 3-4h | 🟢 Polish |
| Phase 10: Hints | 8+ | 2-3h | 🟢 Polish |
| Phase 11: Mobile | 15+ | 5-6h | 🟡 Important |
| Phase 12: Technical | 12+ | 4-5h | 🟡 Important |

**Total: ~155 tasks, ~50-60 hours**

---

## 🎯 IMPLEMENTATION ORDER

### Sprint 1 (Week 1): Critical UX
1. Tutorial system (Phase 1)
2. Gesture palette (Phase 2)
3. Help modal (Phase 4)

### Sprint 2 (Week 2): Visual Feedback
4. Active gesture indicators (Phase 3)
5. Header redesign (Phase 5)
6. Footer redesign (Phase 6)

### Sprint 3 (Week 3): Polish & Mobile
7. Sound toggle improvement (Phase 7)
8. Now-playing indicator (Phase 8)
9. Mobile optimization (Phase 11)

### Sprint 4 (Week 4): Delight & QA
10. Celebration animations (Phase 9)
11. Progressive hints (Phase 10)
12. Technical improvements (Phase 12)

---

## ✅ DEFINITION OF DONE

Each task is complete when:
- [ ] Feature works in Chrome, Safari, Firefox
- [ ] Responsive on desktop, tablet, mobile
- [ ] Works in both light and dark themes
- [ ] Animations are 60fps
- [ ] Accessible (keyboard + screen reader)
- [ ] No console errors
- [ ] Tested with real users (if applicable)

---

*"Every pixel must serve the user. Every interaction must spark joy."*

— CORPUS Development Team
