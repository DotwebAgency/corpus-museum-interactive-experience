/**
 * CORPUS — Digital Portrait Experience
 * Baroque Pastel Rococo-inspired visualization
 * "Behold the form."
 */

import { 
  LandmarkVelocityTracker, 
  InteractivePetalStream 
} from './interactive-particles.js';

// ==============================================
// FACE LANDMARKS
// ==============================================

const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
const RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const LEFT_EYEBROW = [276, 283, 282, 295, 285, 300, 293, 334, 296, 336];
const RIGHT_EYEBROW = [46, 53, 52, 65, 55, 70, 63, 105, 66, 107];
const NOSE_BRIDGE = [168, 6, 197, 195, 5, 4];
const NOSE_BOTTOM = [98, 97, 2, 326, 327];

// ===== ENHANCED LIP LANDMARKS FOR LIP-READING =====
// Outer lip contour (20 points)
const LIPS_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
// Inner lip contour (20 points) - the actual mouth opening
const LIPS_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
// Upper lip top edge detail
const LIP_UPPER_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
// Lower lip bottom edge detail
const LIP_LOWER_OUTER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
// Upper lip inner (mouth opening top)
const LIP_UPPER_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308];
// Lower lip inner (mouth opening bottom)
const LIP_LOWER_INNER = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];
// Center lip landmarks for cupid's bow detail
const CUPIDS_BOW = [164, 167, 37, 0, 267, 393, 391];

// ===== LEFT IRIS (for eye detail) =====
const LEFT_IRIS = [469, 470, 471, 472];
const RIGHT_IRIS = [474, 475, 476, 477];

// ===== NOSE DETAIL =====
const NOSE_TIP = [4];
const NOSE_WINGS = [48, 278];
const NOSTRILS = [102, 331];

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17]
];

// ==============================================
// COLOR THEMES
// ==============================================

const THEMES = {
  dark: {
    canvas: '#1C1A18',
    roseBlush: '#E8B4B8',
    powderBlue: '#A8C8DC',
    mintCream: '#A8D0BC',         /* Brighter mint for better visibility */
    lavender: '#C8B8D8',
    peach: '#E8D8D4',             /* Lighter, less brown - elegant ivory */
    cream: '#F5EDE4',
    dustyRose: '#C89898',
    warmWhite: '#FFF8F0',
    roseGlow: 'rgba(232, 180, 184, 0.35)',
    lavenderGlow: 'rgba(200, 184, 216, 0.4)',
  },
  light: {
    canvas: '#FDFBF7',
    roseBlush: '#D08090',        /* Vibrant rose - visible on light bg */
    powderBlue: '#6090B8',       /* Rich blue - good contrast */
    mintCream: '#60A888',        /* Fresh teal - visible */
    lavender: '#9080B8',         /* Vivid lavender */
    peach: '#9A8580',            /* Neutral gray-brown, less orange */
    cream: '#3A3530',            /* Dark text for light mode */
    dustyRose: '#B87878',        /* Darker rose for contrast */
    warmWhite: '#FFFFFF',
    roseGlow: 'rgba(208, 128, 144, 0.4)',
    lavenderGlow: 'rgba(144, 128, 184, 0.4)',
  }
};

// ==============================================
// NOTE: PetalStream moved to interactive-particles.js
// Using InteractivePetalStream for body-reactive particles
// ==============================================

// ==============================================
// DUST MOTES
// ==============================================

