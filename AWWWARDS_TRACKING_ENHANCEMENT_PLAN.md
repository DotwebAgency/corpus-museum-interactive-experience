# AWWWARDS + LOUVRE: TRACKING ENHANCEMENT PLAN

**Project Name:** CORPUS — Behold the Form
**Date:** January 2026
**Focus:** Hand Tracking Stability, Face Rendering Quality, Wrist Alignment

---

## EXECUTIVE SUMMARY

This document addresses critical issues identified during user testing:
1. **Hand Overlap Spasming** — Hands jitter and swap identity when overlapping
2. **Wrist Disconnection** — Wrist rendering appears disconnected from forearm
3. **Face Rendering Quality** — Pupils, eyebrows, and nose need refinement
4. **Loading Transition** — Current awakening screen transition is broken

---

## 1. HAND TRACKING STABILITY

### 1.1. Root Cause Analysis

**Problem**: When hands overlap or cross, MediaPipe can:
- Lose tracking of one or both hands
- Swap left/right hand identities
- Produce erratic landmark positions
- Drop frames causing visual jumps

**MediaPipe Limitations**:
- `minTrackingConfidence` defaults to 0.5 — may not catch low-quality frames
- No built-in occlusion handling
- Handedness classification can flip during overlap
- Z-depth ambiguity when hands are at similar depths

### 1.2. Solution Strategy

**A. Enhanced Smoothing (One Euro Filter)**
```javascript
// Implement adaptive smoothing that increases during occlusion
class OneEuroFilter {
  constructor(minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.lastValue = null;
    this.lastDerivative = 0;
    this.lastTime = 0;
  }
  
  filter(value, timestamp) {
    // Adaptive cutoff based on derivative (movement speed)
    // Faster movement = less smoothing, slow movement = more smoothing
  }
}
```

**B. Handedness Consistency Check**
- Track historical handedness over 5-10 frames
- Only accept handedness change if consistent for multiple frames
- Use wrist position relative to body center as fallback

**C. Occlusion Detection**
- Detect when both hand wrists are within 15% of each other
- When occluded: increase smoothing, reduce confidence threshold
- Interpolate through occlusion period using last known trajectory

**D. MediaPipe Configuration Tuning**
```javascript
// Current
minHandDetectionConfidence: 0.5
minHandPresenceConfidence: 0.5
minTrackingConfidence: 0.5

// Recommended
minHandDetectionConfidence: 0.6  // Higher = fewer false positives
minHandPresenceConfidence: 0.55 // Slightly higher
minTrackingConfidence: 0.6      // Higher = more stable tracking
```

---

## 2. WRIST ALIGNMENT FIX

### 2.1. Root Cause

The current rendering draws a separate line from pose wrist (landmark 15/16) to hand wrist (landmark 0), causing a visual "gap" or "dragging" effect.

### 2.2. Solution

**A. Use Pose Wrist as Anchor**
- When hand is detected, use pose wrist position as the hand's wrist position
- This ensures continuity from forearm to hand

**B. Blend Pose and Hand Wrist**
```javascript
// Instead of using hand wrist directly:
const poseWrist = pose[15]; // or pose[16]
const handWrist = hand[0];

// Blend with heavy weight on pose wrist
const blendedWrist = {
  x: poseWrist.x * 0.7 + handWrist.x * 0.3,
  y: poseWrist.y * 0.7 + handWrist.y * 0.3
};
```

**C. Direct Connection**
- Don't draw a separate bone from elbow to hand wrist
- Draw from elbow to pose wrist, then from pose wrist directly into hand

---

## 3. FACE RENDERING ENHANCEMENT

### 3.1. Pupil/Iris Issues

**Current Problem**: Pupils look unnatural and oversized

**Solution**:
- Use all 4 iris landmarks (469-472 for left, 474-477 for right) to calculate true center
- Derive pupil radius from iris landmark spread, not fixed value
- Add subtle eyelid occlusion check (don't draw iris if blink detected)

### 3.2. Eyebrow Enhancement

**Current Problem**: Eyebrows are thin lines, not solid shapes

**Solution**:
- Use filled bezier curves instead of strokes
- Define upper and lower eyebrow contours
- Fill the area between them with theme-appropriate color

```javascript
const LEFT_EYEBROW_UPPER = [276, 283, 282, 295, 285];
const LEFT_EYEBROW_LOWER = [300, 293, 334, 296, 336];

// Draw as filled shape between upper and lower
ctx.beginPath();
// Move along upper edge
// Continue along lower edge (reversed)
ctx.closePath();
ctx.fill();
```

### 3.3. Nose Enhancement

**Current Problem**: Nose bridge and nostrils lack definition

**Solution**:
- Add nose silhouette shadow
- Render nostril curves, not just points
- Add subtle nose tip highlight

### 3.4. Full Face Contour

**Solution**:
- Add face mesh tessellation for subtle depth
- Use gradient fills for 3D effect
- Add subtle shadow under chin/jaw

---

## 4. LOADING TRANSITION FIX

### 4.1. Current Issue

The awakening overlay doesn't hide properly and interferes with the intro exit animation.

### 4.2. Solution

- Ensure awakening overlay has correct z-index hierarchy
- Properly sequence: Awakening fade-out → Intro exit → Main app entry
- Add GSAP timeline coordination

---

## 5. IMPLEMENTATION TO-DO LIST

### Hand Tracking (Priority 1)
- [ ] Implement One Euro Filter for adaptive smoothing
- [ ] Add handedness consistency tracking (5-frame buffer)
- [ ] Detect hand overlap/occlusion events
- [ ] Increase MediaPipe confidence thresholds
- [ ] Add velocity-based outlier rejection

### Wrist Alignment (Priority 1)
- [ ] Blend pose wrist with hand wrist (70/30 ratio)
- [ ] Remove separate wrist-to-hand bone drawing
- [ ] Ensure forearm-to-hand continuity

### Face Rendering (Priority 2)
- [ ] Recalculate pupil size from iris landmarks
- [ ] Implement filled eyebrow shapes
- [ ] Add nose shadow and highlight
- [ ] Enhance lip inner detail

### Loading Fix (Priority 2)
- [ ] Debug z-index stacking
- [ ] Coordinate GSAP timelines properly
- [ ] Test transition sequence

---

## 6. TESTING CRITERIA

### Hand Stability
- [ ] Hold hands still for 5 seconds — no visible jitter
- [ ] Cross hands left-over-right — tracking maintains identity
- [ ] Cross hands right-over-left — tracking maintains identity
- [ ] Clap hands together — recovery within 0.5 seconds
- [ ] Rotate wrist — smooth transition, no jumps

### Face Quality
- [ ] Eyebrows appear solid and natural
- [ ] Pupils are proportional to eye size
- [ ] Nose has subtle 3D definition
- [ ] Lips show clear inner mouth when open

### Transitions
- [ ] Press Space/Enter — smooth awakening overlay
- [ ] Loading completes — clean transition to main app
- [ ] Press F — cinema mode enters smoothly

---

## CONCLUSION

These enhancements will elevate CORPUS to Louvre-quality standards by addressing the core stability and visual fidelity issues. The One Euro Filter combined with handedness consistency will dramatically improve hand tracking during overlap situations.

