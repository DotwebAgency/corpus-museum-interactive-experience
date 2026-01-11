# AWWWARDS Jury Design Critique

## MediaPipe Particle Simulator — Design Review Panel

**Jury Panel**: Tobias van Schneider (Former Spotify), Sarah Drasner (Google), Vitaly Friedman (Smashing Magazine), Nacho Ortiz (Active Theory)

**Date**: January 2026  
**Category**: Experimental / WebGL / Interactive Experience

---

## Executive Summary

> "This is either going to be a portfolio centerpiece or visual noise. The line between revolutionary and gimmicky is razor-thin with particle systems. Let's dissect what separates a $500/hour agency deliverable from a CodePen demo." — Tobias van Schneider

---

## I. Typography Analysis

### Current State: REJECTED

The default system fonts and generic sans-serifs scream "developer project." For ultra-high-net-worth (UHNW) audiences expecting $50M yacht configurators and private banking portals, typography is the silent credibility marker.

### Recommendations

**Primary Display Font**: `PP Neue Montreal` or `GT America Extended`
- Weight: 500-600 for headers
- Letter-spacing: -0.02em (tighter than default)
- Use for: Status indicators, mode labels

**Secondary/Body Font**: `Inter` with custom optical sizing OR `Söhne`
- Weight: 400 for body, 300 for subtle UI
- Use for: Keyboard shortcuts, tooltips

**Monospace Accent**: `JetBrains Mono` or `Berkeley Mono`
- Use sparingly for: Technical readouts, FPS counter (if shown)

### Typography Hierarchy

```
Level 1 (Hero):     72px / 700 / -0.03em / PP Neue Montreal
Level 2 (Section):  32px / 500 / -0.02em / PP Neue Montreal  
Level 3 (UI Label): 13px / 500 / 0.08em (uppercase) / Inter
Level 4 (Caption):  11px / 400 / 0.02em / Inter
```

### Motion Typography

- Text should NEVER just "appear" — fade in with 200ms ease-out + subtle Y-translate (8px)
- Status changes: Cross-fade with 150ms overlap
- Numbers/counts: Use `font-variant-numeric: tabular-nums` to prevent layout shift

---

## II. Color Architecture

### Current State: AMATEUR

"Rainbow, Fire, Ocean" — these are theme names from a 2015 music visualizer. UHNW clients don't want "Ocean" — they want **"Midnight Amalfi"** or **"Carbon Noir."**

### The Chromatic Philosophy

For futuristic interfaces targeting sophisticated audiences, we operate under the **"Dark Luxe"** principle:

1. **Base**: Near-black with subtle warmth or coolness (never pure #000000)
2. **Accent**: One high-chroma color used with surgical precision
3. **Hierarchy**: Achieved through opacity and luminance, not hue variation
4. **Glow**: Soft, diffused — never harsh bloom

### Refined Theme Palettes

#### Theme 1: "Void" (Default)
```css
--bg-primary: #08080A;
--bg-elevated: #111114;
--text-primary: rgba(255, 255, 255, 0.92);
--text-secondary: rgba(255, 255, 255, 0.55);
--accent: #00F0FF;
--accent-glow: rgba(0, 240, 255, 0.15);
--particle-core: #FFFFFF;
--particle-trail: rgba(0, 240, 255, 0.4);
```

#### Theme 2: "Ember"
```css
--bg-primary: #0A0806;
--accent: #FF6B35;
--accent-secondary: #FFB800;
--particle-gradient: linear-gradient(135deg, #FF6B35, #FF2E63);
```

#### Theme 3: "Deep Sea"
```css
--bg-primary: #040810;
--accent: #00FFD4;
--accent-secondary: #0088FF;
--particle-gradient: linear-gradient(135deg, #00FFD4, #0066FF);
```

#### Theme 4: "Nebula"
```css
--bg-primary: #080410;
--accent: #A855F7;
--accent-secondary: #EC4899;
--particle-gradient: linear-gradient(135deg, #A855F7, #EC4899);
```

#### Theme 5: "Signal" (Matrix-inspired but elevated)
```css
--bg-primary: #030A06;
--accent: #22C55E;
--accent-secondary: #10B981;
--particle-core: #4ADE80;
--scanline-opacity: 0.03;
```

### Color Application Rules

1. **Never use accent at 100% opacity** on large surfaces — max 80%
2. **Glow effects**: Use `box-shadow` with 40-60px blur radius, 15-25% opacity
3. **Text on dark**: Prefer rgba white with 0.87-0.92 opacity for primary
4. **Gradients**: Subtle, 5-10° angle shifts create dimensionality

---

## III. Motion Design System

### Current State: NON-EXISTENT

> "Without motion design, this is a tech demo. With it, it's an experience." — Sarah Drasner

### The Kinetic Hierarchy

#### Tier 1: Structural Transitions (300-500ms)
- Intro screen → Main experience
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)

