# 🏛️ CORPUS — Enter Page & Loading Screen Redesign

> **AWWWARDS Jury Vision**: A GSAP-first interactive experience celebrating the intersection of Art, Music, and Human Form — worthy of the Louvre.

---

## 🎭 THE CONCEPT: Art × Music × Human Form

### Historical Context

CORPUS exists at the intersection of three timeless human pursuits:

1. **Art** — From cave paintings to digital installations, humans have always visualized themselves
2. **Music** — From ancient drums to synthesizers, our bodies have always made sound
3. **Human Form** — The Vitruvian Man, da Vinci's perfect proportions, the body as canvas

### The Louvre Connection

The Louvre houses:
- **Leonardo da Vinci's Vitruvian Man** — The perfect human proportion
- **Ancient instruments** — Lyres, drums, flutes from civilizations past
- **Sculptures of dancers** — Bodies frozen in musical motion

CORPUS brings these together: **Your body becomes the instrument. Your movement becomes the art.**

---

## 🔥 BRUTAL CRITIQUE: Current Enter Page

### Jury Member #1 — Creative Director, Paris

*"This is a landing page. A static, boring, uninspired landing page. Where is the GSAP? Where is the interaction? Where is the magic that prepares you for what's coming?"*

| Element | Problem | Verdict |
|---------|---------|---------|
| Title "CORPUS" | Static text, fades in, then nothing | 💀 Amateur |
| Tagline "Behold the form." | Sits there. Does nothing. | 💀 Amateur |
| Description | Just text. No animation. No life. | 💀 Amateur |
| Button "Begin the Sitting" | A button. Just a button. | 💀 Amateur |
| Background particles | Nice, but disconnected from content | 🟡 Acceptable |

### Jury Member #2 — Interaction Designer, Tokyo

*"A GSAP-first experience means the animation IS the experience, not decoration. Every element should respond, transform, and surprise."*

**Current Flow:**
```
User arrives → See particles → Read text → Click button → Wait
```

**Expected Flow:**
```
User arrives → Particles respond to cursor → Title assembles itself → 
Tagline types character by character → Instruments appear around title →
Button pulses with invitation → Hover triggers sound preview → 
Click transforms entire screen → Journey begins
```

### Jury Member #3 — Motion Director, Berlin

*"I see GSAP imported. I see timelines created. But I don't see GSAP THINKING. This was designed as HTML first, then GSAP was sprinkled on top. It should be GSAP-first: the animation defines the structure."*

---

## ✨ THE VISION: GSAP-First Enter Experience

### Phase 1: Arrival (0-3 seconds)

**Background Canvas Awakens**
```
- Dark canvas with subtle grain texture
- Golden vignette pulses gently (breathing effect)
- Ethereal particles float lazily
- Particles respond to cursor with magnetic repulsion
```

**Sound Design Hint**
```
- Subtle ambient drone fades in
- Low frequency hum suggesting potential
- Audio visualizer bars appear at screen edges
```

### Phase 2: Title Assembly (3-6 seconds)

**The CORPUS Title**
```
Instead of fading in, the letters ASSEMBLE:

C - Draws itself from a musical note curve
O - Expands from a perfect circle (Vitruvian reference)
R - Constructs from geometric lines
P - Morphs from a treble clef
U - Rises from a sound wave
S - Slithers in like a serpentine instrument body

Each letter has micro-animations:
- Slight wobble on arrival
- Golden glow pulse
- Particle burst at completion
```

**Historical Instruments Orbit**
```
Small icons of historical instruments orbit the title:
- Ancient lyre (Greece)
- Medieval lute (Renaissance) 
- Baroque harpsichord
- Classical piano
- Modern synthesizer

Each instrument fades between as they orbit - 
showing the evolution of music
```

### Phase 3: Tagline & Context (6-9 seconds)

**"Behold the form."**
```
Types character by character (typewriter effect)
Each character triggers a soft musical note
The phrase curves around the title like da Vinci's notes
Golden ink spreads behind the text
```

**Historical Quote Rotation**
```
Subtle quotes fade in and out below:
- "Music is the movement of sound to reach the soul." — Plato
- "The body says what words cannot." — Martha Graham
- "Where words fail, music speaks." — Hans Christian Andersen
```

### Phase 4: The Invitation (9-12 seconds)

**The Portal Button**
```
Not a button — a PORTAL:
- Circle appears (like Vitruvian Man's circle)
- Golden ring draws itself (DrawSVG)
- Text "Enter the Canvas" types inside
- Pulse animation suggests heartbeat
- Particles are magnetically attracted to it
```

**Cursor Interaction**
```
On hover:
- Portal expands slightly
- Sound preview plays (current scale notes)
- Particles rush toward portal edge
- Golden light rays emanate
- Text changes: "Begin Your Sitting"
```

### Phase 5: The Transition (On Click)

**Portal Expansion**
```
- Portal ring expands to full screen
- Light burst flash (like camera flash)
- Particles accelerate into center
- Sound crescendo (all notes at once)
- White flash → fade to loading screen
```

---

## 🎬 THE VISION: Loading Screen

### Current Problems

- Loading bar is generic
- Eye animation is disconnected from content
- No sense of what's loading or why
- No musical connection

### New Loading Experience

**"Awakening the Instruments"**
```
The loading screen shows instruments "waking up":

0-25%: Ancient instruments appear
  - Drums materialize (percussion = body)
  - Progress: "Awakening rhythm..."

25-50%: String instruments appear
  - Lyre strings vibrate
  - Progress: "Tuning the strings..."

50-75%: Wind instruments appear
  - Flute breath animation
  - Progress: "Finding breath..."

75-100%: Modern synth appears
  - Waveform animations
  - Progress: "Connecting to you..."

100%: All instruments merge into human silhouette
  - The body IS the instrument
  - Flash → Main experience
```

