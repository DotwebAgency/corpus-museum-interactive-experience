# AWWWARDS Jury Specification: CORPUS Cinematic GSAP Experience

> **Simulated Jury Panel**: Three world-class creative directors assess and specify the ultimate entrance experience for CORPUS — a museum-quality body tracking installation.

---

## 🎭 JURY MEMBER 1: Animation Director (Bruno Simon-type)

### Current Assessment: "Amateur Hour"

*"What I see is basic opacity fades slapped onto existing HTML. There's no choreography, no narrative arc, no emotional journey. The user clicks a button and... things fade in? That's 2015 thinking. We're building for 2026."*

### The Vision: Cinematic Overture

**Phase 0: Pre-Load (0-500ms)**
```
- Black screen with subtle grain texture
- Golden particle dust slowly materializing from corners
- Imperceptible audio: museum ambience (optional)
```

**Phase 1: The Awakening (500ms-2.5s)**
```javascript
// Golden light emanates from center
gsap.fromTo('.awakening-glow', 
  { scale: 0, opacity: 0 },
  { 
    scale: 15, 
    opacity: 0.3, 
    duration: 2,
    ease: 'power4.out'
  }
);

// Logo draws itself using DrawSVGPlugin
// Letters materialize one by one, not fade in
```

**Phase 2: The Invitation (2.5s-5s)**
```
- Title assembles character by character with micro-delays
- Each letter has subtle rotation and scale spring
- Tagline bleeds through like watercolor on paper
- Golden rules (lines) extend from center outward
```

**Phase 3: The Portal (on click)**
```
- Button doesn't just disappear — it TRANSFORMS
- Expands into a golden ring that becomes the loading eye
- User feels they're stepping THROUGH the portal
```

### Critical GSAP Techniques Required:
- `DrawSVGPlugin` for SVG stroke animations
- `CustomEase` for museum-quality easing curves
- `SplitText` (or custom equivalent) for character-level animation
- Timeline nesting with `position` parameters for precise choreography
- `ScrollTrigger` (if scrolling is introduced)

---

## 🎨 JURY MEMBER 2: UX Architect (Resn/Active Theory-type)

### Current Assessment: "Functional but Forgettable"

*"The loading screen shows percentages? Like we're installing software? This is an artistic experience, not a file download. The user should feel like they're preparing for a private viewing, not waiting in a queue."*

### The Vision: Ritual Preparation

**Loading Experience (5-15 seconds typical)**

Instead of: `85%... 90%... 95%... 100%`

We create: **The Artist's Preparation**

```
Stage 1: "The canvas stirs..." (0-20%)
- Soft golden ripples emanate from center
- Eye symbol pulses with heartbeat rhythm
- Ambient particles begin swirling

Stage 2: "Light gathers..." (20-50%)  
- Eye begins to "open" (drawSVG animation)
- Pupil contracts and expands
- Background gradient shifts warmer

Stage 3: "The artist takes position..." (50-80%)
- Eye fully opens, iris forms
- Radial lines burst outward like camera aperture
- Typography states: "Presence sensed"

Stage 4: "Your portrait awaits." (80-100%)
- Eye transforms into viewing frame
- Golden borders materialize
- Final message: "Step into the light"
```

### Transition Choreography

**Loading → Main App**
```javascript
const portalTransition = gsap.timeline();

portalTransition
  // Eye contracts to center point
  .to('.eye-symbol', { 
    scale: 0.1, 
    opacity: 0,
    duration: 0.6,
    ease: 'power3.in'
  })
  // Golden light flash
  .to('.light-burst', {
    scale: 30,
    opacity: 1,
    duration: 0.3,
    ease: 'power4.out'
  }, '-=0.2')
  // Burst fades as main app reveals
  .to('.light-burst', {
    opacity: 0,
    duration: 0.5
  })
  // Header descends like theater curtain rising
  .from('.app-header', {
    y: -100,
    opacity: 0,
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.3')
  // Footer rises from below
  .from('.app-footer', {
    y: 100,
    opacity: 0,
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.6')
  // Canvas frame materializes
  .from('.canvas-frame', {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)'
  }, '-=0.5');
```

---

## 🔬 JURY MEMBER 3: Technical Director (Award Show Judge)

### Current Assessment: "Solid Foundation, Poor Execution"

*"The codebase shows promise — GSAP is loaded, timelines exist. But it's like having a Stradivarius and only playing scales. Where's the virtuosity? Where's the 60fps butter-smooth performance?"*

### Technical Specifications for Excellence

