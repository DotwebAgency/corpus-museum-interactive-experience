# AWWWARDS JURY × LOUVRE MASTERS — Artistic Vision Document

**Project:** Digital Twin Experience  
**Artistic Direction:** Baroque Renaissance Masters  
**Date:** January 2026  
**Jury Panel:** Creative Direction + Art History + Motion Design

---

## 🎨 THE VISION: Art as Technology

We are not building software. We are creating **a living painting**.

Imagine Caravaggio, Rembrandt, and Vermeer collaborating on an interactive installation for the Louvre. The chiaroscuro. The dramatic lighting. The gold leaf. The depth. The humanity.

This is AXIOM.

---

## 🖼️ BAROQUE AESTHETICS DECODED

### What Made Baroque Masters Legendary

| Master | Signature | How We Translate |
|--------|-----------|------------------|
| **Caravaggio** | Extreme chiaroscuro, darkness pierced by divine light | Deep black canvas, skeleton emerges from shadow |
| **Rembrandt** | Golden warmth, intimate lighting, psychological depth | Warm amber/gold palette, soft glows |
| **Vermeer** | Luminous surfaces, pearl-like quality, quiet drama | Subtle iridescence on joints, pearl-white highlights |
| **Velázquez** | Royal dignity, silvery tones, spatial depth | Silver accents, regal presence |

### The Color Palette: "Old Masters"

```
PRIMARY PALETTE
═══════════════════════════════════════════════════

--umber-deep:     #1A1410    Background (Caravaggio darkness)
--umber-warm:     #2D2117    Secondary bg
--gold-antique:   #C9A227    Primary accent (Rembrandt gold)
--gold-light:     #E8D48B    Highlights
--gold-glow:      rgba(201, 162, 39, 0.4)
--pearl:          #F5F0E6    Vermeer luminosity
--bone:           #E8DDD4    Skeleton color
--blood:          #8B2500    Accent (Caravaggio drama)
--silver:         #B8B8B0    Velázquez nobility
```

### Why This Works

- **Timeless** — Baroque never goes out of style
- **Distinctive** — NO ONE is doing this in tech
- **Premium** — Instantly conveys museum-quality
- **Emotional** — Warm colors create connection
- **Sophisticated** — Appeals to high-net-worth audience

---

## 🏛️ THE BRAND: CORPUS

**Name:** CORPUS (Latin for "body")