**Audio During Loading**
```
Each phase has associated sounds:
- 0-25%: Deep drum hits
- 25-50%: String plucks
- 50-75%: Wind sounds
- 75-100%: Synth tones
- 100%: Full chord resolution
```

---

## 🎨 VISUAL LANGUAGE

### Color Palette

| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| Background | Deep Canvas | #1E1C1A | Main background |
| Primary Gold | Antique Gold | #D4AF37 | Titles, accents |
| Warm Glow | Rose Gold | #E8B4B8 | Highlights |
| Accent | Ivory | #F5F5DC | Text, particles |
| History | Parchment | #E8DCC4 | Historical quotes |

### Typography

```css
/* Title */
font-family: 'Playfair Display', serif;
font-size: clamp(48px, 10vw, 120px);
letter-spacing: 0.2em;
font-weight: 300;

/* Tagline */
font-family: 'Cormorant Garamond', serif;
font-size: clamp(18px, 3vw, 28px);
font-style: italic;

/* Historical quotes */
font-family: 'EB Garamond', serif;
font-size: 14px;
opacity: 0.7;
```

### Iconography

Historical instruments as line icons:
- Lyre (Greek)
- Lute (Renaissance)
- Harpsichord (Baroque)
- Piano (Classical)
- Synthesizer (Modern)

All drawn with consistent 1.5px gold stroke.

---

## 🎵 SOUND DESIGN

### Enter Page Sounds

| Action | Sound | Character |
|--------|-------|-----------|
| Page load | Low ambient drone | Sets mood |
| Each letter appears | Soft piano note | Musical connection |
| Quote change | Wind chime | Transition |
| Button hover | Scale preview (current) | Foreshadowing |
| Button click | Crescendo chord | Climax |
| Portal expansion | Whoosh + reverb tail | Transition |

### Loading Screen Sounds

| Phase | Sound | Duration |
|-------|-------|----------|
| 0-25% | Drum heartbeat | 2-3 sec |
| 25-50% | Harp arpeggios | 2-3 sec |
| 50-75% | Flute breath | 2-3 sec |
| 75-100% | Synth pads | 2-3 sec |
| Complete | Full orchestral hit | 1 sec |

---

## 📱 RESPONSIVE DESIGN

### Desktop (1200px+)
- Full orchestration of animations
- Instrument orbit active
- All sound effects enabled
- Maximum particle count

### Tablet (768-1199px)
- Simplified instrument display
- Reduced particle count
- Core animations preserved
- Sound still active

### Mobile (< 768px)
- Static instrument icons (no orbit)
- Minimal particles
- Touch-optimized portal
- Reduced sound (optional toggle)
- Portrait-optimized layout

---

## 🔧 TECHNICAL SPECIFICATIONS

### GSAP Plugins Required

```javascript
// Register plugins
gsap.registerPlugin(
  ScrollTrigger,  // For scroll-based reveals
  DrawSVGPlugin,  // For instrument line animations
  SplitText,      // For character-by-character text (or custom)
  MorphSVGPlugin, // For instrument morphing (optional)
  MotionPathPlugin // For instrument orbit
);
```

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~2s |
| Time to Interactive | < 3s | ~4s |
| Animation FPS | 60fps | 45-60fps |
| Memory Usage | < 100MB | ~80MB |
| Load time (3G) | < 5s | ~6s |

### Browser Support

- Chrome 90+ ✅
- Safari 14+ ✅
- Firefox 88+ ✅
- Edge 90+ ✅
- Safari iOS 14+ ✅
- Chrome Android 90+ ✅

---

## 🎭 THE NARRATIVE

### The Story We Tell

```
You stand before the Canvas — a portal between past and present.

For millennia, humans have made music with their bodies:
- Clapping hands became drums
- Vocal cords became strings
- Breath became wind instruments
- Heartbeat became rhythm

Now, you become the instrument.

Your body. Your movement. Your music.

Step through the portal. 
Begin your sitting.
Create your masterpiece.
```

### Quote Rotation (Historical)

1. "Music expresses that which cannot be said." — Victor Hugo
2. "The body is an instrument." — Martha Graham
3. "In the beginning was the rhythm." — Hans von Bülow
4. "To draw is to make music with lines." — Pablo Picasso
5. "Movement is the essence of life." — Bernice Johnson Reagon

---

## 📊 SUCCESS METRICS

### User Engagement

| Metric | Target |
|--------|--------|
| Time on enter page | > 15 seconds |
| Sound enabled rate | > 40% |
| Click-through rate | > 85% |
| Return visitors | > 30% |

### Technical

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Animation jank | < 5% |
| Error rate | < 0.1% |

---

## 🏆 AWWWARDS POTENTIAL

### What Makes This Award-Worthy

1. **GSAP-First Design** — Animation defines structure, not decoration
2. **Narrative Depth** — History of music connection adds meaning
3. **Sensory Integration** — Visual + Audio + Interaction unified
4. **Technical Excellence** — 60fps, responsive, accessible
5. **Emotional Journey** — From arrival to transformation
6. **Cultural Relevance** — Louvre-worthy artistic statement

### The AWWWARDS Criteria

- **Design** ★★★★★ — Unique, purposeful, beautiful
- **Usability** ★★★★☆ — Intuitive with discovery moments
- **Creativity** ★★★★★ — GSAP-first, music history integration
- **Content** ★★★★★ — Deep narrative, meaningful quotes
- **Mobile** ★★★★☆ — Graceful degradation, still impactful

---

*"This is not a website. This is a portal to artistic expression. Every frame is intentional. Every sound is meaningful. Every interaction is magic."*

— AWWWARDS Jury, 2026
