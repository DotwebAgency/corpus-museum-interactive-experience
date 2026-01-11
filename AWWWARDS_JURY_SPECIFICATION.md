# AWWWARDS Jury Specification Document
## CORPUS — The Million-Dollar Digital Portrait Experience

---

# 🏆 JURY PANEL SIMULATION

## Jury Member 1: **Maria Vincenza Galatà** 
*Creative Director, Former AKQA Milan | AWWWARDS Jury Expert*

## Jury Member 2: **Tobias van Schneider**
*Founder Semplice | Former Lead Product Designer Spotify | AWWWARDS Judge*

## Jury Member 3: **Claudio Guglieri**
*Head of Design Microsoft | Former Design Director Tool | AWWWARDS HOF*

---

# 📋 JURY CONSENSUS SPECIFICATION

## Overall Vision Statement

> "CORPUS should feel like walking into the Louvre at golden hour — a moment of reverence, wonder, and intimate connection with art. The entrance experience must be the digital equivalent of crossing the threshold into a sacred space." — Maria Vincenza Galatà

> "Every micro-interaction should feel intentional. The user isn't clicking a button; they're beginning a journey. Time should feel suspended." — Tobias van Schneider  

> "This needs to win three years in a row because each visit reveals new layers. The animation system should be so sophisticated that users discover new details on their tenth visit." — Claudio Guglieri

---

# 🎭 PHASE 1: THE APPROACH
## Entry Screen / Hero Sequence

### 1.1 Initial Canvas State
**Before any user interaction, the page is alive:**

```
┌─────────────────────────────────────────────┐
│                                             │
│     ✧  ·  ✦    ·   ✧                        │  ← Ethereal particles
│        ·      ✧     ·                       │
│   ✦      [CORPUS Logo]      ✧               │  ← SVG drawing itself
│              ·                               │
│        ✧   ·   ✦    ·                       │
│     ·         ✧        ·                    │
│                                             │
└─────────────────────────────────────────────┘
```