#### Tier 2: Component State Changes (150-250ms)  
- Button hover, mode toggle
- Easing: `cubic-bezier(0.33, 1, 0.68, 1)` (quart-out)

#### Tier 3: Micro-interactions (80-150ms)
- Keyboard shortcut highlight, status dot pulse
- Easing: `cubic-bezier(0.25, 1, 0.5, 1)` (quint-out)

### Entrance Choreography

The intro screen should feel like a **curtain rising**:

```
T+0ms:      Background particles begin ambient drift
T+400ms:    Logo/title fades in (opacity 0→1, Y: 20px→0)
T+600ms:    Subtitle/tagline appears (stagger: 100ms per word)
T+900ms:    "Enable Camera" button scales in (0.9→1, opacity 0→1)
T+1200ms:   Keyboard hint fades in at bottom
```

### Particle Motion Principles

1. **Attraction**: Particles should accelerate gradually, then decelerate sharply near targets (ease-in-out-expo)
2. **Repulsion**: Sharp initial burst, then gradual slowdown with organic wobble
3. **Idle State**: Perlin noise-driven drift — NEVER static
4. **Theme Transition**: 800ms cross-fade, particles maintain momentum through transition

### Loading States

Never show a spinner. Use:
- Skeleton screens with shimmer (for UI)
- Ambient particle animation (for main canvas)
- Progressive text: "Initializing..." → "Loading models..." → "Preparing camera..."

---

## IV. Spatial Composition

### The Grid System

For UI overlay elements, use an **8px base unit** system:
- Spacing: 8, 16, 24, 32, 48, 64, 96px
- Border radius: 4px (buttons), 8px (cards), 16px (modals)

### Z-Index Architecture

```
Layer 0:   Background (dark base)
Layer 1:   Particle canvas (main experience)
Layer 2:   Skeleton/mesh overlay canvas  
Layer 3:   Camera preview (elevated)
Layer 4:   UI controls (mode toggles, status)
Layer 5:   Keyboard shortcuts panel
Layer 6:   Modal overlays (if any)
Layer 100: Loading screen (during init only)
```

### Camera Preview Positioning

The 256×144 preview is positioned top-center, but should:
- Have 24px margin from viewport top
- Use `border-radius: 12px` with subtle border
- Cast a soft shadow: `0 8px 32px rgba(0,0,0,0.4)`
- Include a subtle inner glow: `inset 0 0 0 1px rgba(255,255,255,0.1)`

### Control Positioning

```
┌──────────────────────────────────────────────────┐
│  [Status]                      [Camera Preview]  │
│  [Mode Toggle]                                   │
│                                                  │
│                                                  │
│                   PARTICLES                      │
│                                                  │
│                                                  │
│                                                  │
│                              [Shortcuts Panel]   │
└──────────────────────────────────────────────────┘

Mode Toggle: top: 24px, left: 24px
Status: top: 24px, right: 24px (below camera preview)
Shortcuts: bottom: 24px, right: 24px
```

---

## V. Component Design Specifications

### Enable Camera Button (Intro Screen)

**Idle State**:
- Background: `rgba(255,255,255,0.05)`
- Border: `1px solid rgba(255,255,255,0.15)`
- Backdrop-filter: `blur(20px)`
- Padding: `16px 32px`
- Font: 14px, 500 weight, uppercase, 0.1em letter-spacing