class DustMotes {
  constructor(count = 40) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        size: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.0001,
        speedY: -0.00005 - Math.random() * 0.0001,
        opacity: 0.15 + Math.random() * 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }
  
  update(dt) {
    this.particles.forEach(p => {
      p.x += p.speedX * dt;
      p.y += p.speedY * dt;
      p.twinkle += dt * 0.001;
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
    });
  }
  
  render(ctx, w, h, theme) {
    const colors = THEMES[theme];
    this.particles.forEach(p => {
      const opacity = p.opacity * (0.5 + 0.5 * Math.sin(p.twinkle));
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${theme === 'light' ? '154,136,176' : '200,184,216'}, ${opacity})`;
      ctx.fill();
    });
  }
}

// ==============================================
// HUMAN AVATAR RENDERER
// ==============================================

export class HumanAvatarRenderer {
  constructor() {
    this.pose = null;
    this.face = null;
    this.hands = [null, null];
    
    // Raw landmark storage for velocity tracking
    this.rawPose = null;
    this.rawHands = [null, null];
    this.rawFace = null;
    
    this.smoothFactor = 0.35; // PERFORMANCE: Increased for faster response (was 0.22)
    this.isDetected = false;
    this.detectionMode = 'none';
    this.theme = 'light'; // Default to light
    
    // IMPROVED: Hand stability tracking with identity preservation
    this.handVelocityThreshold = 0.08; // REDUCED: Stricter threshold for glitch rejection
    this.handJumpThreshold = 0.25; // Maximum allowed jump before rejecting as glitch
    this.lastHandPositions = [null, null]; // Previous frame hand positions
    this.handIdentities = [null, null]; // Track hand identity by position continuity
    this.handConfidenceHistory = [[], []]; // Rolling confidence for each hand
    this.maxConfidenceHistory = 5; // Frames to average confidence over
    this.lostFrames = 0;
    
    // NEW: Hand fade-out when leaving frame
    this.handFadeAlpha = [1.0, 1.0]; // Current opacity for each hand
    this.handLostFrames = [0, 0]; // Frames since hand was last seen
    this.handFadeOutDelay = 8; // Frames to wait before starting fade (prevents flicker)
    this.handFadeOutDuration = 15; // Frames to fully fade out
    this.handMaxLostFrames = 30; // Fully clear hand after this many frames
    
    // PERFORMANCE: Faster response with less smoothing
    this.armSmoothFactor = 0.5; // Faster arm tracking
    this.handSmoothFactor = 0.45; // Faster hand tracking for quick fist response
    this.fastMovementThreshold = 0.08; // Threshold to detect fast movement
    this.adaptiveSmoothMultiplier = 0.6; // Less aggressive smoothing during fast movement
    
    // Effects - NEW: Interactive particle system
    this.velocityTracker = new LandmarkVelocityTracker();
    this.petalStream = new InteractivePetalStream();
    this.petalStream.setVelocityTracker(this.velocityTracker);
    
    this.dustMotes = new DustMotes(50);
    
    // Track BOTH fists independently
    this.fistStates = [
      { detected: false, position: { x: 0.5, y: 0.5 } },
      { detected: false, position: { x: 0.5, y: 0.5 } }
    ];
    this.isFistDetected = false; // Any fist detected
    
    // ===== ENTRANCE ANIMATION STATE =====
    this.entrancePhase = 'waiting'; // waiting, assembling, complete
    this.entranceProgress = 0; // 0-1 animation progress
    this.entranceStartTime = 0;
    this.entranceDuration = 2.0; // 2 seconds for full assembly
    this.wasDetected = false; // Track previous detection state
    
    // Joint reveal order with timing offsets (0-1 range)
    // Anatomically-inspired: spine first, then outward
    this.jointRevealTiming = {
      // Spine/core (first)
      11: 0.0, 12: 0.0,   // Shoulders
      23: 0.05, 24: 0.05, // Hips
      // Arms (second wave)
      13: 0.15, 14: 0.15, // Elbows
      15: 0.25, 16: 0.25, // Wrists
      17: 0.35, 18: 0.35, 19: 0.35, 20: 0.35, // Hand points (unused for pose)
      21: 0.35, 22: 0.35, // Additional hand
      // Legs (parallel with arms)
      25: 0.2, 26: 0.2,   // Knees
      27: 0.3, 28: 0.3,   // Ankles
      29: 0.4, 30: 0.4, 31: 0.4, 32: 0.4, // Feet
      // Face last
      0: 0.45, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.5, // Face landmarks
      5: 0.55, 6: 0.55, 7: 0.6, 8: 0.6, 9: 0.65, 10: 0.65
    };
    
    // Hand entrance timing (landmark index -> reveal time)
    this.handRevealTiming = {};
    for (let i = 0; i < 21; i++) {
      // Wrist first, then palm, then fingers (pinky to thumb)
      if (i === 0) this.handRevealTiming[i] = 0;           // Wrist
      else if (i <= 4) this.handRevealTiming[i] = 0.1 + (i * 0.05); // Thumb
      else if (i <= 8) this.handRevealTiming[i] = 0.15 + ((i - 5) * 0.04); // Index
      else if (i <= 12) this.handRevealTiming[i] = 0.2 + ((i - 9) * 0.04); // Middle
      else if (i <= 16) this.handRevealTiming[i] = 0.25 + ((i - 13) * 0.04); // Ring
      else this.handRevealTiming[i] = 0.3 + ((i - 17) * 0.04); // Pinky
    }
    
    // Face landmark reveal timing (draw face oval first, then features)
    this.faceRevealBase = 0.5; // Face starts at 50% of entrance
    
    // NEW: Face expression state (from blendshapes)
    this.faceExpression = {
      smile: 0,        // mouthSmileLeft + mouthSmileRight average
      surprise: 0,     // browInnerUp + jawOpen average
      blink: 0,        // eyeBlinkLeft + eyeBlinkRight average
      intensity: 0     // Composite emotional intensity
    };
    this.expressionSmooth = 0.2; // Smoothing factor for expressions
    
    // Animation
    this.time = 0;
    // NOTE: entranceProgress (defined in ENTRANCE ANIMATION STATE section) is now the 
    // single source of truth for avatar visibility during entrance animation
    this.firstDetectionTime = 0;
    
    // Debug mode
    this.debugZones = false;
  }
  
  setTheme(theme) {
    this.theme = theme;
  }
  
  getColors() {
    return THEMES[this.theme] || THEMES.dark;
  }
  
  /**
   * Process face blendshapes for emotional particle responses
   * MediaPipe returns 52 blendshape coefficients (0-1 range)
   */
  processFaceBlendshapes(blendshapes) {
    if (!blendshapes || blendshapes.length === 0) return;
    
    // Get the first face's blendshapes array
    const shapes = blendshapes[0];
    if (!shapes || !shapes.categories) return;
    
    // Create a map for quick lookup
    const shapeMap = {};
    shapes.categories.forEach(s => {
      shapeMap[s.categoryName] = s.score;
    });
    
    // Calculate expression values
    const smileLeft = shapeMap['mouthSmileLeft'] || 0;
    const smileRight = shapeMap['mouthSmileRight'] || 0;
    const targetSmile = (smileLeft + smileRight) / 2;
    
    const browUp = shapeMap['browInnerUp'] || 0;
    const jawOpen = shapeMap['jawOpen'] || 0;
    const targetSurprise = Math.min(1, (browUp * 0.6 + jawOpen * 0.4));
    
    const blinkLeft = shapeMap['eyeBlinkLeft'] || 0;
    const blinkRight = shapeMap['eyeBlinkRight'] || 0;
    const targetBlink = (blinkLeft + blinkRight) / 2;
    
    // Smooth the values
    this.faceExpression.smile += (targetSmile - this.faceExpression.smile) * this.expressionSmooth;
    this.faceExpression.surprise += (targetSurprise - this.faceExpression.surprise) * this.expressionSmooth;
    this.faceExpression.blink += (targetBlink - this.faceExpression.blink) * this.expressionSmooth;
    
    // Composite intensity (positive emotions)
    this.faceExpression.intensity = Math.min(1, 
      this.faceExpression.smile * 0.6 + this.faceExpression.surprise * 0.4
    );
    
    // Apply expression effects to particles
    this.applyExpressionToParticles();
  }
  
  /**
   * Apply facial expression effects to particle system
   */
  applyExpressionToParticles() {
    const expr = this.faceExpression;
    
    // When smiling: particles become warmer and more vibrant
    if (expr.smile > 0.3) {
      const smileStrength = (expr.smile - 0.3) / 0.7; // Normalize to 0-1
      
      // Boost spawn rate when smiling
      this.petalStream.config.spawnRate = 0.95 + smileStrength * 0.05;
      
      // Make particles rise slightly faster when happy
      this.petalStream.config.gravity = -0.00003 - smileStrength * 0.00002;
    } else {
      // Reset to defaults
      this.petalStream.config.spawnRate = 0.95;
      this.petalStream.config.gravity = -0.00003;
    }
    
    // When surprised: particles expand and speed up briefly
    if (expr.surprise > 0.4) {
      const surpriseStrength = (expr.surprise - 0.4) / 0.6;
      
      // Trigger a gentle radial expansion from face center
      if (this.face && this.face[4]) { // Nose tip
        const faceX = 1 - this.face[4].x;
        const faceY = this.face[4].y;
        
        // Small push effect when surprised
        this.petalStream.triggerWindPush(faceX, faceY, 0.08 + surpriseStrength * 0.04);
      }
    }
  }
  
  update(poseLandmarks, handLandmarks, faceLandmarks, timestamp = performance.now(), gestures = [], faceBlendshapes = []) {
    const dt = 16;
    this.time = timestamp * 0.001;
    
    // Store detected gestures
    this.currentGestures = gestures;
    
    // Process face blendshapes for emotional responses
    this.processFaceBlendshapes(faceBlendshapes);
    
    // Update dust
    this.dustMotes.update(dt);
    
    // Store raw landmarks for velocity tracking (before smoothing)
    this.rawPose = poseLandmarks && poseLandmarks.length > 0 ? poseLandmarks[0] : null;
    this.rawHands = [
      handLandmarks && handLandmarks[0] ? handLandmarks[0] : null,
      handLandmarks && handLandmarks[1] ? handLandmarks[1] : null
    ];
    this.rawFace = faceLandmarks && faceLandmarks.length > 0 ? faceLandmarks[0] : null;
    
    // Update velocity tracker with raw (unsmoothed) data for accurate velocity
    this.velocityTracker.update(this.rawPose, this.rawHands, timestamp);
    
    // Pose
    if (poseLandmarks && poseLandmarks.length > 0 && poseLandmarks[0].length >= 33) {
      const newPose = poseLandmarks[0];
      
      // Check if any landmarks are actually visible
      const hasVisibleLandmarks = newPose.some(p => (p.visibility || 0) > 0.3);
      
      if (hasVisibleLandmarks) {
        if (!this.pose) {
          this.pose = newPose.map(p => ({ x: p.x, y: p.y, z: p.z || 0, visibility: p.visibility }));
          this.firstDetectionTime = timestamp;
        } else {
          for (let i = 0; i < 33; i++) {
            if (newPose[i]) {
              this.pose[i].x += (newPose[i].x - this.pose[i].x) * this.smoothFactor;
              this.pose[i].y += (newPose[i].y - this.pose[i].y) * this.smoothFactor;
              this.pose[i].visibility = newPose[i].visibility;
            }
          }
        }
        this.isDetected = true;
        this.lostFrames = 0;
      } else {
        this.lostFrames = (this.lostFrames || 0) + 1;
        // After 15 frames without detection, reset
        if (this.lostFrames > 15) {
          this.isDetected = false;
          this.pose = null;
          this.face = null;
          // Reset entrance animation state
          this.entrancePhase = 'waiting';
          this.entranceProgress = 0;
          this.firstDetectionTime = 0;
        }
      }
    } else {
      this.lostFrames = (this.lostFrames || 0) + 1;
      if (this.lostFrames > 15) {
        this.isDetected = false;
        this.pose = null;
        this.face = null;
        // Reset entrance animation state
        this.entrancePhase = 'waiting';
        this.entranceProgress = 0;
        this.firstDetectionTime = 0;
      }
    }
    
    // ===== ENTRANCE ANIMATION LOGIC (must be AFTER pose processing) =====
    this.updateEntranceAnimation(timestamp);
    
    this.updateDetectionMode();
    
    // Face - only update if we have detection
    if (this.isDetected && faceLandmarks && faceLandmarks.length > 0 && faceLandmarks[0].length >= 468) {
      const newFace = faceLandmarks[0];
      if (!this.face) {
        this.face = newFace.map(p => ({ x: p.x, y: p.y }));
      } else {
        for (let i = 0; i < Math.min(newFace.length, this.face.length); i++) {
          this.face[i].x += (newFace[i].x - this.face[i].x) * this.smoothFactor;
          this.face[i].y += (newFace[i].y - this.face[i].y) * this.smoothFactor;
        }
      }
    }
    
    // IMPROVED: Hands & fist detection with identity tracking to prevent swap glitches
    this.isFistDetected = false;
    this.fistStates[0].detected = false;
    this.fistStates[1].detected = false;
    
    if (handLandmarks && handLandmarks.length > 0) {
      // IMPROVED: Match incoming hands to existing tracked hands by proximity
      // This prevents the "swap glitch" when hands overlap
      const incomingHands = handLandmarks.slice(0, 2).filter(h => h && h.length >= 21);
      const assignments = this.matchHandsToSlots(incomingHands);
      
      for (let slotIdx = 0; slotIdx < 2; slotIdx++) {
        const assignedHandIdx = assignments[slotIdx];
        
        if (assignedHandIdx === -1) {
          // No hand assigned to this slot - start fade out process
          this.handLostFrames[slotIdx]++;
          
          if (this.hands[slotIdx]) {
            // Calculate fade alpha
            if (this.handLostFrames[slotIdx] > this.handFadeOutDelay) {
              const fadeProgress = (this.handLostFrames[slotIdx] - this.handFadeOutDelay) / this.handFadeOutDuration;
              this.handFadeAlpha[slotIdx] = Math.max(0, 1 - fadeProgress);
            }
            
            // Clear hand completely after max lost frames
            if (this.handLostFrames[slotIdx] >= this.handMaxLostFrames) {
              this.hands[slotIdx] = null;
              this.handIdentities[slotIdx] = null;
              this.handFadeAlpha[slotIdx] = 0;
            }
          }
          
          this.fistStates[slotIdx].detected = false;
          continue;
        }
        
        // Hand found - reset fade state
        this.handLostFrames[slotIdx] = 0;
        this.handFadeAlpha[slotIdx] = 1.0;
        
        const newHand = incomingHands[assignedHandIdx];
        
        // IMPROVED: Multi-point velocity check (not just wrist)
          let isValidUpdate = true;
        let isFastMovement = false;
        
        if (this.hands[slotIdx] && this.lastHandPositions[slotIdx]) {
          // Check multiple landmarks for outlier detection
          const checkPoints = [0, 5, 9, 13, 17]; // Wrist + 4 MCP joints
          let totalDist = 0;
          let maxDist = 0;
          
          for (const idx of checkPoints) {
            const dist = Math.hypot(
              newHand[idx].x - this.hands[slotIdx][idx].x,
              newHand[idx].y - this.hands[slotIdx][idx].y
            );
            totalDist += dist;
            maxDist = Math.max(maxDist, dist);
          }
          
          const avgDist = totalDist / checkPoints.length;
          
          // Detect fast movement (for adaptive smoothing)
          if (avgDist > this.fastMovementThreshold) {
            isFastMovement = true;
          }
          
          // Reject as glitch if ANY point jumps too far OR if multiple points jump significantly
          if (maxDist > this.handJumpThreshold || avgDist > this.handVelocityThreshold) {
              isValidUpdate = false;
            }
          }
          
        if (!this.hands[slotIdx]) {
          // First detection - initialize directly
          this.hands[slotIdx] = newHand.map(p => ({ x: p.x, y: p.y }));
          this.handIdentities[slotIdx] = { x: newHand[0].x, y: newHand[0].y };
        } else if (isValidUpdate) {
          // IMPROVED: Adaptive smoothing based on movement speed
          let smoothFactor = this.handSmoothFactor;
          if (isFastMovement) {
            // During fast movement, increase smoothing to reduce jitter
            smoothFactor *= this.adaptiveSmoothMultiplier;
          }
            
            for (let i = 0; i < 21; i++) {
            this.hands[slotIdx][i].x += (newHand[i].x - this.hands[slotIdx][i].x) * smoothFactor;
            this.hands[slotIdx][i].y += (newHand[i].y - this.hands[slotIdx][i].y) * smoothFactor;
          }
          
          // Update identity reference
          this.handIdentities[slotIdx] = { x: this.hands[slotIdx][0].x, y: this.hands[slotIdx][0].y };
        } else {
          // Glitch detected - apply very heavy smoothing (essentially ignore the glitchy frame)
          const heavySmooth = 0.05;
          for (let i = 0; i < 21; i++) {
            this.hands[slotIdx][i].x += (newHand[i].x - this.hands[slotIdx][i].x) * heavySmooth;
            this.hands[slotIdx][i].y += (newHand[i].y - this.hands[slotIdx][i].y) * heavySmooth;
          }
        }
        
        // Store current position for next frame
        this.lastHandPositions[slotIdx] = newHand.map(p => ({ x: p.x, y: p.y }));
          
          // Check fist for THIS hand - prefer native gesture if available
        const nativeGesture = this.currentGestures && this.currentGestures[assignedHandIdx];
          const isFist = nativeGesture 
            ? nativeGesture.name === 'Closed_Fist' && nativeGesture.confidence > 0.5
          : this.detectFist(this.hands[slotIdx]); // Fallback to custom detection
          
          // Store the gesture type for other effects
        this.fistStates[slotIdx].gesture = nativeGesture?.name || (isFist ? 'Closed_Fist' : 'None');
          
          if (isFist) {
          this.fistStates[slotIdx].detected = true;
            this.isFistDetected = true;
            
          const wrist = this.hands[slotIdx][0];
          const mcp = this.hands[slotIdx][9];
            // Mirror X coordinate since we flip the canvas for display
          this.fistStates[slotIdx].position = {
              x: 1 - (wrist.x + mcp.x) / 2,
              y: (wrist.y + mcp.y) / 2
            };
          }
          
        // Check for Open_Palm gesture (wind push effect)
          if (nativeGesture && nativeGesture.name === 'Open_Palm' && nativeGesture.confidence > 0.5) {
          const wrist = this.hands[slotIdx][0];
          const mcp = this.hands[slotIdx][9];
            const palmPosition = {
              x: 1 - (wrist.x + mcp.x) / 2,
              y: (wrist.y + mcp.y) / 2
            };
            // Trigger wind push effect
            this.petalStream.triggerWindPush(palmPosition.x, palmPosition.y, 0.15);
          }
          
        // Check for Pointing_Up gesture (magnet attraction effect)
          if (nativeGesture && nativeGesture.name === 'Pointing_Up' && nativeGesture.confidence > 0.5) {
            // Use index fingertip (landmark 8) for the magnet point
          const indexTip = this.hands[slotIdx][8];
            const fingertipPosition = {
              x: 1 - indexTip.x,
              y: indexTip.y
            };
            // Trigger magnet attraction effect
            this.petalStream.triggerMagnetAttraction(fingertipPosition.x, fingertipPosition.y, 0.12);
          }
      }
    } else {
      // No hands detected - clear slots
      this.hands = [null, null];
      this.handIdentities = [null, null];
      this.fistStates[0].detected = false;
      this.fistStates[1].detected = false;
    }
    
    // Update interactive petal stream with body data for collision detection
    this.petalStream.setBodyData(this.rawPose, this.rawHands, this.rawFace);
    
    // Update petal stream - spawn from ALL active fists
    // Pass array of active fist positions
    const activeFists = this.fistStates.filter(f => f.detected).map(f => f.position);
    if (activeFists.length > 0) {
      this.petalStream.startMultiple(activeFists);
    } else {
      this.petalStream.stop();
    }
    
    // Use first fist position for backward compatibility (or center if both)
    let primaryFistX = 0.5, primaryFistY = 0.5;
    if (activeFists.length === 1) {
      primaryFistX = activeFists[0].x;
      primaryFistY = activeFists[0].y;
    } else if (activeFists.length === 2) {
      primaryFistX = (activeFists[0].x + activeFists[1].x) / 2;
      primaryFistY = (activeFists[0].y + activeFists[1].y) / 2;
    }
    
    this.petalStream.update(primaryFistX, primaryFistY, dt, this.theme);
  }
  
  updateDetectionMode() {
    if (!this.pose) {
      this.detectionMode = this.face ? 'face' : 'none';
      return;
    }
    const vis = (idx) => (this.pose[idx]?.visibility || 0) > 0.5;
    const hasShoulders = vis(11) && vis(12);
    const hasHips = vis(23) && vis(24);
    
    if (hasShoulders && hasHips) this.detectionMode = 'full';
    else if (hasShoulders) this.detectionMode = 'upper';
    else if (this.face) this.detectionMode = 'face';
    else this.detectionMode = 'none';
  }
  
  detectFist(hand) {
    if (!hand || hand.length < 21) return false;
    const wrist = hand[0];
    const fingerData = [
      { tip: 8, mcp: 5 }, { tip: 12, mcp: 9 },
      { tip: 16, mcp: 13 }, { tip: 20, mcp: 17 }
    ];
    let curled = 0;
    for (const f of fingerData) {
      const tipDist = Math.hypot(hand[f.tip].x - wrist.x, hand[f.tip].y - wrist.y);
      const mcpDist = Math.hypot(hand[f.mcp].x - wrist.x, hand[f.mcp].y - wrist.y);
      if (tipDist < mcpDist * 1.5) curled++;
    }
    return curled >= 3;
  }
  
  // ===== ENTRANCE ANIMATION METHODS =====
  
  /**
   * Update the entrance animation state
   */
  updateEntranceAnimation(timestamp) {
    const currentlyDetected = this.pose && this.isDetected;
    
    // Detect state transition: not detected -> detected
    if (currentlyDetected && !this.wasDetected) {
      // Start entrance animation!
      console.log('[CORPUS] 🎭 Starting entrance animation!', { timestamp, pose: !!this.pose, isDetected: this.isDetected });
      this.entrancePhase = 'assembling';
      this.entranceStartTime = timestamp;
      this.entranceProgress = 0;
    }
    
    // Detect state transition: detected -> not detected
    if (!currentlyDetected && this.wasDetected && this.entrancePhase === 'complete') {
      // Start exit sequence
      this.entrancePhase = 'exiting';
      this.entranceStartTime = timestamp;
    }
    
    // Update animation progress
    if (this.entrancePhase === 'assembling') {
      const elapsed = (timestamp - this.entranceStartTime) / 1000;
      this.entranceProgress = Math.min(1, elapsed / this.entranceDuration);
      
      // Debug every 30 frames
      if (Math.floor(timestamp / 500) !== Math.floor((timestamp - 16) / 500)) {
        console.log('[CORPUS] 🎭 Entrance progress:', (this.entranceProgress * 100).toFixed(1) + '%');
      }
      
      if (this.entranceProgress >= 1) {
        console.log('[CORPUS] 🎭 Entrance animation COMPLETE!');
        this.entrancePhase = 'complete';
        this.onEntranceComplete();
      }
    }
    
    // Exit animation (reverse)
    if (this.entrancePhase === 'exiting') {
      const elapsed = (timestamp - this.entranceStartTime) / 1000;
      this.entranceProgress = Math.max(0, 1 - (elapsed / (this.entranceDuration * 0.5)));
      
      if (this.entranceProgress <= 0) {
        this.entrancePhase = 'waiting';
      }
    }
    
    this.wasDetected = currentlyDetected;
  }
  
  /**
   * Called when entrance animation completes
   */
  onEntranceComplete() {
    // Trigger completion effects
    if (this.petalStream) {
      // Brief celebratory burst
      const centerX = 0.5;
      const centerY = 0.5;
      this.petalStream.triggerWindPush(centerX, centerY, 0.08);
    }
  }
  
  /**
   * Get visibility factor for a pose joint based on entrance progress
   * @param {number} jointIdx - Pose landmark index
   * @returns {number} 0-1 visibility factor
   */
  getJointVisibility(jointIdx) {
    if (this.entrancePhase === 'waiting') return 0;
    if (this.entrancePhase === 'complete') return 1;
    
    const revealTime = this.jointRevealTiming[jointIdx] || 0;
    const revealDuration = 0.15; // Each joint takes 15% of animation to fully appear
    
    const progress = (this.entranceProgress - revealTime) / revealDuration;
    return Math.max(0, Math.min(1, progress));
  }
  
  /**
   * Get visibility factor for a hand landmark
   * @param {number} landmarkIdx - Hand landmark index (0-20)
   * @returns {number} 0-1 visibility factor
   */
  getHandLandmarkVisibility(landmarkIdx) {
    if (this.entrancePhase === 'waiting') return 0;
    if (this.entrancePhase === 'complete') return 1;
    
    // Hands appear after body (start at 35% progress)
    const handStartTime = 0.35;
    const adjustedProgress = Math.max(0, this.entranceProgress - handStartTime) / (1 - handStartTime);
    
    const revealTime = this.handRevealTiming[landmarkIdx] || 0;
    const revealDuration = 0.2;
    
    const progress = (adjustedProgress - revealTime) / revealDuration;
    return Math.max(0, Math.min(1, progress));
  }
  
  /**
   * Get visibility factor for face features
   * @returns {number} 0-1 visibility factor
   */
  getFaceVisibility() {
    if (this.entrancePhase === 'waiting') return 0;
    if (this.entrancePhase === 'complete') return 1;
    
    // Face appears last (start at 50% progress)
    const faceStartTime = this.faceRevealBase;
    const adjustedProgress = Math.max(0, this.entranceProgress - faceStartTime) / (1 - faceStartTime);
    
    return Math.min(1, adjustedProgress * 1.5); // Slightly faster reveal once started
  }
  
  /**
   * Get scale factor for entrance animation (joints grow from 0)
   * @param {number} visibility - Current visibility (0-1)
   * @returns {number} Scale factor with easing
   */
  getEntranceScale(visibility) {
    if (visibility >= 1) return 1;
    // Elastic ease-out for satisfying "pop" effect
    const t = visibility;
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
  
  /**
   * Get visibility for a bone (connecting two joints)
   * Bone appears when BOTH connected joints are at least partially visible
   * @param {number} jointA - First joint index
   * @param {number} jointB - Second joint index
   * @returns {number} 0-1 visibility factor
   */
  getBoneVisibility(jointA, jointB) {
    if (this.entrancePhase === 'waiting') return 0;
    if (this.entrancePhase === 'complete') return 1;
    
    const visA = this.getJointVisibility(jointA);
    const visB = this.getJointVisibility(jointB);
    
    // Bone only starts appearing when first joint is mostly visible
    // and grows toward second joint
    if (visA < 0.3) return 0;
    
    // Return the minimum visibility (bone is limited by least-visible joint)
    return Math.min(visA, visB);
  }
  
  /**
   * Get visibility for spine/neck bones (center of body)
   * @returns {number} 0-1 visibility factor
   */
  getSpineVisibility() {
    if (this.entrancePhase === 'waiting') return 0;
    if (this.entrancePhase === 'complete') return 1;
    
    // Spine appears early in the animation (part of core body)
    const coreStart = 0.05;
    const coreDuration = 0.3;
    return Math.min(1, Math.max(0, (this.entranceProgress - coreStart) / coreDuration));
  }
  
  /**
   * IMPROVED: Match incoming hands to existing tracked slots to prevent swap glitch
   * Uses Hungarian-style nearest-neighbor matching
   * @param {Array} incomingHands - New hand landmarks from MediaPipe
   * @returns {Array} - Array of indices mapping slot -> incoming hand index (-1 if none)
   */
  matchHandsToSlots(incomingHands) {
    const assignments = [-1, -1]; // slot 0 and slot 1
    const usedIncoming = new Set();
    
    // If we have existing tracked hands, match by proximity
    for (let slot = 0; slot < 2; slot++) {
      if (!this.handIdentities[slot]) continue;
      
      let bestDist = Infinity;
      let bestIdx = -1;
      
      for (let i = 0; i < incomingHands.length; i++) {
        if (usedIncoming.has(i)) continue;
        
        const newWrist = incomingHands[i][0];
        const dist = Math.hypot(
          newWrist.x - this.handIdentities[slot].x,
          newWrist.y - this.handIdentities[slot].y
        );
        
        // Only match if reasonably close (prevents matching across screen)
        if (dist < 0.3 && dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      
      if (bestIdx !== -1) {
        assignments[slot] = bestIdx;
        usedIncoming.add(bestIdx);
      }
    }
    
    // Assign any remaining incoming hands to empty slots
    for (let i = 0; i < incomingHands.length; i++) {
      if (usedIncoming.has(i)) continue;
      
      // Find first empty slot
      for (let slot = 0; slot < 2; slot++) {
        if (assignments[slot] === -1) {
          assignments[slot] = i;
          usedIncoming.add(i);
          break;
        }
      }
    }
    
    return assignments;
  }
  
  render(ctx, width, height) {
    const c = this.getColors();
    
    // Dust motes
    this.dustMotes.render(ctx, width, height, this.theme);
    
    if (this.detectionMode === 'none') {
      // Still render petals even when no detection
      this.petalStream.render(ctx, width, height);
      return;
    }
    
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    
    // NOTE: Individual drawing functions (drawJoint, drawBone, drawFace) now handle
    // their own visibility using getJointVisibility(), getBoneVisibility(), etc.
    // Do NOT set globalAlpha here - it would override the per-element entrance visibility
    // ctx.globalAlpha = this.entranceProgress; // REMOVED - handled per-element
    
    if (this.face && this.face.length >= 468) {
      this.drawFace(ctx, width, height, c);
    }
    
    if (this.pose && this.detectionMode !== 'face') {
      if (this.detectionMode === 'full') {
        this.drawFullSkeleton(ctx, width, height, c);
      } else if (this.detectionMode === 'upper') {
        this.drawUpperSkeleton(ctx, width, height, c);
      }
    }
    
    this.drawHands(ctx, width, height, c);
    
    ctx.globalAlpha = 1;
    ctx.restore();
    
    // Petals render on top, not mirrored
    this.petalStream.render(ctx, width, height);
    
    // Debug: show interaction zones
    if (this.debugZones) {
      this.petalStream.renderDebugZones(ctx, width, height);
    }
  }
  
  // Toggle debug visualization
  setDebugZones(enabled) {
    this.debugZones = enabled;
  }
  
  // Get particle count for UI
  getParticleCount() {
    return this.petalStream.getParticleCount();
  }
  
  // ==============================================
  // FACE
  // ==============================================
  
  drawFace(ctx, w, h, c) {
    const f = this.face;
    
    // Get face entrance visibility
    const faceVis = this.getFaceVisibility();
    if (faceVis <= 0) return; // Skip if not visible yet
    
    // ===== FACE OVAL - IMPROVED with smooth curve =====
    const ovalPoints = FACE_OVAL.map(idx => ({ x: f[idx].x * w, y: f[idx].y * h }));
    
    // Draw smooth face outline using quadratic curves
    ctx.save();
    ctx.globalAlpha = 0.7 * faceVis;
    
    // Outer glow for face - neutral, elegant tones (not brown)
    ctx.beginPath();
    this.drawSmoothPath(ctx, ovalPoints, true);
    ctx.strokeStyle = this.theme === 'light' ? 'rgba(140,130,140,0.15)' : 'rgba(220,210,220,0.12)';
    ctx.lineWidth = 5 * faceVis;
    ctx.stroke();
    
    // Main face outline
    ctx.beginPath();
    this.drawSmoothPath(ctx, ovalPoints, true);
    ctx.strokeStyle = c.peach;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    ctx.restore();
    
    // ===== SOLID FILLED EYEBROWS =====
    this.drawFilledEyebrow(ctx, f, LEFT_EYEBROW, w, h, c);
    this.drawFilledEyebrow(ctx, f, RIGHT_EYEBROW, w, h, c);
    
    // ===== EYES WITH DETAIL =====
    // Eye white fill (subtle)
    this.drawEyeWhite(ctx, f, LEFT_EYE, w, h);
    this.drawEyeWhite(ctx, f, RIGHT_EYE, w, h);
    
    // Eye outlines - thinner, more elegant
    this.drawSmoothEye(ctx, f, LEFT_EYE, w, h, c);
    this.drawSmoothEye(ctx, f, RIGHT_EYE, w, h, c);
    
    // Iris rendering (if landmarks available) - MUST come after eye outline
    if (f.length > 477) {
      this.drawIris(ctx, f, LEFT_IRIS, w, h, c);
      this.drawIris(ctx, f, RIGHT_IRIS, w, h, c);
    }
    
    // ===== ENHANCED LIPS (FOR LIP-READING) =====
    this.drawEnhancedLips(ctx, f, w, h, c);
    
    // ===== ENHANCED NOSE RENDERING =====
    this.drawEnhancedNose(ctx, f, w, h, c);
  }
  
  // Helper: Draw smooth curved path through points
  drawSmoothPath(ctx, points, closed = false) {
    if (points.length < 3) {
      // Fallback for too few points
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      if (closed) ctx.closePath();
      return;
    }
    
    ctx.moveTo(points[0].x, points[0].y);
    
    // Use quadratic curves for smooth interpolation
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    // Final point
    const last = points[points.length - 1];
    ctx.quadraticCurveTo(last.x, last.y, last.x, last.y);
    
    if (closed) {
      // Smooth close back to start
      const first = points[0];
      const secondLast = points[points.length - 2];
      ctx.quadraticCurveTo(last.x, last.y, (last.x + first.x) / 2, (last.y + first.y) / 2);
      ctx.quadraticCurveTo(first.x, first.y, first.x, first.y);
    }
  }
  
  // ===== LOUVRE-QUALITY EYE RENDERING =====
  // Elegant almond-shaped eyes with proper depth and artistic flair
  drawEyeWhite(ctx, f, indices, w, h) {
    if (!indices.every(idx => f[idx])) return;
    
    const points = indices.map(idx => ({ x: f[idx].x * w, y: f[idx].y * h }));
    
    // Calculate eye center and bounds
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const eyeHeight = maxY - minY;
    
    // Subtle gradient for sclera depth
    const scleraGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, eyeHeight);
    scleraGrad.addColorStop(0, this.theme === 'light' ? 'rgba(255,255,255,0.15)' : 'rgba(248,245,242,0.12)');
    scleraGrad.addColorStop(1, this.theme === 'light' ? 'rgba(240,235,230,0.08)' : 'rgba(220,215,210,0.06)');
    
    ctx.save();
    ctx.beginPath();
    this.drawSmoothPath(ctx, points, true);
    ctx.fillStyle = scleraGrad;
    ctx.fill();
    ctx.restore();
  }
  
  // Elegant eye outline with artistic shading
  drawSmoothEye(ctx, f, indices, w, h, c) {
    if (!indices.every(idx => f[idx])) return;
    
    const points = indices.map(idx => ({ x: f[idx].x * w, y: f[idx].y * h }));
    
    // Calculate bounds for gradient
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    // Subtle upper lid shadow
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    this.drawSmoothPath(ctx, points.slice(0, Math.floor(points.length / 2)), false);
    ctx.strokeStyle = this.theme === 'light' ? '#5A5550' : '#908880';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
    
    // Main eye outline - elegant thin line
    ctx.beginPath();
    this.drawSmoothPath(ctx, points, true);
    ctx.strokeStyle = this.theme === 'light' ? '#6A6560' : c.lavender;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Subtle inner corner highlight (tear duct area)
    const innerCorner = points[0];
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(innerCorner.x, innerCorner.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.theme === 'light' ? '#C89898' : c.roseBlush;
    ctx.fill();
    ctx.restore();
  }
  
  // ===== LOUVRE-QUALITY NOSE RENDERING =====
  // Elegant, minimal nose with artistic shadow and form
  drawEnhancedNose(ctx, f, w, h, c) {
    // Nose bridge - subtle centerline only
    const bridgePoints = NOSE_BRIDGE.map(idx => f[idx]).filter(Boolean);
    if (bridgePoints.length >= 4) {
      // Soft shadow on left side of bridge
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      bridgePoints.slice(1, -1).forEach((p, i) => {
        const x = (p.x * w) - 1.5;
        const y = p.y * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = this.theme === 'light' ? '#4A4540' : '#3A3530';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
      
      // Subtle highlight on right side
      ctx.beginPath();
      bridgePoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * w, p.y * h);
        else ctx.lineTo(p.x * w, p.y * h);
      });
      ctx.strokeStyle = c.mintCream;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    
    // Nose bottom contour with nostrils
    const bottomPoints = NOSE_BOTTOM.map(idx => f[idx]).filter(Boolean);
    if (bottomPoints.length >= 3) {
      ctx.beginPath();
      bottomPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * w, p.y * h);
        else ctx.lineTo(p.x * w, p.y * h);
      });
      ctx.strokeStyle = c.mintCream;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    
    // Elegant nose tip - simple highlight dot
    const noseTip = f[4];
    if (noseTip) {
      // Subtle tip highlight
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(noseTip.x * w, noseTip.y * h, 4, 0, Math.PI * 2);
      ctx.fillStyle = this.theme === 'light' ? '#FFFFFF' : c.cream;
      ctx.fill();
      ctx.restore();
    }
    
    // Minimalist nostril indication - just subtle shadows
    const nostrilLeft = f[102];
    const nostrilRight = f[331];
    if (nostrilLeft && nostrilRight) {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = this.theme === 'light' ? '#4A4540' : '#2A2520';
      
      // Left nostril - tiny crescent
      ctx.beginPath();
      ctx.arc(nostrilLeft.x * w, nostrilLeft.y * h, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Right nostril - tiny crescent
      ctx.beginPath();
      ctx.arc(nostrilRight.x * w, nostrilRight.y * h, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // ===== LOUVRE-QUALITY LIP RENDERING =====
  // Elegant, sophisticated lip colors with proper depth
  drawEnhancedLips(ctx, f, w, h, c) {
    // Define Louvre-quality lip colors (elegant rose tones, no brown)
    const lipColors = this.theme === 'light' 
      ? {
          outer: 'rgba(185, 130, 140, 0.25)',       // Soft rose fill
          contour: '#9A7078',                        // Muted mauve contour
          inner: 'rgba(60, 45, 55, 0.65)',          // Deep plum-gray interior
          innerLine: '#806068',                      // Soft mauve inner line
          highlight: 'rgba(255, 252, 250, 0.4)',   // Subtle highlight
          corner: '#907078'                          // Corner accent
        }
      : {
          outer: 'rgba(200, 160, 168, 0.2)',        // Soft blush fill
          contour: '#C8A0A8',                        // Dusty rose contour
          inner: 'rgba(35, 25, 35, 0.7)',           // Deep burgundy-gray interior (not brown)
          innerLine: '#A08088',                      // Soft mauve-pink inner line
          highlight: 'rgba(255, 248, 245, 0.35)',  // Warm highlight
          corner: '#B08890'                          // Corner accent
        };
    
    // 1. Outer lip fill - subtle blush
    ctx.fillStyle = lipColors.outer;
    ctx.beginPath();
    LIPS_OUTER.forEach((idx, i) => {
      const p = f[idx];
      if (i === 0) ctx.moveTo(p.x * w, p.y * h);
      else ctx.lineTo(p.x * w, p.y * h);
    });
    ctx.closePath();
    ctx.fill();
    
    // 2. Outer lip contour - elegant line
    ctx.strokeStyle = lipColors.contour;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    LIPS_OUTER.forEach((idx, i) => {
      const p = f[idx];
      if (i === 0) ctx.moveTo(p.x * w, p.y * h);
      else ctx.lineTo(p.x * w, p.y * h);
    });
    ctx.closePath();
    ctx.stroke();
    
    // 3. Mouth interior - deep, sophisticated (not brown!)
    if (LIPS_INNER.every(idx => f[idx])) {
      ctx.fillStyle = lipColors.inner;
      ctx.beginPath();
      LIPS_INNER.forEach((idx, i) => {
        const p = f[idx];
        if (i === 0) ctx.moveTo(p.x * w, p.y * h);
        else ctx.lineTo(p.x * w, p.y * h);
      });
      ctx.closePath();
      ctx.fill();
      
      // Subtle inner edge
      ctx.strokeStyle = lipColors.innerLine;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    
    // 4. Upper lip highlight (cupid's bow)
    if (CUPIDS_BOW.every(idx => f[idx])) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = lipColors.highlight;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const cupidPoints = CUPIDS_BOW.slice(0, 5);
      cupidPoints.forEach((idx, i) => {
        const p = f[idx];
        if (i === 0) ctx.moveTo(p.x * w, p.y * h);
        else ctx.lineTo(p.x * w, p.y * h);
      });
      ctx.stroke();
      ctx.restore();
    }
    
    // 5. Lower lip highlight (center reflection)
    const lowerCenter = f[17]; // Lower lip center
    if (lowerCenter) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.ellipse(lowerCenter.x * w, lowerCenter.y * h - 2, 8, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = lipColors.highlight;
      ctx.fill();
      ctx.restore();
    }
    
    // 6. Subtle corner shadows
    const leftCorner = f[61];
    const rightCorner = f[291];
    if (leftCorner && rightCorner) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = lipColors.corner;
      [leftCorner, rightCorner].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }
  
  // ===== SIMPLE SOLID EYEBROW RENDERING =====
  // Clean, single-layer eyebrow - no multi-layer artifacts
  drawFilledEyebrow(ctx, f, indices, w, h, c) {
    if (!indices || indices.length < 5) return;
    if (!indices.every(idx => f[idx])) return;
    
    const points = indices.map(idx => ({
      x: f[idx].x * w,
      y: f[idx].y * h
    }));
    
    // Calculate eyebrow thickness based on face scale
    const eyebrowWidth = Math.abs(points[points.length - 1].x - points[0].x);
    const thickness = Math.max(4, eyebrowWidth * 0.08);
    
    // Determine eyebrow direction (left vs right)
    const isLeftBrow = points[0].x > points[points.length - 1].x;
    const numPoints = points.length;
    
    // SIMPLE: Draw as a smooth curved line with proper stroke width
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Use quadratic curves for smooth eyebrow arc
    for (let i = 1; i < numPoints - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      
      // Calculate control point for smooth curve
      const cpX = p1.x;
      const cpY = p1.y;
      const endX = (p1.x + p2.x) / 2;
      const endY = (p1.y + p2.y) / 2;
      
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    }
    
    // Connect to last point
    const lastPoint = points[numPoints - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);
    
    // Solid color - no gradient, no layers
    const browColor = this.theme === 'light' ? '#4A3830' : '#C8B8B0';
    
    ctx.strokeStyle = browColor;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
  
  // ===== ENHANCED IRIS & PUPIL RENDERING =====
  // IMPROVED: Now properly clips to eye bounds to prevent overflow
  drawIris(ctx, f, irisIndices, w, h, c) {
    if (!irisIndices || irisIndices.length < 4) return;
    if (!irisIndices.every(idx => f[idx])) return;
    
    // Determine which eye this is and get eye bounds
    const isLeftIris = irisIndices === LEFT_IRIS;
    const eyeIndices = isLeftIris ? LEFT_EYE : RIGHT_EYE;
    
    // Skip if eye landmarks not available
    if (!eyeIndices.every(idx => f[idx])) return;
    
    // Calculate iris center from all 4 landmarks
    const landmarks = irisIndices.map(idx => f[idx]);
    let cx = 0, cy = 0;
    landmarks.forEach(l => { cx += l.x; cy += l.y; });
    cx = (cx / 4) * w;
    cy = (cy / 4) * h;
    
    // Calculate iris radius - REDUCED to fit better within eye
    const distances = landmarks.map(l => 
      Math.hypot((l.x * w) - cx, (l.y * h) - cy)
    );
    let irisRadius = distances.reduce((a, b) => a + b, 0) / 4;
    
    // IMPROVED: Cap iris radius to prevent overflow (max 60% of eye height)
    const eyePoints = eyeIndices.map(idx => ({ x: f[idx].x * w, y: f[idx].y * h }));
    const eyeMinY = Math.min(...eyePoints.map(p => p.y));
    const eyeMaxY = Math.max(...eyePoints.map(p => p.y));
    const eyeHeight = eyeMaxY - eyeMinY;
    const maxIrisRadius = eyeHeight * 0.55;
    irisRadius = Math.min(irisRadius, maxIrisRadius);
    
    // Don't draw if iris is too small (likely closed eye)
    if (irisRadius < 2 || eyeHeight < 4) return;
    
    // Save context for clipping
    ctx.save();
    
    // Create eye-shaped clipping path
    ctx.beginPath();
    eyePoints.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.clip();
    
    // Now draw iris/pupil within the clipped region
    
    // Subtle iris outer glow (contained within eye)
    const irisGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, irisRadius * 1.3);
    irisGrad.addColorStop(0, 'transparent');
    irisGrad.addColorStop(0.6, this.theme === 'light' ? 'rgba(70, 60, 50, 0.08)' : 'rgba(200, 184, 216, 0.08)');
    irisGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, irisRadius * 1.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris colored fill with gradient
    const irisColorGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, irisRadius);
    if (this.theme === 'light') {
      irisColorGrad.addColorStop(0, '#4A5568');
      irisColorGrad.addColorStop(0.4, '#5A6A78');
      irisColorGrad.addColorStop(0.9, '#6A7A88');
      irisColorGrad.addColorStop(1, '#7A8A98');
    } else {
      irisColorGrad.addColorStop(0, '#8A7AA8');
      irisColorGrad.addColorStop(0.4, '#9A8AB8');
      irisColorGrad.addColorStop(0.9, '#A898C0');
      irisColorGrad.addColorStop(1, '#B8A8C8');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
    ctx.fillStyle = irisColorGrad;
    ctx.fill();
    
    // Iris ring outline
    ctx.beginPath();
    ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
    ctx.strokeStyle = this.theme === 'light' ? '#4A5060' : c.lavender;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Pupil (proportional to iris)
    const pupilRadius = irisRadius * 0.38;
    ctx.beginPath();
    ctx.arc(cx, cy, pupilRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.theme === 'light' ? '#1A1510' : '#0A0805';
    ctx.fill();
    
    // Pupil highlight (light reflection) - offset for 3D effect
    ctx.beginPath();
    ctx.arc(cx - pupilRadius * 0.35, cy - pupilRadius * 0.35, pupilRadius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
    
    // Secondary smaller highlight
    ctx.beginPath();
    ctx.arc(cx + pupilRadius * 0.2, cy + pupilRadius * 0.3, pupilRadius * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    
    ctx.restore();
  }
  
  drawPath(ctx, face, indices, w, h, color, lw, closed) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    indices.forEach((idx, i) => {
      const p = face[idx];
      if (i === 0) ctx.moveTo(p.x * w, p.y * h);
      else ctx.lineTo(p.x * w, p.y * h);
    });
    if (closed) ctx.closePath();
    ctx.stroke();
  }
  
  // ==============================================
  // SKELETON
  // ==============================================
  
  drawFullSkeleton(ctx, w, h, c) {
    const p = this.pose;
    const vis = (idx) => (p[idx]?.visibility || 0) > 0.3;
    const spineVis = this.getSpineVisibility();
    
    // Core body (spine + shoulders) - appears first
    if (vis(11) && vis(12)) {
      const neckX = (p[11].x + p[12].x) / 2;
      const neckY = (p[11].y + p[12].y) / 2;
      let headX = neckX, headY = neckY - 0.08;
      if (this.face && this.face.length > 152) {
        headX = this.face[152].x;
        headY = this.face[152].y;
      }
      this.drawBone(ctx, neckX * w, neckY * h, headX * w, headY * h, c.lavender, c, spineVis);
      this.drawJoint(ctx, neckX * w, neckY * h, 5, c, spineVis);
      this.drawBone(ctx, neckX * w, neckY * h, p[11].x * w, p[11].y * h, c.roseBlush, c, this.getBoneVisibility(11, 12));
      this.drawBone(ctx, neckX * w, neckY * h, p[12].x * w, p[12].y * h, c.roseBlush, c, this.getBoneVisibility(11, 12));
    }
    
    // Torso (neck to pelvis)
    if (vis(11) && vis(12) && vis(23) && vis(24)) {
      const neckX = (p[11].x + p[12].x) / 2;
      const neckY = (p[11].y + p[12].y) / 2;
      const pelvisX = (p[23].x + p[24].x) / 2;
      const pelvisY = (p[23].y + p[24].y) / 2;
      this.drawBone(ctx, neckX * w, neckY * h, pelvisX * w, pelvisY * h, c.mintCream, c, spineVis);
      this.drawJoint(ctx, pelvisX * w, pelvisY * h, 5, c, spineVis);
    }
    
    // Hip bones
    if (vis(23) && vis(24)) {
      const pelvisX = (p[23].x + p[24].x) / 2;
      const pelvisY = (p[23].y + p[24].y) / 2;
      this.drawBone(ctx, pelvisX * w, pelvisY * h, p[23].x * w, p[23].y * h, c.peach, c, this.getBoneVisibility(23, 24));
      this.drawBone(ctx, pelvisX * w, pelvisY * h, p[24].x * w, p[24].y * h, c.peach, c, this.getBoneVisibility(23, 24));
      
      // Extended spine continuation below pelvis - for seated users
      const spineEndY = 1.5;
      this.drawBone(ctx, pelvisX * w, pelvisY * h, pelvisX * w, spineEndY * h, c.mintCream, c, spineVis);
    }
    
    // Arms with entrance visibility
    if (vis(11) && vis(13)) this.drawBone(ctx, p[11].x * w, p[11].y * h, p[13].x * w, p[13].y * h, c.powderBlue, c, this.getBoneVisibility(11, 13));
    if (vis(13) && vis(15)) this.drawBone(ctx, p[13].x * w, p[13].y * h, p[15].x * w, p[15].y * h, c.powderBlue, c, this.getBoneVisibility(13, 15));
    if (vis(12) && vis(14)) this.drawBone(ctx, p[12].x * w, p[12].y * h, p[14].x * w, p[14].y * h, c.lavender, c, this.getBoneVisibility(12, 14));
    if (vis(14) && vis(16)) this.drawBone(ctx, p[14].x * w, p[14].y * h, p[16].x * w, p[16].y * h, c.lavender, c, this.getBoneVisibility(14, 16));
    
    // Legs with entrance visibility
    if (vis(23) && vis(25)) this.drawBone(ctx, p[23].x * w, p[23].y * h, p[25].x * w, p[25].y * h, c.mintCream, c, this.getBoneVisibility(23, 25));
    if (vis(25) && vis(27)) this.drawBone(ctx, p[25].x * w, p[25].y * h, p[27].x * w, p[27].y * h, c.mintCream, c, this.getBoneVisibility(25, 27));
    if (vis(27) && vis(31)) this.drawBone(ctx, p[27].x * w, p[27].y * h, p[31].x * w, p[31].y * h, c.mintCream, c, this.getBoneVisibility(27, 31));
    if (vis(24) && vis(26)) this.drawBone(ctx, p[24].x * w, p[24].y * h, p[26].x * w, p[26].y * h, c.roseBlush, c, this.getBoneVisibility(24, 26));
    if (vis(26) && vis(28)) this.drawBone(ctx, p[26].x * w, p[26].y * h, p[28].x * w, p[28].y * h, c.roseBlush, c, this.getBoneVisibility(26, 28));
    if (vis(28) && vis(32)) this.drawBone(ctx, p[28].x * w, p[28].y * h, p[32].x * w, p[32].y * h, c.roseBlush, c, this.getBoneVisibility(28, 32));
    
    this.drawAllJoints(ctx, w, h, 'full', c);
  }
  
  drawUpperSkeleton(ctx, w, h, c) {
    const p = this.pose;
    const vis = (idx) => (p[idx]?.visibility || 0) > 0.3;
    const spineVis = this.getSpineVisibility();
    
    // Core body (spine + neck + shoulders) - appears first
    if (vis(11) && vis(12)) {
      const neckX = (p[11].x + p[12].x) / 2;
      const neckY = (p[11].y + p[12].y) / 2;
      let headX = neckX, headY = neckY - 0.08;
      if (this.face && this.face.length > 152) {
        headX = this.face[152].x;
        headY = this.face[152].y;
      }
      this.drawBone(ctx, neckX * w, neckY * h, headX * w, headY * h, c.lavender, c, spineVis);
      this.drawJoint(ctx, neckX * w, neckY * h, 5, c, spineVis);
      this.drawBone(ctx, neckX * w, neckY * h, p[11].x * w, p[11].y * h, c.roseBlush, c, this.getBoneVisibility(11, 12));
      this.drawBone(ctx, neckX * w, neckY * h, p[12].x * w, p[12].y * h, c.roseBlush, c, this.getBoneVisibility(11, 12));
      
      // Extended spine for seated users
      const spineEndY = 1.5;
      this.drawBone(ctx, neckX * w, neckY * h, neckX * w, spineEndY * h, c.mintCream, c, spineVis);
    }
    
    // Arms with entrance visibility
    if (vis(11) && vis(13)) this.drawBone(ctx, p[11].x * w, p[11].y * h, p[13].x * w, p[13].y * h, c.powderBlue, c, this.getBoneVisibility(11, 13));
    if (vis(13) && vis(15)) this.drawBone(ctx, p[13].x * w, p[13].y * h, p[15].x * w, p[15].y * h, c.powderBlue, c, this.getBoneVisibility(13, 15));
    if (vis(12) && vis(14)) this.drawBone(ctx, p[12].x * w, p[12].y * h, p[14].x * w, p[14].y * h, c.lavender, c, this.getBoneVisibility(12, 14));
    if (vis(14) && vis(16)) this.drawBone(ctx, p[14].x * w, p[14].y * h, p[16].x * w, p[16].y * h, c.lavender, c, this.getBoneVisibility(14, 16));
    
    this.drawAllJoints(ctx, w, h, 'upper', c);
  }
  
  // ===== LOUVRE-QUALITY BONE RENDERING =====
  // Smooth, organic curves instead of harsh straight lines
  drawBone(ctx, x1, y1, x2, y2, color, c, entranceVisibility = 1) {
    // Skip if not visible during entrance
    if (entranceVisibility <= 0) return;
    
    const breathe = 1 + Math.sin(this.time * 1.2) * 0.01;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Apply entrance animation
    ctx.save();
    ctx.globalAlpha = Math.min(1, entranceVisibility * 1.2);
    
    // Calculate midpoint with slight curve offset for organic feel
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Direction perpendicular to bone for slight curve
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    
    // Subtle curve offset (perpendicular) - makes bones feel more organic
    const curveAmount = len * 0.03 * Math.sin(this.time * 0.8);
    const cpX = midX + (-dy / len) * curveAmount;
    const cpY = midY + (dx / len) * curveAmount;
    
    // Parse color
    const r = parseInt(color.slice(1,3), 16);
    const g = parseInt(color.slice(3,5), 16);
    const b = parseInt(color.slice(5,7), 16);
    
    // Entrance animation: draw bone progressively
    const drawProgress = Math.min(1, entranceVisibility * 1.5);
    
    // Outer glow - soft diffuse
    ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 * drawProgress})`;
    ctx.lineWidth = 16 * breathe * drawProgress;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    ctx.stroke();
    
    // Mid glow
    ctx.strokeStyle = `rgba(${r},${g},${b},${0.45 * drawProgress})`;
    ctx.lineWidth = 6 * breathe * drawProgress;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    ctx.stroke();
    
    // Core line - crisp
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * drawProgress;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    ctx.stroke();
    
    ctx.restore();
  }
  
  // ===== LOUVRE-QUALITY JOINT RENDERING =====
  // Elegant, glowing joint points with smooth gradients
  drawJoint(ctx, x, y, r, c, entranceVisibility = 1) {
    // Skip if not visible during entrance animation
    if (entranceVisibility <= 0) return;
    
    const breathe = 1 + Math.sin(this.time * 1.2) * 0.02;
    
    // Apply entrance animation scale
    const entranceScale = this.getEntranceScale(entranceVisibility);
    const radius = r * breathe * entranceScale;
    
    // Apply entrance animation opacity
    ctx.save();
    ctx.globalAlpha = Math.min(1, entranceVisibility * 1.5);
    
    // Large soft outer glow
    const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
    outerGlow.addColorStop(0, c.lavenderGlow);
    outerGlow.addColorStop(0.5, 'rgba(200, 184, 216, 0.1)');
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Main joint body with gradient
    const bodyGrad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius * 1.2);
    bodyGrad.addColorStop(0, c.warmWhite);
    bodyGrad.addColorStop(0.5, c.cream);
    bodyGrad.addColorStop(1, this.theme === 'light' ? '#D8D4D0' : '#A8A098');
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    
    // Highlight dot
    ctx.beginPath();
    ctx.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    
    ctx.restore();
  }
  
  drawAllJoints(ctx, w, h, mode, c) {
    const p = this.pose;
    const vis = (idx) => (p[idx]?.visibility || 0) > 0.3;
    
    let leftHandIdx = -1, rightHandIdx = -1;
    for (let hi = 0; hi < 2; hi++) {
      if (this.hands[hi]) {
        const hw = this.hands[hi][0];
        const dL = vis(15) ? Math.hypot(hw.x - p[15].x, hw.y - p[15].y) : 999;
        const dR = vis(16) ? Math.hypot(hw.x - p[16].x, hw.y - p[16].y) : 999;
        if (dL < dR && dL < 0.15) leftHandIdx = hi;
        else if (dR < 0.15) rightHandIdx = hi;
      }
    }
    
    // Apply entrance animation visibility to each joint
    if (vis(11)) this.drawJoint(ctx, p[11].x * w, p[11].y * h, 8, c, this.getJointVisibility(11));
    if (vis(12)) this.drawJoint(ctx, p[12].x * w, p[12].y * h, 8, c, this.getJointVisibility(12));
    if (vis(13)) this.drawJoint(ctx, p[13].x * w, p[13].y * h, 6, c, this.getJointVisibility(13));
    if (vis(14)) this.drawJoint(ctx, p[14].x * w, p[14].y * h, 6, c, this.getJointVisibility(14));
    if (vis(15) && leftHandIdx === -1) this.drawJoint(ctx, p[15].x * w, p[15].y * h, 5, c, this.getJointVisibility(15));
    if (vis(16) && rightHandIdx === -1) this.drawJoint(ctx, p[16].x * w, p[16].y * h, 5, c, this.getJointVisibility(16));
    
    if (mode === 'full') {
      if (vis(23)) this.drawJoint(ctx, p[23].x * w, p[23].y * h, 7, c, this.getJointVisibility(23));
      if (vis(24)) this.drawJoint(ctx, p[24].x * w, p[24].y * h, 7, c, this.getJointVisibility(24));
      if (vis(25)) this.drawJoint(ctx, p[25].x * w, p[25].y * h, 6, c, this.getJointVisibility(25));
      if (vis(26)) this.drawJoint(ctx, p[26].x * w, p[26].y * h, 6, c, this.getJointVisibility(26));
      if (vis(27)) this.drawJoint(ctx, p[27].x * w, p[27].y * h, 5, c, this.getJointVisibility(27));
      if (vis(28)) this.drawJoint(ctx, p[28].x * w, p[28].y * h, 5, c, this.getJointVisibility(28));
      if (vis(31)) this.drawJoint(ctx, p[31].x * w, p[31].y * h, 4, c, this.getJointVisibility(31));
      if (vis(32)) this.drawJoint(ctx, p[32].x * w, p[32].y * h, 4, c, this.getJointVisibility(32));
    }
  }
  
  drawHands(ctx, w, h, c) {
    const p = this.pose;
    const vis = (idx) => (p[idx]?.visibility || 0) > 0.3;
    const handColors = [c.powderBlue, c.lavender];
    
    // Hands appear after body during entrance (start at 35% progress)
    const handEntranceVis = this.getHandLandmarkVisibility(0); // Use wrist visibility
    if (handEntranceVis <= 0) return; // Skip hands during early entrance
    
    for (let hi = 0; hi < 2; hi++) {
      const hand = this.hands[hi];
      if (!hand || hand.length < 21) continue;
      
      // Apply fade-out alpha for hands leaving frame
      const fadeAlpha = this.handFadeAlpha[hi];
      if (fadeAlpha <= 0) continue; // Fully faded out, skip rendering
      
      ctx.save();
      // Combine entrance visibility with fade alpha
      ctx.globalAlpha *= fadeAlpha * handEntranceVis;
      
      const color = handColors[hi];
      const hw = hand[0]; // Original hand wrist
      const dL = vis(15) ? Math.hypot(hw.x - p[15].x, hw.y - p[15].y) : 999;
      const dR = vis(16) ? Math.hypot(hw.x - p[16].x, hw.y - p[16].y) : 999;
      
      // Determine which pose wrist to use
      let poseWrist = null;
      if (dL < dR && dL < 0.25 && vis(15)) {
        poseWrist = p[15];
      } else if (dR < 0.25 && vis(16)) {
        poseWrist = p[16];
      }
      
      // IMPROVED: Direct anchor to pose wrist - NO blending, NO dragging line
      // The hand's coordinate system is translated so wrist IS the pose wrist
      // This completely eliminates any visual gap or dragging effect
      let anchorWrist = poseWrist ? poseWrist : hw;
      
      // Calculate offset from hand wrist to anchor (pose) wrist
      // This offset is applied to ALL hand landmarks
      const offsetX = anchorWrist.x - hw.x;
      const offsetY = anchorWrist.y - hw.y;
      
      // Create translated hand positions (anchored to pose wrist)
      const translatedHand = hand.map((pt, i) => {
        if (i === 0) {
          // Wrist is exactly at pose wrist position
          return { x: anchorWrist.x, y: anchorWrist.y };
        }
        // All other landmarks are translated by the same offset
        return {
          x: pt.x + offsetX,
          y: pt.y + offsetY
        };
      });
      
      const r = parseInt(color.slice(1,3), 16);
      const g = parseInt(color.slice(3,5), 16);
      const b = parseInt(color.slice(5,7), 16);
      
      // Draw hand connections using translated positions
      HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = translatedHand[i];
        const p2 = translatedHand[j];
        
        // Glow layer
        ctx.strokeStyle = `rgba(${r},${g},${b},0.3)`;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
        
        // Core line
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
      });
      
      // Draw joints using translated positions
      translatedHand.forEach((pt, i) => {
        const isTip = [4,8,12,16,20].includes(i);
        const isWrist = i === 0;
        const sz = isWrist ? 5 : (isTip ? 4 : 2.5);
        this.drawJoint(ctx, pt.x * w, pt.y * h, sz, c);
      });
      
      ctx.restore(); // Restore after applying fade alpha
    }
  }
  
  getStatus() {
    return {
      detected: this.isDetected,
      mode: this.detectionMode,
      fist: this.isFistDetected,
      // Spark ONLY shows when fist is actively closed - clear visual feedback
      spark: this.isFistDetected
    };
  }
}

