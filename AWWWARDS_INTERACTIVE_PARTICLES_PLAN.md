# AWWWARDS JURY DEEP DIVE: Interactive Particle System & MediaPipe Maximization

**Project:** CORPUS — Behold the Form  
**Audit Date:** January 2026  
**AWWWARDS Jury Panel Review**

---

## EXECUTIVE SUMMARY

The current CORPUS installation demonstrates competent body tracking visualization but leaves significant interactive potential untapped. The particle system (petals/sparks) currently floats passively without responding to the user's body movement. This represents a **massive missed opportunity** for creating an AWWWARDS-winning, Louvre-worthy experience.

Furthermore, our MediaPipe implementation is only utilizing approximately **60%** of the available detection capabilities. We're missing gesture recognition, face blendshapes (expressions), 3D world coordinates, and segmentation masking.

This document outlines a comprehensive plan to transform CORPUS into a truly **world-class interactive digital art installation**.

---

## PART 1: CURRENT STATE ANALYSIS

### 1.1 MediaPipe Features — CURRENTLY USED ✅

| Feature | Landmarks | Model | Status |
|---------|-----------|-------|--------|
| PoseLandmarker | 33 body points | Heavy (float16) | ✅ Active |
| FaceLandmarker | 468 face mesh points | Standard (float16) | ✅ Active |
| HandLandmarker | 21 points × 2 hands | Standard (float16) | ✅ Active |
| GPU Delegation | N/A | WebGL | ✅ Active |

**Total Active Landmarks: 33 + 468 + 42 = 543 tracking points**

### 1.2 MediaPipe Features — NOT USED ❌

| Feature | Capability | Why It Matters |
|---------|------------|----------------|
| **GestureRecognizer** | 7 built-in gestures | Native gesture detection without custom math |
| **Face Blendshapes** | 52 expression coefficients | React to smiles, brow raises, eye movements |
| **Facial Transform Matrices** | 3D head rotation | Parallax effects, depth-aware rendering |
| **Pose World Landmarks** | 3D coordinates (meters) | Real-world depth for particle physics |
| **Segmentation Mask** | Person/background separation | Particle confinement to body silhouette |

### 1.3 Particle System — CURRENT LIMITATIONS

The `PetalStream` class in `human-avatar.js` currently:

1. **Spawns petals from fist position** ✅
2. **Animates petals with physics (gravity, drag)** ✅
3. **Fades petals over time** ✅

**BUT:**

4. **No collision detection with body/hands** ❌
5. **No push/deflection from movement** ❌
6. **No attraction/repulsion behaviors** ❌
7. **No interaction zones** ❌

---

## PART 2: INTERACTIVE PARTICLE PHYSICS — THE VISION

### 2.1 Core Interaction: Body Pushes Particles

When the user moves their hand through existing petals, the petals should:
- **Deflect** away from the hand's velocity vector
- **Swirl** around the hand like disturbed leaves
- **Accelerate** based on movement speed
- **Maintain momentum** after the hand passes

### 2.2 Collision Detection Architecture

```
┌─────────────────────────────────────────────────┐
│                 FRAME UPDATE                     │
├─────────────────────────────────────────────────┤
│  1. Get all body landmark positions             │
│  2. Calculate landmark velocities (Δ position)  │
│  3. For each petal particle:                    │
│     a. Check distance to each landmark          │
│     b. If within interaction radius:            │
│        - Calculate deflection vector            │
│        - Apply force based on hand velocity     │
│        - Add turbulence for natural feel        │
│  4. Update particle physics as normal           │
└─────────────────────────────────────────────────┘
```

### 2.3 Interaction Zones

Different body parts should have different interaction behaviors:

| Zone | Landmarks | Radius | Behavior |
|------|-----------|--------|----------|
| **Palm Center** | Hand 0, 9 | Large (0.08) | Strong push, creates wake |
| **Fingertips** | Hand 4,8,12,16,20 | Small (0.03) | Precise deflection |
| **Face** | Nose (4) | Medium (0.06) | Gentle float away |
| **Shoulders** | Pose 11, 12 | Medium (0.05) | Smooth deflection |
| **Wrists** | Pose 15, 16 | Medium (0.04) | Quick deflection |

