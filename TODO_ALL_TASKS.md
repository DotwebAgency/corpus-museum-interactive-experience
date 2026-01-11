# CORPUS — Master Implementation TODO

## 🎯 Three Major Tasks

1. **Tutorial Redesign** — Side panel, not overlay
2. **Arm Music Enhancement** — Continuous pitch control
3. **Flat Design** — Header/Footer symmetry

---

## 📚 TASK 1: Tutorial Redesign

### Phase 1: Structure
- [ ] Create TutorialPanel class (separate from TutorialManager)
- [ ] Add tutorial panel HTML structure (sidebar format)
- [ ] Position panel on right side (same as help panel)
- [ ] Implement slide-in/out animation

### Phase 2: Content
- [ ] Define 5 tutorial steps (Goldilocks zone)
- [ ] Step 1: Welcome (auto-advance)
- [ ] Step 2: Body tracking (wait for detection)
- [ ] Step 3: Hand gestures (wait for fist)
- [ ] Step 4: Sound enable (wait for toggle)
- [ ] Step 5: Complete (auto-dismiss)

### Phase 3: Detection Integration
- [ ] Body detection listener
- [ ] Gesture detection listener
- [ ] Sound enable listener
- [ ] Auto-advance timers

### Phase 4: Styling
- [ ] Glassmorphism background (brand-aligned)
- [ ] Golden accents and borders
- [ ] Progress dots (● ○ ○ ○ ○)
- [ ] Step icons and animations
- [ ] Brand typography

### Phase 5: State Management
- [ ] First-visit detection (localStorage)
- [ ] Session progress (sessionStorage)
- [ ] Skip functionality
- [ ] Restart from help panel

### Phase 6: Responsive
- [ ] Desktop: 320px sidebar
- [ ] Tablet: 280px sidebar
- [ ] Mobile: Bottom drawer

---

## 🎵 TASK 2: Arm Music Enhancement

### Phase 1: Synth Setup
- [ ] Create MonoSynth for melody (right arm)
- [ ] Create MonoSynth for bass (left arm)
- [ ] Configure portamento for smooth glides
- [ ] Set up effects chain

### Phase 2: Pitch Mapping
- [ ] Map right arm Y to C3-C5 (2 octaves)
- [ ] Map left arm Y to C2-G3 (1.5 octaves)
- [ ] Exponential frequency mapping
- [ ] Optional scale quantization

### Phase 3: Continuous Control
- [ ] Track arm visibility
- [ ] Trigger attack when arm enters
- [ ] Update frequency continuously
- [ ] Trigger release when arm exits

### Phase 4: Smoothing
- [ ] Lerp frequency changes
- [ ] Different smooth factors per instrument
- [ ] Ignore tiny frequency changes

### Phase 5: Integration
- [ ] Add to existing BodyInstrument class
- [ ] Toggle between continuous/discrete modes
- [ ] Update footer to show mode
- [ ] Add mode toggle control

### Phase 6: Visual Feedback
- [ ] Pitch rails on sides
- [ ] Moving indicators for each arm
- [ ] Active state styling

---

## 🎨 TASK 3: Flat Design Overhaul

### Phase 1: CSS Variables
- [ ] Define flat color palette
- [ ] Remove gradient variables
- [ ] Define spacing tokens (8px grid)
- [ ] Define size tokens

### Phase 2: Header Redesign
- [ ] Remove gradient background
- [ ] Add solid background
- [ ] Remove box-shadow
- [ ] Add bottom border only
- [ ] Grid-align buttons (32px)
- [ ] Perfect 3-column layout
- [ ] Simplify hover states

### Phase 3: Footer Redesign
- [ ] Remove glassmorphism
- [ ] Add solid background
- [ ] Remove blur effects
- [ ] Add top border only
- [ ] Perfect symmetry
- [ ] Grid-align all elements
- [ ] Clear section dividers

### Phase 4: Shared Components
- [ ] Unified button style
- [ ] Unified icon size
- [ ] Consistent spacing
- [ ] Flat hover/active states

### Phase 5: Theme Consistency
- [ ] Update dark theme colors
- [ ] Update light theme colors
- [ ] Test theme switching
- [ ] Verify contrast ratios

### Phase 6: Polish
- [ ] Remove all glows/shadows
- [ ] Verify 8px grid alignment
- [ ] Check responsive behavior
- [ ] Cross-browser test

---

## ⏱️ Estimated Timeline

| Task | Effort | Priority |
|------|--------|----------|
| Flat Design | 2 hours | High (visual fix) |
| Arm Music | 3 hours | High (functionality) |
| Tutorial | 4 hours | Medium (UX improvement) |

**Total**: ~9 hours

---

## 🚀 Implementation Order

1. **Flat Design** — Quick visual improvement
2. **Arm Music** — Core feature enhancement
3. **Tutorial** — Polish UX

Start with flat design as it's the quickest win and improves overall aesthetic immediately.