// ==============================================
// SCANNING GRID
// ==============================================

export class ScanningGrid {
  constructor() { this.time = 0; this.theme = 'dark'; }
  setTheme(t) { this.theme = t; }
  update(dt) { this.time += dt * 0.001; }
  
  render(ctx, w, h) {
    const c = THEMES[this.theme];
    
    ctx.strokeStyle = this.theme === 'light' ? 'rgba(154,136,176,0.05)' : 'rgba(200,184,216,0.03)';
    ctx.lineWidth = 1;
    const gs = 60;
    for (let x = 0; x < w; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    
    const scanY = ((this.time * 0.15) % 1) * h;
    const grad = ctx.createLinearGradient(0, scanY - 100, 0, scanY + 100);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, this.theme === 'light' ? 'rgba(212,132,138,0.06)' : 'rgba(232,180,184,0.04)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    
    const size = 50, margin = 30;
    ctx.strokeStyle = c.dustyRose;
    ctx.lineWidth = 2;
    ctx.lineCap = 'square';
    
    ctx.beginPath();
    ctx.moveTo(margin, margin + size);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + size, margin);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w - margin - size, margin);
    ctx.lineTo(w - margin, margin);
    ctx.lineTo(w - margin, margin + size);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(margin, h - margin - size);
    ctx.lineTo(margin, h - margin);
    ctx.lineTo(margin + size, h - margin);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w - margin - size, h - margin);
    ctx.lineTo(w - margin, h - margin);
    ctx.lineTo(w - margin, h - margin - size);
    ctx.stroke();
  }
}