### 2.4 Force Calculation Formula

```javascript
// For each petal, for each landmark:
const dx = petal.x - landmark.x;
const dy = petal.y - landmark.y;
const distance = Math.hypot(dx, dy);

if (distance < interactionRadius) {
  // Normalized direction away from landmark
  const nx = dx / distance;
  const ny = dy / distance;
  
  // Force decreases with distance (inverse square)
  const forceMagnitude = (1 - distance / interactionRadius) ** 2;
  
  // Add landmark's velocity for momentum transfer
  const pushForce = forceMagnitude * landmarkSpeed * 0.5;
  
  // Apply force to petal velocity
  petal.vx += nx * pushForce + landmarkVelocity.x * 0.3;
  petal.vy += ny * pushForce + landmarkVelocity.y * 0.3;
  
  // Add turbulence for organic feel
  petal.vx += (Math.random() - 0.5) * forceMagnitude * 0.001;
  petal.vy += (Math.random() - 0.5) * forceMagnitude * 0.001;
}
```

---

## PART 3: MEDIAPIPE MAXIMIZATION

### 3.1 Add GestureRecognizer — Built-in Gestures

MediaPipe's GestureRecognizer provides these gestures **out of the box**:

| Gesture | Use Case in CORPUS |
|---------|-------------------|
| `Closed_Fist` | Spawn petals (current behavior, native) |
| `Open_Palm` | Create "wind" effect pushing all petals away |
| `Pointing_Up` | Attract petals toward finger (magnet mode) |
| `Victory` | Split petals into two streams |
| `Thumb_Up` | Pause/freeze all particles |
| `Thumb_Down` | Gravity flip (petals fall upward) |
| `ILoveYou` | Special effect (rainbow petals?) |

**Benefits:**
- More accurate than our custom `detectFist()` function
- Additional gestures for free
- Confidence scores for smoother transitions

### 3.2 Enable Face Blendshapes — Expression Reactions

The 52 blendshape coefficients include:

| Blendshape | Value Range | Particle Effect |
|------------|-------------|-----------------|
| `browInnerUp` | 0-1 | Petals rise with surprise |
| `mouthSmileLeft/Right` | 0-1 | Warm color shift, faster spawn |
| `eyeBlinkLeft/Right` | 0-1 | Brief particle freeze |
| `jawOpen` | 0-1 | Petals drawn toward mouth |
| `eyeLookUpLeft/Right` | 0-1 | Petals drift in gaze direction |

**Use Case:** When user smiles, particle colors shift warmer and spawn rate increases.

### 3.3 Use Pose World Landmarks — 3D Depth

World landmarks provide XYZ coordinates in **meters from the camera**. This enables:

1. **Depth-based particle sizing** — Particles closer to camera appear larger
2. **3D collision volumes** — Not just 2D circles, but spheres
3. **Parallax effects** — Background petals move differently than foreground

### 3.4 Enable Segmentation Mask — Body Silhouette

The segmentation mask provides a binary image of where the person is. This enables:

1. **Particle confinement** — Petals stay within body boundary
2. **Outline effects** — Particles follow body contour
3. **Inside/outside behaviors** — Different physics per zone

---

## PART 4: DETAILED IMPLEMENTATION TO-DO LIST

### Phase 1: Interactive Particle Physics (Priority: CRITICAL)

#### 1.1 Landmark Velocity Tracking
- [ ] Create `LandmarkVelocityTracker` class to store previous positions
- [ ] Calculate per-frame velocity for all 33 pose landmarks
- [ ] Calculate per-frame velocity for all 42 hand landmarks (21 × 2)
- [ ] Smooth velocities with exponential moving average
- [ ] Store velocity history (last 3 frames) for acceleration calculation

#### 1.2 Collision Detection System
- [ ] Define interaction radii for each landmark category
- [ ] Implement spatial hashing for O(n) collision checks (grid-based)
- [ ] Create `checkParticleCollisions()` function in `PetalStream`
- [ ] Handle multiple simultaneous collisions gracefully
- [ ] Add collision debug visualization mode (show interaction spheres)