#### 1. GSAP Configuration (Best Practices)
```javascript
// Global GSAP config for museum-quality animation
gsap.config({
  force3D: true,         // GPU acceleration
  nullTargetWarn: false  // Clean console
});

// Custom eases for luxury feel
CustomEase.create('museumEase', 'M0,0 C0.25,0.1 0.25,1 1,1');
CustomEase.create('portalOpen', 'M0,0 C0.5,0 0.5,1.4 1,1');
CustomEase.create('breathe', 'M0,0 C0.5,0 0.5,1 1,1');
```

#### 2. Performance Requirements
```
- 60fps minimum throughout ALL animations
- No layout thrashing (use transform/opacity ONLY)
- Preload all assets during intro animation
- requestAnimationFrame sync with GSAP ticker
- Proper will-change hints in CSS
```

#### 3. Accessibility (Non-negotiable)
```javascript
// Respect user preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(10); // Speed up all animations
  // Or skip entirely to final states
}
```

#### 4. Debug Architecture
```javascript
// Named timelines for debugging
const masterTimeline = gsap.timeline({
  id: 'master-entrance',
  onStart: () => console.log('[CORPUS] 🎬 Entrance sequence started'),
  onComplete: () => console.log('[CORPUS] 🎬 Entrance sequence complete')
});

// Use labels for easier scrubbing
masterTimeline.addLabel('phase-awakening', 0);
masterTimeline.addLabel('phase-invitation', 2.5);
masterTimeline.addLabel('phase-portal', 5);
```

---

## 📋 IMPLEMENTATION TODO LIST

### Phase 1: Foundation (Critical)
- [ ] Remove all non-GSAP animations (CSS transitions, manual opacity)
- [ ] Create master timeline architecture
- [ ] Define custom eases for brand consistency
- [ ] Set up GSAP debug mode for development
- [ ] Implement prefers-reduced-motion support

### Phase 2: Intro Screen Redesign
- [ ] Design golden grain texture background
- [ ] Create SVG logo with stroke paths for DrawSVG
- [ ] Implement character-by-character title reveal
- [ ] Add particle system initialization during intro
- [ ] Design CTA button with hover micro-interactions
- [ ] Add golden rule lines extending from center
- [ ] Implement ambient cursor-following gradient

### Phase 3: Button → Portal Transition
- [ ] Design portal expansion SVG animation
- [ ] Create golden light burst effect
- [ ] Implement button morphing to eye symbol
- [ ] Add camera shake micro-effect on click
- [ ] Seamless handoff to loading screen

### Phase 4: Loading Screen Overhaul
- [ ] Replace percentage with poetic status messages
- [ ] Create eye opening SVG animation (DrawSVG)
- [ ] Implement pupil/iris animations based on progress
- [ ] Add radial burst effect at 100%
- [ ] Design "portal frame" that becomes main canvas
- [ ] Create heartbeat pulse rhythm for eye
- [ ] Add ambient particle acceleration at completion

### Phase 5: Loading → Main Transition
- [ ] Eye contracts to center point
- [ ] Golden light flash overlay
- [ ] Header theater-curtain reveal
- [ ] Footer rise from below
- [ ] Canvas frame materialization
- [ ] Detection status pulse start
- [ ] First frame of avatar detection

### Phase 6: Character Entrance (Avatar)
- [ ] Debug and fix anatomical build-up animation
- [ ] Spine appears first (center of body)
- [ ] Limbs extend outward from center
- [ ] Joints pop with elastic ease
- [ ] Face fades in last (50%+ of animation)
- [ ] Add subtle glow bloom during entrance
- [ ] Celebratory particle burst on completion

### Phase 7: Polish & Performance
- [ ] Profile all animations for 60fps
- [ ] Test on slower hardware
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile performance audit
- [ ] Remove all debug console.logs
- [ ] Final timeline timing adjustments

### Phase 8: Final Review
- [ ] Full user journey walkthrough
- [ ] Timing adjustments based on feel
- [ ] Sound design consideration (optional)
- [ ] Documentation of animation system
- [ ] GitHub push with detailed commit message

---

## 🎯 SUCCESS CRITERIA

The entrance experience will be AWWWARDS-worthy when:

1. **No user feels they are "waiting"** — every moment is engaging
2. **Animations feel inevitable** — like they couldn't happen any other way
3. **Performance is invisible** — 60fps always, no jank ever
4. **The journey has emotional arc** — anticipation → wonder → readiness
5. **Users want to share it** — "You have to see how this starts"

---

## 💡 INSPIRATION REFERENCES

- **Apple Product Pages**: Scroll-triggered choreography
- **Stripe's Homepage**: Micro-interaction excellence
- **Resn's Work**: Experimental but functional
- **Active Theory**: WebGL + GSAP harmony
- **Bruno Simon's Portfolio**: 3D GSAP mastery

---

*"Make them forget they clicked a button. Make them feel they stepped into a museum."*

— The AWWWARDS Jury, 2026
