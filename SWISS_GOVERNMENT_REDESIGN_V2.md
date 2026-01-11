# DIGITALES ICH — Swiss Federal Government Contract Redesign
## CHF 175,000 B2B Expo Installation — Complete Technical & Design Specification

---

# AWWWARDS JURY EXPERT ANALYSIS & REBUILD INSTRUCTIONS

## Panel Assessment: Current State

**VERDICT: COMPLETE REBUILD REQUIRED**

The current implementation shows basic technical competence but fails catastrophically to meet Swiss Federal Government visual standards. This is a **CHF 175,000 government contract** for a **B2B Expo booth** representing Switzerland's digital innovation. It cannot look like a GitHub side project.

---

## 🇨🇭 OFFICIAL SWISS CONFEDERATION BRAND IDENTITY

### Source: Swiss Federal Administration Corporate Design Manual (CD Bund)

The Swiss government has strict corporate design guidelines. We MUST use them.

### Official Colors (Bundesfarben)

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Rot (Swiss Red)** | `#DC0018` | 220, 0, 24 | Primary accent, Swiss cross |
| **Weiss (White)** | `#FFFFFF` | 255, 255, 255 | Primary background |
| **Schwarz (Black)** | `#000000` | 0, 0, 0 | Primary text |
| **Grau Hell (Light Gray)** | `#F0F0F0` | 240, 240, 240 | Surfaces |
| **Grau Mittel (Medium Gray)** | `#C0C0C0` | 192, 192, 192 | Borders |
| **Grau Dunkel (Dark Gray)** | `#505050` | 80, 80, 80 | Secondary text |
| **Blau (Federal Blue)** | `#2F5496` | 47, 84, 150 | Links, digital elements |

### Typography

**Primary Font:** Frutiger (official Swiss government font)
**Web Fallback:** Arial, Helvetica Neue, sans-serif

**DO NOT USE:** Space Grotesk, Inter, any trendy tech fonts

### Swiss Cross Specifications

- Proportions: Arms are 1/6 wider than they are long
- Always white on red OR red alone
- Never modified, stretched, or stylized
- Official mark protected by law

---

## THE VISION: IRON MAN-STYLE DIGITAL TWIN

### Concept: "SCHWEIZER DIGITAL-IDENTITÄT"

Imagine walking up to the Swiss booth at Davos, CeBIT, or Swiss Digital Day. You stand in front of a large screen. Within seconds, thousands of glowing particles rush toward you, scanning your form, and construct a **3D holographic representation of you** — your digital twin.

This isn't just face tracking. This is **volumetric presence**.

### The Experience Flow

#### PHASE 1: EINLADUNG (Invitation) — 0-5 seconds

**Visual:**
- Clean white background with subtle Swiss cross pattern (extremely subtle, 3% opacity)
- Particles slowly drift upward like Swiss mountain mist
- Official Swiss Confederation logo in top-left corner
- Text centered: "Treten Sie näher" (Step closer)

**Particle Behavior:**
- 500 white/light gray particles
- Gentle upward drift
- Very subtle, almost invisible
- Suggests "something is waiting"

**UI Elements:**
- Bundeslogo (Swiss Confederation logo) top-left
- Single line: "Eidgenössisches Departement für Digitalisierung"
- No buttons yet — pure atmosphere

---

#### PHASE 2: ERKENNUNG (Detection) — 5-15 seconds

**Trigger:** Camera detects a person standing in frame

**Visual:**
- Background remains white
- A clean scanning grid appears (not sci-fi — Swiss precision)
- Red accent lines trace the detected silhouette
- Status text: "Digitale Erfassung aktiv..."

**Particle Behavior:**
- Particles begin to coalesce from the edges
- Move toward the detected figure
- Start as scattered, become organized
- Color shifts from white to light blue to indicate "active processing"