#### 1.3 Force Application
- [ ] Implement deflection force (push away from landmark)
- [ ] Implement momentum transfer (landmark velocity → particle velocity)
- [ ] Add turbulence/noise for organic feel
- [ ] Implement force falloff (inverse square or linear)
- [ ] Cap maximum force to prevent particles flying off-screen

#### 1.4 Advanced Behaviors
- [ ] Implement "wake" effect behind fast-moving hands
- [ ] Add particle clustering when multiple are pushed together
- [ ] Create vortex/swirl effect around rotating hand movements
- [ ] Add subtle attraction when hand is stationary near particles

### Phase 2: GestureRecognizer Integration (Priority: HIGH)

#### 2.1 Setup
- [ ] Import `GestureRecognizer` from MediaPipe Tasks Vision
- [ ] Create recognizer instance with GPU delegation
- [ ] Configure for VIDEO running mode
- [ ] Add to `processFrame()` pipeline

#### 2.2 Gesture-Based Effects
- [ ] Map `Closed_Fist` to petal spawn (replace custom detection)
- [ ] Map `Open_Palm` to radial push effect
- [ ] Map `Pointing_Up` to particle attraction (magnet finger)
- [ ] Map `Victory` to particle split effect
- [ ] Map `Thumb_Up` to particle freeze
- [ ] Map `Thumb_Down` to gravity inversion
- [ ] Map `ILoveYou` to special celebration effect
- [ ] Add smooth transitions between gesture states
- [ ] Display current gesture in UI (status panel)

### Phase 3: Face Blendshapes — Emotional Response (Priority: MEDIUM)

#### 3.1 Enable Blendshapes
- [ ] Set `outputFaceBlendshapes: true` in FaceLandmarker options
- [ ] Parse blendshape array from results
- [ ] Create `ExpressionAnalyzer` class to interpret values

#### 3.2 Expression Effects
- [ ] Smile detection → warm color shift, spawn rate boost
- [ ] Surprise detection → particles rise upward
- [ ] Eye blink → brief particle freeze (like snapshot)
- [ ] Mouth open → particles attracted to mouth area
- [ ] Eyebrow raise → particle size increase
- [ ] Add smooth interpolation between expression states

### Phase 4: 3D World Landmarks (Priority: MEDIUM)

#### 4.1 Enable World Landmarks
- [ ] Parse `worldLandmarks` from PoseLandmarker results
- [ ] Create depth buffer from Z coordinates
- [ ] Normalize depth values to usable range

#### 4.2 Depth-Based Rendering
- [ ] Scale particles based on their Z position
- [ ] Implement depth sorting for proper occlusion
- [ ] Add parallax effect (background petals move slower)
- [ ] Create depth-based blur for far particles

### Phase 5: Segmentation Mask (Priority: LOW)

#### 5.1 Enable Segmentation
- [ ] Configure PoseLandmarker for `POSE_SEGMENTATION`
- [ ] Extract segmentation mask from results
- [ ] Convert to usable canvas data

#### 5.2 Mask-Based Behaviors
- [ ] Confine particles within body silhouette
- [ ] Create outline particle trail following body edge
- [ ] Implement "inside body" vs "outside body" physics
- [ ] Add silhouette glow effect

### Phase 6: Performance Optimization (Priority: HIGH)

#### 6.1 Spatial Optimization
- [ ] Implement quad-tree for particle collision detection
- [ ] Batch similar operations for GPU efficiency
- [ ] Use object pooling for particles (no garbage collection)
- [ ] Profile and optimize hot paths

#### 6.2 Visual Optimization
- [ ] Add level-of-detail (LOD) for distant particles
- [ ] Implement instanced rendering if particle count is high
- [ ] Use canvas `willReadFrequently` hint
- [ ] Consider WebGL for particle rendering if needed

### Phase 7: Polish & AWWWARDS Touches (Priority: HIGH)