#### Ambient Effects (Always Running):
1. **Ethereal Particle Field**
   - 50-80 soft, glowing particles
   - Colors: Soft gold (#D4AF37), Rose quartz (#F4C4C4), Pearl (#F5F5F0)
   - Movement: Gentle float with Perlin noise, not random
   - Size variation: 1-4px with soft blur
   - Opacity: 0.2-0.6, breathing animation

2. **Subtle Background Gradient Animation**
   - Base: Warm ivory (#FAF8F5) → Soft cream (#F5F0E8)
   - Animated radial gradient following invisible cursor
   - Very subtle color temperature shifts over 30 seconds

3. **Golden Vignette Breathing**
   - Soft gold border glow
   - Breathing at 0.1Hz (10 second cycle)
   - Intensity: 5-15% opacity variation

### 1.2 Logo Reveal Sequence
**Duration: 3.2 seconds | Triggered: On page load**

```javascript
// GSAP Timeline: Logo Reveal
const logoReveal = gsap.timeline({ delay: 0.5 });

logoReveal
  // Stage 1: Outer frame draws
  .fromTo('.logo-frame-outer', 
    { drawSVG: '0%', opacity: 0 },
    { drawSVG: '100%', opacity: 0.3, duration: 1.2, ease: 'power2.inOut' }
  )
  // Stage 2: Inner frame draws (staggered)
  .fromTo('.logo-frame-inner',
    { drawSVG: '0%', opacity: 0 },
    { drawSVG: '100%', opacity: 0.2, duration: 0.8, ease: 'power2.inOut' },
    '-=0.4'
  )
  // Stage 3: Vitruvian figure materializes
  .fromTo('.vitruvian-skeleton path',
    { drawSVG: '0%', opacity: 0 },
    { drawSVG: '100%', opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power1.out' },
    '-=0.3'
  )
  // Stage 4: Golden joints pop in
  .fromTo('.vitruvian-joints circle',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 0.9, duration: 0.6, stagger: 0.08, ease: 'elastic.out(1, 0.5)' },
    '-=0.8'
  )
  // Stage 5: Golden glow emanates
  .to('.logo-glow',
    { opacity: 1, scale: 1.2, duration: 1, ease: 'power2.out' },
    '-=0.4'
  );
```

### 1.3 Typography Cascade
**Duration: 2.8 seconds | Triggered: After logo (overlap 0.5s)**

#### Title "CORPUS" Reveal:
- **Technique**: Character-by-character with SplitText
- **Effect**: Each letter rises from below with golden dust trail
- **Easing**: Custom bezier `cubic-bezier(0.34, 1.56, 0.64, 1)`

```javascript
const titleSplit = SplitText.create('.intro-title', { type: 'chars' });

gsap.fromTo(titleSplit.chars,
  { 
    y: 80, 
    opacity: 0, 
    rotationX: -40,
    transformOrigin: 'bottom center'
  },
  { 
    y: 0, 
    opacity: 1, 
    rotationX: 0,
    duration: 1.2,
    stagger: { each: 0.08, from: 'center' },
    ease: 'back.out(1.7)'
  }
);
```

#### Tagline "Behold the form." Reveal:
- **Technique**: Word-by-word fade with slight Y movement
- **Timing**: 0.3s after title completes
- **Effect**: Italic sweep with gold tint flash

#### Subtitle Reveal:
- **Technique**: Line-by-line fade up
- **Timing**: Staggered 0.2s per line
- **Effect**: Soft focus sharpening (blur 8px → 0px)

### 1.4 Call-to-Action Button Materialization
**Duration: 1.8 seconds | Triggered: After subtitle**

#### Button Appearance Sequence:
1. **Ghost outline appears** (0-0.4s)
   - Golden border draws clockwise from center-top
   - DrawSVG effect with 1px stroke

2. **Fill materializes** (0.3-0.8s)
   - Gradient sweeps left-to-right
   - Subtle inner shadow grows

3. **Text reveals** (0.6-1.2s)
   - "Begin the Sitting" types out character by character
   - Typewriter effect with gold cursor

4. **Flourish appears** (1.0-1.8s)
   - ❧ symbol scales in with elastic bounce
   - Golden particles burst from symbol

5. **Ready state shimmer** (1.5s-loop)
   - Subtle gradient animation indicates interactivity
   - Breathing glow effect

### 1.5 Button Interaction States

#### Hover State:
```javascript
button.addEventListener('mouseenter', () => {
  gsap.to(button, {
    scale: 1.03,
    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4)',
    duration: 0.4,
    ease: 'power2.out'
  });
  
  // Particle burst from cursor position
  createParticleBurst(cursorX, cursorY, { count: 12, color: 'gold' });
  
  // Text slight glow increase
  gsap.to('.cta-text', {
    textShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
    duration: 0.3
  });
});
```

#### Click/Press State:
```javascript
button.addEventListener('mousedown', () => {
  gsap.timeline()
    .to(button, { scale: 0.97, duration: 0.1 })
    .to('.cta-text', { letterSpacing: '0.15em', duration: 0.1 }, 0)
    .to('.cta-flourish', { rotation: 15, duration: 0.1 }, 0);
});
```

---

# 🌟 PHASE 2: THE AWAKENING
## Loading / Transition Sequence

### 2.1 Button Transforms to Portal
**Duration: 1.5 seconds | Triggered: On click**

```javascript
const awakeningTimeline = gsap.timeline();

awakeningTimeline
  // Button expands to fill screen
  .to('.intro-cta', {
    scale: 50,
    borderRadius: 0,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.in'
  })
  // Golden light burst
  .fromTo('.transition-flash',
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 3, duration: 0.3, ease: 'power2.out' },
    '-=0.5'
  )
  .to('.transition-flash',
    { opacity: 0, duration: 0.5, ease: 'power2.in' }
  );
```

### 2.2 Loading Canvas Reveal

The awakening screen should feel like entering a cathedral:

#### Visual Composition:
```
┌─────────────────────────────────────────────┐
│                                             │
│              ≋≋≋ SCANNING ≋≋≋               │  ← Horizontal scan lines
│     ┌─────────────────────────────┐         │
│     │                             │         │
│     │    [Central Eye Symbol]     │         │  ← Animated eye opening
│     │                             │         │
│     └─────────────────────────────┘         │
│                                             │
│         ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░             │  ← Progress bar (golden)
│              42%                            │
│                                             │
│     "Preparing the artist's vision..."      │  ← Status text
│                                             │
└─────────────────────────────────────────────┘
```

#### Animated Eye Symbol:
- SVG eye that opens progressively
- Iris color shifts through palette
- Pupil dilates as progress increases
- Golden rays emanate on completion

### 2.3 Progress Visualization
**Total Duration: Variable (2-5 seconds typically)**

#### Progress Bar Design:
```css
.progress-track {
  width: 280px;
  height: 2px;
  background: rgba(212, 175, 55, 0.15);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    #D4AF37 0%, 
    #F4D03F 50%, 
    #D4AF37 100%);
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
  transform-origin: left;
}
```

#### Progress Milestones:
| Progress | Message | Visual |
|----------|---------|--------|
| 0-20% | "The canvas stirs" | Eye beginning to open |
| 20-40% | "Perceiving the human form" | Silhouette fading in |
| 40-60% | "Studying the countenance" | Face outline appearing |
| 60-80% | "Learning the language of gesture" | Hand outlines |
| 80-100% | "The sitting may begin" | Full figure visible |

### 2.4 Completion Flourish
**Duration: 1.2 seconds | Triggered: At 100%**

```javascript
const completionTimeline = gsap.timeline();

completionTimeline
  // Eye fully opens with golden flash
  .to('.awakening-eye', {
    scale: 1.2,
    filter: 'brightness(1.5)',
    duration: 0.3
  })
  // Rays burst outward
  .fromTo('.eye-rays',
    { scale: 0, rotation: 0 },
    { scale: 1, rotation: 180, duration: 0.8, ease: 'power2.out' },
    '-=0.1'
  )
  // Progress bar pulses and fades
  .to('.progress-container', {
    scale: 1.1,
    opacity: 0,
    duration: 0.4
  }, '-=0.5')
  // Status text transforms
  .to('.awakening-status', {
    letterSpacing: '0.3em',
    opacity: 0,
    y: -20,
    duration: 0.5
  }, '-=0.3');
```

---

# 🎨 PHASE 3: THE REVELATION
## Main Experience Entry

### 3.1 Canvas Expansion
**Duration: 2 seconds | Seamless transition from loading**

The awakening screen doesn't disappear — it *transforms* into the main canvas:

```javascript
const revelationTimeline = gsap.timeline();

revelationTimeline
  // Background transitions to main canvas color
  .to('.awakening-overlay', {
    backgroundColor: 'var(--canvas-deep)',
    duration: 0.8,
    ease: 'power2.inOut'
  })
  // Eye transforms into canvas center point
  .to('.awakening-eye', {
    scale: 0.1,
    opacity: 0,
    duration: 0.6
  }, '-=0.6')
  // Ornate frame borders animate in
  .fromTo('.frame-border',
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 0.7, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
    '-=0.4'
  )
  // Header slides down
  .fromTo('.app-header',
    { y: -60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    '-=0.5'
  )
  // Footer rises up
  .fromTo('.app-footer',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    '-=0.5'
  );
```

### 3.2 First Subject Detection Animation
**See: AWWWARDS_ENTRANCE_ANIMATION.md for full skeleton assembly spec**

---

# 🎯 TECHNICAL REQUIREMENTS

## Animation Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| FPS during animations | 60fps | Must maintain |
| First contentful paint | <1.5s | Required |
| Time to interactive | <3s | Required |
| Animation jank | 0 frames dropped | Required |
| Memory usage | <150MB | Required |

## GSAP Configuration

```javascript
// Register all required plugins
gsap.registerPlugin(
  ScrollTrigger,
  SplitText,      // Premium: Text splitting
  DrawSVGPlugin,  // Premium: SVG path animation
  MorphSVGPlugin, // Premium: Shape morphing
  CustomEase,     // Custom bezier curves
  CustomBounce,   // Physics-based bounces
  Flip,           // FLIP animations
  Observer        // Scroll/gesture detection
);

// Global defaults for luxury feel
gsap.defaults({
  ease: 'power2.out',
  duration: 0.8,
  overwrite: 'auto'
});

// Custom eases
CustomEase.create('luxuryIn', 'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1');
CustomEase.create('luxuryOut', 'M0,0 C0.182,0.001 0.368,0.002 0.56,0.178 0.718,0.326 0.874,0.618 1,1');
CustomEase.create('luxuryInOut', 'M0,0 C0.204,0.006 0.306,0.228 0.4,0.4 0.5,0.6 0.694,0.994 1,1');
```

## Color Palette: Louvre Pastel

```css
:root {
  /* Primary Canvas - NOT GRAY, Warm Ivory */
  --canvas-deep: #F8F6F1;      /* Warm parchment base */
  --canvas-warm: #FBF9F4;      /* Lighter cream */
  --canvas-mid: #F0EDE6;       /* Soft shadow tone */
  
  /* Gallery Accent Colors */
  --gold-bright: #D4AF37;      /* Rich gold */
  --gold-muted: #C9A227;       /* Aged gold */
  --gold-glow: rgba(212, 175, 55, 0.25);
  
  /* Pastel Palette - Old Master inspired */
  --rose-blush: #F4E4E4;       /* Soft rose white */
  --powder-blue: #E4EEF4;      /* Pale sky blue */
  --mint-cream: #E4F4EC;       /* Soft sage green */
  --lavender: #EAE4F4;         /* Gentle lavender */
  --peach: #F4EAE4;            /* Warm peach white */
  
  /* Subtle Glows */
  --rose-glow: rgba(244, 200, 200, 0.2);
  --lavender-glow: rgba(200, 184, 216, 0.2);
  --blue-glow: rgba(200, 216, 232, 0.2);
}
```

---

# ✅ SUCCESS CRITERIA (Jury Unanimous)

## Must-Have Features:

- [ ] Ambient particle system active from first frame
- [ ] Logo SVG draws itself on load
- [ ] Title reveals character-by-character
- [ ] Button materializes with multiple stages
- [ ] Loading screen has animated progress visualization
- [ ] Transitions feel seamless (no jarring cuts)
- [ ] Main canvas entry is theatrical
- [ ] Skeleton assembles anatomically
- [ ] 60fps maintained throughout
- [ ] Works on all modern browsers
- [ ] Respects prefers-reduced-motion

## Emotional Checkpoints:

1. **Second 0-3**: "Something beautiful is happening"
2. **Second 3-6**: "I want to explore this"
3. **Second 6-10**: "This feels premium"
4. **On button press**: "A moment of anticipation"
5. **During loading**: "I'm being welcomed somewhere special"
6. **Main reveal**: "Wow."

---

# 📊 JURY SCORING PREDICTION

| Category | Expected Score | Notes |
|----------|---------------|-------|
| Design | 9.8/10 | Museum-quality aesthetic |
| Usability | 9.5/10 | Clear journey, intuitive |
| Creativity | 9.9/10 | Novel approach to webcam UX |
| Content | 9.6/10 | Meaningful, not gimmicky |
| **Overall** | **9.7/10** | **Site of the Year Contender** |

---

*"This is not a website. This is an experience. This is why we give awards."*
— Simulated Jury Consensus
