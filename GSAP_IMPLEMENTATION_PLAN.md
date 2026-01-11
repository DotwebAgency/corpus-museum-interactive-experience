# CORPUS — GSAP Animation Implementation Plan

**Date:** January 11, 2026  
**Objective:** Transform CORPUS into an Awwwards-winning experience with GSAP-powered animations  
**Library:** GSAP 3.x (GreenSock Animation Platform)

---

## Why GSAP?

1. **Performance**: Hardware-accelerated, 60fps animations
2. **Control**: Timeline-based sequencing, perfect for orchestrated reveals
3. **Easing**: Custom easing functions for organic, museum-quality motion
4. **Cross-browser**: Rock-solid compatibility
5. **Features**: ScrollTrigger, SplitText, morphing, and more

---

## Implementation Phases

### Phase 1: Setup & Dependencies
- [ ] Add GSAP via CDN (core + plugins)
- [ ] Create animation module `js/animations.js`
- [ ] Remove all CSS animations, replace with GSAP

### Phase 2: Intro Screen Enhancements
- [ ] **Keyboard Support**: Enter/Space triggers "Begin the Sitting"
- [ ] **Title Reveal**: Staggered letter animation using SplitText
- [ ] **Logo Animation**: SVG draw-on effect with morphSVG
- [ ] **Button Hover**: Smooth scale + glow with elastic easing
- [ ] **Button Click**: Satisfying press animation before transition
- [ ] **Dust Particles**: GSAP-controlled floating (not CSS keyframes)

### Phase 3: Intro → Main Transition
- [ ] **Orchestrated Exit**: All elements fade/slide in sequence
- [ ] **Crossfade**: Smooth opacity transition to main app
- [ ] **Frame Reveal**: Borders animate in from corners
- [ ] **Header/Footer Slide**: Slide in from edges with stagger

### Phase 4: Main App Animations
- [ ] **Status Panel Entry**: Slide + scale from right with bounce
- [ ] **Detection State Changes**: Smooth value morphs
- [ ] **Spark Indicator**: Pulse animation on fist close
- [ ] **Theme Toggle**: Rotate + color shift animation

### Phase 5: Loading State
- [ ] **Candle Flame**: More organic flicker with GSAP
- [ ] **Progress Bar**: Smooth fill with easing
- [ ] **Text Cycling**: Fade between loading messages

### Phase 6: Micro-interactions
- [ ] **All Buttons**: Unified hover/press states
- [ ] **Links/Icons**: Subtle lift effects
- [ ] **Focus States**: Animated outlines

---

## Technical Architecture

### Module Structure
```javascript
// js/animations.js
export const Animations = {
  intro: {
    titleReveal: (el) => gsap.timeline()...,
    logoDrawOn: (el) => gsap.timeline()...,
    buttonHover: (el) => gsap.timeline()...,
    exitSequence: () => gsap.timeline()...,
  },
  main: {
    panelEntry: (el) => gsap.timeline()...,
    sparkPulse: (el) => gsap.timeline()...,
    themeToggle: (el, theme) => gsap.timeline()...,
  },
  loading: {
    flameFlicker: (el) => gsap.timeline()...,
    progressFill: (el, percent) => gsap.to()...,
  },
  utils: {
    fadeIn: (el, opts) => gsap.to()...,
    fadeOut: (el, opts) => gsap.to()...,
    staggerReveal: (els, opts) => gsap.to()...,
  }
};
```

### GSAP Configuration
```javascript
gsap.config({
  force3D: true,
  nullTargetWarn: false
});

gsap.defaults({
  ease: "power2.out",
  duration: 0.6
});
```

### Custom Easings for Museum Quality
```javascript
// Organic, gallery-appropriate easings
const EASINGS = {
  elegant: "power3.out",
  bounce: "elastic.out(1, 0.5)",
  smooth: "power2.inOut",
  snap: "power4.out",
  breathe: "sine.inOut",
  dramatic: "expo.out"
};
```

---

## Animation Specifications

### Intro Title Reveal
```javascript
// Split text into chars, stagger reveal
gsap.timeline()
  .from(".intro-title", { 
    opacity: 0, 
    y: 60, 
    duration: 1.2, 
    ease: "power3.out" 
  })
  .from(".intro-title", {
    filter: "blur(10px)",
    duration: 0.8
  }, "-=1");
```