**Why CORPUS:**
- Latin = classical, timeless, intellectual
- Direct meaning = body (what we're visualizing)
- Medical/anatomical connotation (da Vinci's studies)
- Sounds like "corpse" subliminally = memento mori
- Used in "habeas corpus" = legal gravitas

**Tagline:** "Behold the form."

**Logo Concept:**
```
    ╭───────────────╮
    │               │
    │   ┌─────┐     │
    │   │     │     │     Vitruvian man silhouette
    │   │  ◯  │     │     inside ornate frame
    │   │ /│\ │     │
    │   │ / \ │     │
    │   └─────┘     │
    │               │
    ╰───────────────╯
    
    C O R P U S
    ━━━━━━━━━━━━━
```

---

## 💪 FIST GESTURE: "DIVINE SPARK"

### The Problem
Current pulse effect isn't triggering. But more importantly, "pulse" is too clinical.

### The Baroque Solution: **Divine Spark**

Reference: **The Creation of Adam** by Michelangelo (Sistine Chapel)

When you make a fist, you channel the divine spark — energy radiates from your hand like God touching Adam.

### Visual Effect Specification

```
THE DIVINE SPARK
═══════════════════════════════════════════════════

Frame 0:    Fist detected
            → Hand joints begin to glow golden
            
Frame 1-15: "Gathering" phase
            → Gold light concentrates at knuckles
            → Subtle particle motes orbit the fist
            → Low hum of energy building
            
Frame 16-30: "Release" phase
            → Golden rays emanate outward
            → Like sunbeams through clouds
            → Each finger joint releases a trail
            
Frame 31-60: "Illumination" phase
            → Light travels through skeleton
            → Each joint "ignites" briefly
            → Creates wave of warmth/light
            → Chiaroscuro effect intensifies
            
Frame 61+:  Return to rest
            → Gradual fade back to normal
            → Skeleton retains subtle golden glow
```

### Implementation Keys

1. **Detection Fix**: The fist detection needs to check finger curl more reliably
2. **Golden rays**: Use gradient lines emanating from fist center
3. **Joint ignition**: Each joint gets a brief "halo" as wave passes
4. **Chiaroscuro intensification**: Background dims during effect

---

## 🎭 UI DESIGN: Museum Gallery Experience

### The Frame Concept

Every great painting needs a frame. The UI should feel like an ornate gallery frame around the canvas.

```
┌─────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← Ornate border pattern
│░                                                 ░│
│░   ┌─────────────────────────────────────────┐   ░│
│░   │                                         │   ░│
│░   │                                         │   ░│
│░   │                                         │   ░│
│░   │           [ SKELETON CANVAS ]           │   ░│
│░   │                                         │   ░│
│░   │                                         │   ░│
│░   │                                         │   ░│
│░   └─────────────────────────────────────────┘   ░│
│░                                                 ░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────────────┘
```

### Typography: Classical Elegance

```css
--font-display: 'Cormorant Garamond', serif;  /* Headlines - baroque elegance */
--font-body: 'EB Garamond', serif;            /* Body - classical readability */
--font-mono: 'IBM Plex Mono', monospace;      /* Data - modern contrast */
```

### UI Elements

**Header:**
- Minimal, gallery-like
- "CORPUS" in elegant serif, small caps
- Golden accent line beneath

**Status Panel:**
- Dark, like a museum plaque
- Gold text on umber background
- Subtle gold border/frame
- Roman numeral styling for numbers

**Mode Indicator:**
- Latin terminology:
  - QUIESCO (resting/scanning)
  - CORPUS PLENUM (full body)
  - CORPUS SUPERIUS (upper body)
  - FACIES (face only)

---

## ✨ THE EXPERIENCE FLOW

### Act I: The Unveiling (Intro Screen)

- Deep black background
- Golden particles slowly drift
- "CORPUS" fades in with gentle glow
- Subtitle: "Behold the form."
- Call to action appears like candlelight flickering on

### Act II: The Awakening (Detection)

- Canvas remains dark
- When body detected, skeleton "emerges from shadow"
- Bones draw in one by one, as if being painted
- Golden glow grows from center outward
- Latin text updates: "CORPUS DETECTUM"

### Act III: The Living Art (Active)

- Full chiaroscuro effect
- Skeleton is the "subject" of the painting
- Dramatic lighting from above
- Subtle dust motes float in the air
- Breathing animation creates sense of life

### Act IV: Divine Spark (Fist Gesture)

- Energy gathers
- Golden rays emanate
- Moment of transcendence
- Returns to gentle glow

---

## 🔧 TECHNICAL IMPLEMENTATION

### Fist Detection Fix

```javascript
detectFist(hand) {
  if (!hand || hand.length < 21) return false;
  
  // Check all four fingers (not thumb)
  const tips = [8, 12, 16, 20];   // Fingertips
  const pips = [6, 10, 14, 18];   // Middle joints
  const mcps = [5, 9, 13, 17];    // Base joints
  
  let curledCount = 0;
  
  for (let i = 0; i < 4; i++) {
    const tip = hand[tips[i]];
    const pip = hand[pips[i]];
    const mcp = hand[mcps[i]];
    
    // Finger is curled if tip is below PIP OR closer to wrist than MCP
    const tipY = tip.y;
    const pipY = pip.y;
    const mcpY = mcp.y;
    
    // More lenient detection
    if (tipY > pipY - 0.02 || tipY > mcpY) {
      curledCount++;
    }
  }
  
  // Need at least 3 fingers curled
  return curledCount >= 3;
}
```

### Golden Ray Effect

```javascript
drawDivineSpark(ctx, x, y, intensity, w, h) {
  const rayCount = 12;
  const maxLength = Math.min(w, h) * 0.4 * intensity;
  
  for (let i = 0; i < rayCount; i++) {
    const angle = (Math.PI * 2 / rayCount) * i + this.time * 0.5;
    const length = maxLength * (0.7 + Math.random() * 0.3);
    
    const gradient = ctx.createLinearGradient(
      x, y,
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length
    );
    gradient.addColorStop(0, 'rgba(201, 162, 39, 0.8)');
    gradient.addColorStop(0.5, 'rgba(232, 212, 139, 0.4)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3 + Math.random() * 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length
    );
    ctx.stroke();
  }
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Color & Brand Overhaul
- [ ] Replace all violet with baroque gold/umber palette
- [ ] Update brand from AXIOM to CORPUS
- [ ] Create new logo with Vitruvian reference
- [ ] Update all text to Latin terminology
- [ ] Add Cormorant Garamond and EB Garamond fonts

### Phase 2: Skeleton Aesthetic
- [ ] Change skeleton color to bone/pearl
- [ ] Add golden glow to joints
- [ ] Implement chiaroscuro lighting effect
- [ ] Add "emerge from shadow" animation
- [ ] Create breathing/life-like movement

### Phase 3: Divine Spark Effect
- [ ] Fix fist detection algorithm
- [ ] Implement golden ray emanation
- [ ] Add joint ignition wave
- [ ] Create gathering/release phases
- [ ] Add subtle particle motes

### Phase 4: UI Baroque Styling
- [ ] Redesign header with serif typography
- [ ] Create museum plaque style status panel
- [ ] Add ornate frame border elements
- [ ] Implement Latin status terminology
- [ ] Add floating dust mote particles

### Phase 5: Experience Polish
- [ ] Animate bone draw-in on first detection
- [ ] Add ambient particle system
- [ ] Fine-tune all timings and easing
- [ ] Test dark/light theme (both dark, but subtle variation)
- [ ] Performance optimization
- [ ] Final Louvre-worthy QA

---

## 🏆 SUCCESS CRITERIA

For this to belong in the Louvre of digital experiences:

| Criterion | Target |
|-----------|--------|
| First Impression | "This is ART, not software" |
| Color Palette | Unmistakably baroque/renaissance |
| Typography | Classical elegance |
| Motion | Organic, breathing, alive |
| Interaction | Divine, meaningful, transcendent |
| Overall | "I've never seen anything like this" |

---

*"I have been impressed with the urgency of doing. Knowing is not enough; we must apply. Being willing is not enough; we must do."*

— Leonardo da Vinci

---

*— AWWWARDS Jury × Louvre Masters*