#### 7.1 Micro-Interactions
- [ ] Add subtle screen shake when many particles collide
- [ ] Create ripple effect at collision points
- [ ] Add particle "pop" when they collide with each other
- [ ] Implement particle merging when they touch

#### 7.2 Audio Reactive (Optional)
- [ ] Add Web Audio API integration
- [ ] Create ambient sound that responds to particle activity
- [ ] Add subtle "whoosh" on hand swipe
- [ ] Create chime sounds on gesture recognition

#### 7.3 Final Polish
- [ ] Add intro animation for first particle appearance
- [ ] Create smooth transition when switching gesture modes
- [ ] Implement "attract all particles back" reset animation
- [ ] Add Easter egg interactions

---

## PART 5: TECHNICAL SPECIFICATIONS

### 5.1 New Classes Required

```javascript
class LandmarkVelocityTracker {
  constructor(historyLength = 3);
  update(landmarks, timestamp);
  getVelocity(landmarkIndex);
  getSpeed(landmarkIndex);
}

class InteractiveParticleSystem extends PetalStream {
  constructor();
  setLandmarkData(pose, hands, face);
  setVelocityTracker(tracker);
  checkCollisions();
  applyForces();
}

class GestureHandler {
  constructor();
  setGestureResult(result);
  getCurrentGesture();
  getGestureConfidence();
  isGestureActive(gestureName);
}

class ExpressionAnalyzer {
  constructor();
  setBlendshapes(blendshapes);
  getSmileIntensity();
  getSurpriseIntensity();
  getDominantExpression();
}
```

### 5.2 Updated MediaPipeTracker Configuration

```javascript
// Add GestureRecognizer
this.gestureRecognizer = await GestureRecognizer.createFromOptions(filesetResolver, {
  baseOptions: {
    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
    delegate: 'GPU'
  },
  runningMode: 'VIDEO',
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// Enable blendshapes
this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
  baseOptions: { ... },
  outputFaceBlendshapes: true, // <-- Enable
  outputFacialTransformationMatrixes: true // <-- Enable
});
```

### 5.3 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Frame Rate | 60 FPS | 60 FPS ✅ |
| Particle Count | 200+ | ~50 |
| Collision Checks/Frame | <10ms | N/A |
| Gesture Latency | <50ms | N/A |
| Expression Latency | <100ms | N/A |

---

## PART 6: AWWWARDS JUDGING CRITERIA ALIGNMENT

### 6.1 Design (40%)
- ✅ Baroque-inspired pastel color palette
- ✅ Swiss typography clarity
- ⬆️ **Interactive particles add dynamic visual interest**
- ⬆️ **Expression-reactive colors create emotional connection**

### 6.2 Creativity (30%)
- ✅ Digital portrait concept is novel
- ⬆️ **Body-interactive particles are cutting-edge**
- ⬆️ **Gesture-triggered effects add playful discovery**
- ⬆️ **Expression detection creates personal connection**

### 6.3 Usability (20%)
- ✅ Simple "close fist" interaction
- ⬆️ **Multiple gesture modes add depth**
- ⬆️ **Intuitive physics (push particles) is natural**

### 6.4 Content (10%)
- ✅ Clear "digital portrait" concept
- ⬆️ **Interactive particles tell a story of connection**

---

## CONCLUSION

Implementing interactive particle physics and maximizing MediaPipe capabilities will elevate CORPUS from a competent tracking visualization to a **world-class interactive art installation**. The ability to physically interact with digital particles using one's own body creates a profound sense of connection between the physical and digital realms—exactly the kind of experience that wins AWWWARDS and deserves a place in the Louvre.

**Estimated Implementation Time:** 3-5 development days

**Priority Order:**
1. Interactive particle physics (body pushes petals) — **THE USER'S PRIMARY REQUEST**
2. GestureRecognizer integration (native gesture detection)
3. Performance optimization (ensure 60fps with interactions)
4. Face blendshapes (expression reactions)
5. 3D depth effects
6. Segmentation mask features

---

*"Art is not what you see, but what you make others see." — Edgar Degas*

*With interactive particles, CORPUS will make visitors see themselves as part of the art itself.*