**Hover State**:
- Background: `rgba(255,255,255,0.1)`
- Border: `1px solid rgba(255,255,255,0.3)`
- Transform: `translateY(-2px)`
- Box-shadow: `0 8px 32px rgba(var(--accent-rgb), 0.2)`

**Active State**:
- Transform: `translateY(0px)`
- Background: `rgba(255,255,255,0.15)`

### Mode Toggle Buttons

Use a **segmented control** pattern, not separate buttons:

```
┌─────────────┬─────────────┐
│   ATTRACT   │   REPEL     │
└─────────────┴─────────────┘
```

- Active segment: Solid accent color at 15% opacity, accent border
- Inactive segment: Transparent, subtle border
- Transition: 200ms ease-out

### Status Indicator

```
┌─────────────────────────────┐
│  ● Detecting faces & hands  │
└─────────────────────────────┘
```

- Dot color: Semantic (green = active, amber = loading, gray = idle)
- Dot animation: Subtle pulse (scale 1→1.2→1, 2s ease-in-out infinite)
- Container: Glass effect with backdrop-blur

### Keyboard Shortcuts Panel

```
┌────────────────────────────────┐
│  CONTROLS                      │
│                                │
│  ⎵ SPACE    Toggle Mode        │
│  V          Toggle Camera      │
│  1-5        Switch Theme       │
└────────────────────────────────┘
```

- Background: `rgba(0,0,0,0.6)` with `backdrop-filter: blur(20px)`
- Key badges: Monospace font, `rgba(255,255,255,0.1)` background, `border-radius: 4px`
- Initially hidden, fade in after 2s of inactivity (or always visible on desktop)

---

## VI. Hand Skeleton Visualization

### The Problem with "Just Lines"

Drawing lines between landmarks gives you a medical diagram. We want **sculptural form**.

### Bone Rendering Specifications

**Line Properties**:
- Stroke width: Taper from 3px (wrist) to 1px (fingertips)
- Stroke style: Round linecap and linejoin
- Color: Gradient along bone length

**Glow Layers** (render multiple times with different blur):
```javascript
// Layer 1: Core line
ctx.lineWidth = 2;
ctx.strokeStyle = accentColor;
ctx.stroke();

// Layer 2: Inner glow
ctx.lineWidth = 4;
ctx.strokeStyle = `rgba(${accentRGB}, 0.5)`;
ctx.filter = 'blur(2px)';
ctx.stroke();

// Layer 3: Outer glow
ctx.lineWidth = 8;
ctx.strokeStyle = `rgba(${accentRGB}, 0.2)`;
ctx.filter = 'blur(6px)';
ctx.stroke();
```

**Joint Points**:
- Fingertips: 6px radius, filled with glow
- Knuckles: 4px radius
- Wrist: 8px radius

**Hand Differentiation**:
- Left hand: Cyan spectrum (`#00F0FF`)
- Right hand: Magenta spectrum (`#FF00E5`)

---

## VII. Face Mesh Visualization

### 3D Depth Enhancement

The face mesh must feel **three-dimensional**, not flat. Achieve this through:

1. **Z-based opacity**: Closer landmarks = brighter
2. **Depth shading**: Apply virtual lighting from top-front
3. **Feature emphasis**: Stronger lines on contours, lighter on tessellation

### Feature-Specific Styling

```javascript
const FACE_REGIONS = {
  tessellation: { color: 'rgba(255,255,255,0.06)', width: 0.5 },
  faceOval:     { color: 'rgba(0,240,255,0.6)', width: 1.5 },
  lips:         { color: 'rgba(255,0,128,0.7)', width: 1.5 },
  leftEye:      { color: 'rgba(0,255,200,0.8)', width: 1.2 },
  rightEye:     { color: 'rgba(0,255,200,0.8)', width: 1.2 },
  leftIris:     { color: 'rgba(0,255,255,1)', width: 2 },
  rightIris:    { color: 'rgba(0,255,255,1)', width: 2 },
};
```

### Depth Multipliers by Landmark Region