### Button Hover (No Clipping!)
```javascript
// Create smooth hover timeline
const hoverTl = gsap.timeline({ paused: true })
  .to(button, {
    scale: 1.02,
    y: -3,
    boxShadow: "0 8px 40px rgba(212,175,55,0.5)",
    duration: 0.4,
    ease: "power2.out"
  })
  .to(button.querySelector('.cta-flourish'), {
    x: 6,
    duration: 0.3,
    ease: "power2.out"
  }, "-=0.3");

button.addEventListener('mouseenter', () => hoverTl.play());
button.addEventListener('mouseleave', () => hoverTl.reverse());
```

### Intro → Main Transition
```javascript
gsap.timeline()
  // Exit intro elements
  .to(".intro-title", { y: -40, opacity: 0, duration: 0.6 })
  .to(".intro-tagline", { y: -30, opacity: 0, duration: 0.5 }, "-=0.4")
  .to(".intro-subtitle", { y: -20, opacity: 0, duration: 0.4 }, "-=0.3")
  .to(".intro-cta", { scale: 0.9, opacity: 0, duration: 0.4 }, "-=0.3")
  .to(".intro-logo", { scale: 0.8, opacity: 0, duration: 0.5 }, "-=0.5")
  .to(".intro-screen", { opacity: 0, duration: 0.5 })
  // Enter main elements
  .set(".main-app", { display: "flex" })
  .from(".frame-border", { 
    scaleX: 0, 
    scaleY: 0, 
    transformOrigin: "center", 
    duration: 0.6,
    stagger: 0.1 
  })
  .from(".app-header", { y: -60, opacity: 0, duration: 0.5 }, "-=0.3")
  .from(".app-footer", { y: 60, opacity: 0, duration: 0.5 }, "-=0.4")
  .from(".status-panel", { 
    x: 100, 
    opacity: 0, 
    scale: 0.9,
    duration: 0.6, 
    ease: "back.out(1.5)" 
  }, "-=0.3");
```

### Spark Indicator Pulse
```javascript
// Triggered on fist close
const sparkPulse = gsap.timeline({ repeat: -1, yoyo: true })
  .to(".spark-orb", {
    scale: 1.15,
    duration: 0.8,
    ease: "sine.inOut"
  })
  .to(".spark-icon", {
    rotate: 360,
    duration: 2,
    ease: "none"
  }, 0);
```

---

## Performance Guidelines

1. **Use `will-change` sparingly** - Let GSAP handle optimization
2. **Avoid animating `width/height`** - Use `scale` instead
3. **Batch DOM reads** - Before animation starts
4. **Use `gsap.quickTo()`** - For frequently updated values
5. **Kill timelines** - When elements unmount

---

## CSS Animation Replacements

| Current CSS | GSAP Replacement |
|-------------|------------------|
| `@keyframes fadeInUp` | `gsap.from(el, { y: 30, opacity: 0 })` |
| `@keyframes dustFloat` | GSAP random motion loop |
| `@keyframes flameFlicker` | GSAP with random scale/opacity |
| `@keyframes goldShimmer` | GSAP backgroundPosition animation |
| `@keyframes orbPulse` | GSAP scale + opacity loop |
| `@keyframes iconGlow` | GSAP text-shadow animation |
| `@keyframes textShimmer` | GSAP backgroundPosition |
| `@keyframes particleFloat` | GSAP y + opacity stagger |
| `@keyframes plaqueShimmer` | GSAP x translation |

---

## Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Setup | 10 min | P0 |
| Phase 2: Intro | 30 min | P0 |
| Phase 3: Transition | 20 min | P0 |
| Phase 4: Main App | 20 min | P1 |
| Phase 5: Loading | 10 min | P2 |
| Phase 6: Micro-interactions | 15 min | P2 |

---

## Success Criteria

✅ No animation "clipping" or jarring transitions  
✅ All interactions feel "buttery smooth"  
✅ Keyboard support works (Enter/Space)  
✅ 60fps on mid-range devices  
✅ Timelines can be paused/reversed  
✅ Theme transitions are animated  
✅ Awwwards jury would approve

---

*"Animation is the illusion of life." — Frank Thomas & Ollie Johnston*