**UI Elements:**
- Progress indicator appears (red Swiss line)
- Statistics appear:
  - "Gesichtspunkte: 468" (as they're detected)
  - "Handlandmarken: 42"
  - "Tiefenkartierung: Aktiv"

---

#### PHASE 3: KONSTRUKTION (Construction) — 15-30 seconds

**THE HERO MOMENT**

**Visual:**
- Particles RUSH toward the user's detected body shape
- They form a **3D point cloud representation** of the person
- The figure is clearly recognizable as a human form
- Particles are denser at face, hands — key interaction points
- Background dims slightly (95% white → 90% white) to increase contrast

**Particle Behavior:**
- 10,000-15,000 particles
- Strong attraction to all 478 face landmarks + 42 hand landmarks
- Depth mapping: Particles closer to camera are LARGER and BRIGHTER
- Particles further away are smaller and dimmer
- Creates TRUE 3D volumetric effect on 2D screen

**The "Iron Man" Effect:**
- Particles form wireframe-style connections along face mesh
- Triangulated mesh becomes visible between particles
- Red accent particles highlight key features: eyes, mouth, fingertips
- The user sees themselves "rendered" in real-time

**UI Elements:**
- "Digitaler Zwilling wird erstellt..." (Digital twin being created...)
- Progress percentage
- When complete: "BEREIT" with subtle fanfare

---

#### PHASE 4: INTERAKTION (Interaction) — Ongoing

**Visual:**
- The particle figure mirrors the user's movements in real-time
- Raise your hand → the particle hand raises
- Turn your head → the particle head turns
- Particles have subtle physics (inertia, trailing)

**Modes:**

**MODUS 1: SPIEGEL (Mirror)**
- Default mode
- 1:1 particle representation of user
- Perfect synchronization

**MODUS 2: AUFLÖSUNG (Dissolution)**
- On gesture (wave goodbye): particles scatter
- Beautiful dispersal effect
- Reforms when user returns to neutral

**MODUS 3: EXPLORATION**
- User can "push" particles with their hand
- Repulsion mode activated by specific gesture
- Particles avoid the hand, creating negative space

**UI Elements:**
- Minimal UI during interaction
- Small mode indicators in corner
- Swiss Confederation mark always visible
- Optional: QR code for "learn more" link

---

#### PHASE 5: ABSCHLUSS (Conclusion)

**Trigger:** User steps away OR times out

**Visual:**
- Particles gently disperse upward (like the person "ascending" to the cloud)
- Dissolve effect takes 3-5 seconds
- Returns to Phase 1

**Message:**
- "Vielen Dank für Ihre Teilnahme"
- "Ihre Daten wurden nicht gespeichert — garantiert."
- Swiss Confederation privacy badge

---

## TECHNICAL ARCHITECTURE

### Rendering Engine

**Current:** Canvas2D (too slow for 15k particles + 3D effect)
**Required:** WebGL 2.0 with custom shaders

**Shader Strategy:**
1. Vertex shader: Position particles based on tracking data
2. Fragment shader: Size/color based on depth
3. Geometry shader: Optional mesh lines between particles

### Particle System Specifications

```
PARTICLE_COUNT: 15,000 (GPU-rendered)
PARTICLE_SIZE_MIN: 1px (far)
PARTICLE_SIZE_MAX: 8px (near)
PARTICLE_COLOR_BASE: #2F5496 (Federal Blue)
PARTICLE_COLOR_ACCENT: #DC0018 (Swiss Red)
PARTICLE_COLOR_NEUTRAL: #FFFFFF (White)
MESH_LINE_COLOR: rgba(220, 0, 24, 0.3) (Red, 30% opacity)
MESH_LINE_WIDTH: 0.5px
```

### 3D Depth Mapping

MediaPipe provides Z-coordinates for face landmarks. We use these to:

1. Scale particle size: `size = baseSize * (1 + z * depthFactor)`
2. Adjust particle brightness: `alpha = baseAlpha * (1 - z * 0.5)`
3. Apply subtle parallax: Particles shift slightly based on face rotation

### Hand Particle Distribution

Golden ratio spiral distribution along each bone segment:
- Fingertips: High density (small spread)
- Finger segments: Medium density
- Palm: Lower density (wider spread)

### Face Particle Distribution

- Every landmark gets a particle
- Additional particles interpolated between landmarks
- Higher density around eyes, mouth, nose (feature regions)
- Mesh triangulation visible as faint lines connecting nearby particles

---

## UI/UX SPECIFICATIONS

### Layout (1920x1080 Output, 4K Source)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [🇨🇭 BUNDESLOGO]          DIGITALE SCHWEIZ 2026              [STATUS] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                                                                          │
│                        ┌────────────────────────┐                        │
│                        │                        │                        │
│                        │    PARTICLE CANVAS     │                        │
│                        │    (FULLSCREEN)        │                        │
│                        │                        │                        │
│                        │                        │                        │
│                        └────────────────────────┘                        │
│                                                                          │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  [MODUS: SPIEGEL]                              [QR: Mehr erfahren →]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Header Bar (64px height)

- Background: White (#FFFFFF)
- Left: Swiss Confederation logo (Bundeslogo)
- Center: "DIGITALE SCHWEIZ 2026" in Frutiger/Arial
- Right: Status indicator (connection, camera, processing)
- Bottom border: 1px #C0C0C0

### Main Canvas (Full remaining space)

- Background: #F5F5F5 (very light warm gray)
- Particle field fills entire area
- No overlays except during specific phases

### Footer Bar (48px height)

- Background: White (#FFFFFF)
- Left: Current mode indicator
- Right: QR code link + "Mehr erfahren"
- Top border: 1px #C0C0C0

### Camera Preview

**Location:** Small overlay in bottom-left corner (optional)
**Size:** 256x144px
**Border:** 2px #DC0018 (Swiss Red)
**Label:** "LIVE ANSICHT"

**OR:** No visible camera preview (cleaner, more magical)

---

## ANIMATION SPECIFICATIONS

### Entrance Animations

**Logo Fade-In:**
- Duration: 400ms
- Easing: ease-out
- Opacity: 0 → 1

**Text Slide-Up:**
- Duration: 600ms
- Delay: 200ms
- Transform: translateY(20px) → translateY(0)
- Opacity: 0 → 1

**Particle Field Fade-In:**
- Duration: 1200ms
- Easing: ease-in-out
- Particles spawn progressively from center outward

### Particle Animations

**Idle Drift:**
- Perlin noise-based movement
- Speed: 0.2-0.5 px/frame
- Direction: Gentle upward bias

**Attraction:**
- Force: Inverse square law
- Max velocity: 15 px/frame
- Damping: 0.92

**Formation:**
- Duration: 2-4 seconds for full formation
- Ease-in-out curve
- Particles arrive in waves (face first, then hands, then body)

### Transition Animations

**Phase Transition:**
- Crossfade duration: 800ms
- Particle behavior change: 400ms ease

**Mode Switch:**
- Instantaneous particle behavior change
- UI indicator: 200ms ease

---

## COPY (SWISS GERMAN)

### Phase 1
- Main: "Treten Sie näher"
- Sub: "Erleben Sie Ihre digitale Identität"

### Phase 2
- Main: "Digitale Erfassung..."
- Progress: "Gesichtspunkte erkannt: [N]"
- Progress: "Handbewegungen erfasst: [N]"

### Phase 3
- Main: "Ihr digitaler Zwilling wird erstellt"
- Complete: "BEREIT"

### Phase 4
- Hint: "Bewegen Sie sich — Ihr Zwilling folgt"
- Mode: "Aktiver Modus: Spiegel"

### Phase 5
- Main: "Vielen Dank"
- Sub: "Keine Daten wurden gespeichert"
- Legal: "Eine Initiative des Bundes"

---

## IMPLEMENTATION CHECKLIST (AGENTIC INSTRUCTIONS)

### Phase A: Foundation Rebuild

1. **Replace Canvas2D with WebGL 2.0**
   - Set up Three.js or raw WebGL context
   - Create particle buffer geometry (InstancedBufferGeometry)
   - Write vertex shader for position/size based on tracking
   - Write fragment shader for color/opacity based on depth

2. **Implement Swiss Government Design System**
   - Replace ALL colors with official Bundesfarben
   - Switch to light/white theme
   - Add Bundeslogo SVG
   - Implement proper header/footer layout

3. **Restructure Particle Physics**
   - Implement proper 3D depth scaling
   - Add mesh line rendering between particles
   - Create formation animation system

### Phase B: Experience Flow

4. **Build Phase State Machine**
   - Define states: INVITATION, DETECTION, CONSTRUCTION, INTERACTION, CONCLUSION
   - Implement state transitions
   - Add phase-specific particle behaviors

5. **Enhance Tracking Integration**
   - Map all 478 face landmarks to particles
   - Map all 42 hand landmarks to particles
   - Implement depth-based sizing/coloring

6. **Create UI Overlays**
   - Swiss header bar component
   - Status indicators
   - Progress displays
   - Mode selector

### Phase C: Polish

7. **Animation Polish**
   - Easing curves for all transitions
   - Particle formation choreography
   - UI micro-interactions

8. **Performance Optimization**
   - WebGL instancing
   - Spatial partitioning
   - Frame budget management

9. **Accessibility & i18n**
   - Screen reader announcements (German)
   - Reduced motion mode
   - Error states with German copy

### Phase D: Expo Ready

10. **Production Hardening**
    - Auto-restart on crash
    - Memory leak prevention
    - 24/7 operation stability
    - Remote monitoring/diagnostics

---

## FILE STRUCTURE

```
/particle-mediapipeline/
├── index.html
├── styles/
│   ├── main.css                 # Base styles + Swiss design system
│   ├── components/
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── status.css
│   └── phases/
│       ├── invitation.css
│       ├── detection.css
│       ├── construction.css
│       └── interaction.css
├── js/
│   ├── app.js                   # Main orchestrator
│   ├── state-machine.js         # Phase state management
│   ├── webgl/
│   │   ├── renderer.js          # WebGL setup
│   │   ├── particle-system.js   # GPU particle system
│   │   ├── shaders/
│   │   │   ├── particle.vert
│   │   │   ├── particle.frag
│   │   │   ├── mesh-line.vert
│   │   │   └── mesh-line.frag
│   │   └── geometry.js          # Buffer geometry
│   ├── tracking/
│   │   ├── mediapipe-tracker.js
│   │   ├── depth-mapper.js
│   │   └── gesture-detector.js
│   ├── ui/
│   │   ├── header.js
│   │   ├── footer.js
│   │   ├── status.js
│   │   └── progress.js
│   └── utils/
│       ├── swiss-design.js      # Design system constants
│       ├── perlin.js
│       └── math.js
├── assets/
│   ├── bundeslogo.svg
│   ├── swiss-cross.svg
│   └── fonts/
│       └── (Frutiger if licensed, else system fonts)
└── SWISS_GOVERNMENT_REDESIGN_V2.md
```

---

## QUALITY GATES

Before deployment, verify:

1. **Performance:** 60fps on target hardware
2. **Visual Fidelity:** Matches Swiss government brand exactly
3. **Stability:** 8+ hours continuous operation without crash
4. **User Experience:** <5 second time to first interaction
5. **Accessibility:** German screen reader compatible
6. **Privacy:** No data storage, camera local-only

---

## SIGN-OFF

This document provides complete specifications for rebuilding the Swiss Federal Digital Identity installation. The experience should evoke wonder while maintaining the gravitas and trustworthiness of the Swiss Confederation.

**Target completion:** 2 weeks for full implementation
**Budget:** Fits within CHF 175,000 contract
**Audience:** B2B expo attendees, government officials, tech journalists

---

*Prepared by AWWWARDS Jury Expert Panel*
*Swiss Federal Design System Compliance: Required*
*Version: 2.0 | January 2026*