```javascript
const DEPTH_MODIFIERS = {
  noseBridge: 1.4,      // Landmarks 1, 2, 4, 5, 6
  cheekbones: 1.2,      // Landmarks 234, 454, 93, 323
  eyeSockets: 0.8,      // Around eye regions
  foreheadCenter: 1.1,  // Landmark 10
  chinTip: 1.3,         // Landmark 152
};
```

---

## VIII. Particle Physics Refinements

### The Golden Ratio Distribution

For organic bone coverage, distribute particles using the Fibonacci spiral pattern along each bone segment:

```javascript
const PHI = 1.618033988749;
const particles_per_bone = length * density;

for (let i = 0; i < particles_per_bone; i++) {
  const t = i / particles_per_bone;
  const angle = i * PHI * Math.PI * 2;
  const radius = spread * Math.sqrt(t); // Sunflower pattern
  
  const offset = {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
}
```

### Particle Attributes

Each particle should have:
```javascript
{
  x, y,           // Current position
  vx, vy,         // Velocity
  targetX, targetY, // Attraction point
  size,           // 1-3px based on depth
  opacity,        // 0.3-1.0 based on velocity
  hue,            // For rainbow mode
  trail: []       // Last 5-8 positions for trail rendering
}
```

### Trail Rendering

Trails create the "liquid flow" effect:

```javascript
// Draw trail from oldest to newest
for (let i = 0; i < particle.trail.length; i++) {
  const age = i / particle.trail.length;
  const pos = particle.trail[i];
  
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, particle.size * age, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${color}, ${age * 0.3})`;
  ctx.fill();
}
```

---

## IX. Performance Budgets

### Target Metrics

| Metric | Budget | Critical |
|--------|--------|----------|
| FPS | 60fps stable | >45fps minimum |
| Time to Interactive | <2s | <3s |
| MediaPipe Init | <1.5s | <2.5s |
| Particle Update | <8ms/frame | <16ms/frame |
| Memory | <150MB | <250MB |

### Optimization Strategies

1. **Object pooling**: Pre-allocate all 15K particles at init
2. **Spatial hashing**: For efficient particle-to-landmark assignment
3. **RAF throttling**: Skip frames if behind schedule
4. **Canvas optimization**: Use `will-change: transform`, avoid `getImageData`

---

## X. Final Verdict

### Scores (Pre-Implementation)

| Category | Score | Notes |
|----------|-------|-------|
| Design | 7.2/10 | Strong concept, needs polish |
| Usability | 8.0/10 | Intuitive core interaction |
| Creativity | 9.0/10 | Genuinely innovative |
| Content | 6.5/10 | Light on context/story |
| **Overall** | **7.7/10** | Site of the Day potential |

### To Achieve "Site of the Year" Candidacy

1. **Intro narrative**: Brief, poetic copy explaining the experience
2. **Sound design**: Subtle ambient audio (optional, user-activated)
3. **Shareable moments**: Screenshot/record functionality
4. **Fallback experience**: Graceful degradation without camera
5. **Mobile adaptation**: Touch-based alternative on non-desktop

---

## Appendix: CSS Custom Properties Reference

```css
:root {
  /* Base */
  --color-bg-primary: #08080A;
  --color-bg-elevated: #111114;
  --color-bg-overlay: rgba(0, 0, 0, 0.6);
  
  /* Text */
  --color-text-primary: rgba(255, 255, 255, 0.92);
  --color-text-secondary: rgba(255, 255, 255, 0.55);
  --color-text-tertiary: rgba(255, 255, 255, 0.35);
  
  /* Accent (theme-dependent) */
  --color-accent: #00F0FF;
  --color-accent-rgb: 0, 240, 255;
  --color-accent-secondary: #FF00E5;
  
  /* Particles */
  --particle-glow-radius: 8px;
  --particle-trail-length: 8;
  
  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  
  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  
  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Shadows */
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 40px rgba(var(--color-accent-rgb), 0.2);
  
  /* Blur */
  --blur-glass: 20px;
}
```

---

*"Make it feel like the future arrived early. Not the dystopian future—the one where technology and humanity dance together."* — Nacho Ortiz, Active Theory

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Classification**: Internal Design Reference

