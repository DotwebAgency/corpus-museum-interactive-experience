/**
 * DIGITALE IDENTITÄT SCHWEIZ — Full Body Skeleton Renderer
 * Schweizerische Eidgenossenschaft
 * 
 * Clean full-body skeleton visualization with outer aura shell
 * No camera feed visible - pure digital twin representation
 */

// ==============================================
// POSE LANDMARK INDICES (MediaPipe Pose - 33 points)
// ==============================================

const POSE = {
  // Face
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  
  // Upper body
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  
  // Lower body
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32
};

// Skeleton connections (bone structure)
const SKELETON_CONNECTIONS = [
  // Torso
  [POSE.LEFT_SHOULDER, POSE.RIGHT_SHOULDER],
  [POSE.LEFT_SHOULDER, POSE.LEFT_HIP],
  [POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP],
  [POSE.LEFT_HIP, POSE.RIGHT_HIP],
  
  // Left arm
  [POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW],
  [POSE.LEFT_ELBOW, POSE.LEFT_WRIST],
  [POSE.LEFT_WRIST, POSE.LEFT_PINKY],
  [POSE.LEFT_WRIST, POSE.LEFT_INDEX],
  [POSE.LEFT_WRIST, POSE.LEFT_THUMB],
  
  // Right arm
  [POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW],
  [POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST],
  [POSE.RIGHT_WRIST, POSE.RIGHT_PINKY],
  [POSE.RIGHT_WRIST, POSE.RIGHT_INDEX],
  [POSE.RIGHT_WRIST, POSE.RIGHT_THUMB],
  
  // Left leg
  [POSE.LEFT_HIP, POSE.LEFT_KNEE],
  [POSE.LEFT_KNEE, POSE.LEFT_ANKLE],
  [POSE.LEFT_ANKLE, POSE.LEFT_HEEL],
  [POSE.LEFT_ANKLE, POSE.LEFT_FOOT_INDEX],
  [POSE.LEFT_HEEL, POSE.LEFT_FOOT_INDEX],
  
  // Right leg
  [POSE.RIGHT_HIP, POSE.RIGHT_KNEE],
  [POSE.RIGHT_KNEE, POSE.RIGHT_ANKLE],
  [POSE.RIGHT_ANKLE, POSE.RIGHT_HEEL],
  [POSE.RIGHT_ANKLE, POSE.RIGHT_FOOT_INDEX],
  [POSE.RIGHT_HEEL, POSE.RIGHT_FOOT_INDEX],
  
  // Head/neck
  [POSE.LEFT_SHOULDER, POSE.LEFT_EAR],
  [POSE.RIGHT_SHOULDER, POSE.RIGHT_EAR],
  [POSE.LEFT_EAR, POSE.LEFT_EYE],
  [POSE.RIGHT_EAR, POSE.RIGHT_EYE],
  [POSE.LEFT_EYE, POSE.NOSE],
  [POSE.RIGHT_EYE, POSE.NOSE]
];

// Face outline for head shape
const FACE_OUTLINE = [
  POSE.LEFT_EAR, POSE.LEFT_EYE, POSE.NOSE, POSE.RIGHT_EYE, POSE.RIGHT_EAR
];

// Major joints (larger dots)
const MAJOR_JOINTS = [
  POSE.LEFT_SHOULDER, POSE.RIGHT_SHOULDER,
  POSE.LEFT_ELBOW, POSE.RIGHT_ELBOW,
  POSE.LEFT_WRIST, POSE.RIGHT_WRIST,
  POSE.LEFT_HIP, POSE.RIGHT_HIP,
  POSE.LEFT_KNEE, POSE.RIGHT_KNEE,
  POSE.LEFT_ANKLE, POSE.RIGHT_ANKLE,
  POSE.NOSE
];

// Hand connections for detailed hands
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],     // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],     // Index
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17]           // Palm
];

// ==============================================
// SWISS FEDERAL COLORS
// ==============================================

const COLORS = {
  bundesrot: '#DC0018',
  bundesrotRgb: { r: 220, g: 0, b: 24 },
  white: '#FFFFFF',
  skeleton: '#DC0018',
  skeletonGlow: 'rgba(220, 0, 24, 0.4)',
  aura: 'rgba(220, 0, 24, 0.08)',
  auraStroke: 'rgba(220, 0, 24, 0.15)',
  joint: '#FFFFFF',
  jointGlow: 'rgba(255, 255, 255, 0.5)'
};

// ==============================================
// BODY SKELETON RENDERER
// ==============================================

export class BodySkeletonRenderer {
  constructor() {
    this.smoothedLandmarks = null;
    this.smoothedHands = [null, null];
    this.smoothingFactor = 0.4; // Higher = smoother but more lag
    this.auraOffset = 25; // Pixels for aura shell
    this.isDetected = false;
    this.detectionConfidence = 0;
  }
  
  /**
   * Update with new tracking results
   */
  update(poseLandmarks, handLandmarks) {
    // Smooth body pose landmarks
    if (poseLandmarks && poseLandmarks.length > 0) {
      const newLandmarks = poseLandmarks[0];
      
      if (!this.smoothedLandmarks) {
        this.smoothedLandmarks = JSON.parse(JSON.stringify(newLandmarks));
      } else {
        // Apply exponential smoothing
        for (let i = 0; i < newLandmarks.length; i++) {
          this.smoothedLandmarks[i].x += (newLandmarks[i].x - this.smoothedLandmarks[i].x) * this.smoothingFactor;
          this.smoothedLandmarks[i].y += (newLandmarks[i].y - this.smoothedLandmarks[i].y) * this.smoothingFactor;
          this.smoothedLandmarks[i].z = newLandmarks[i].z || 0;
          this.smoothedLandmarks[i].visibility = newLandmarks[i].visibility || 1;
        }
      }
      
      this.isDetected = true;
      this.detectionConfidence = this.calculateConfidence(newLandmarks);
    } else {
      this.isDetected = false;
      this.detectionConfidence = 0;
    }
    
    // Smooth hand landmarks
    if (handLandmarks) {
      for (let h = 0; h < 2; h++) {
        if (handLandmarks[h]) {
          if (!this.smoothedHands[h]) {
            this.smoothedHands[h] = JSON.parse(JSON.stringify(handLandmarks[h]));
          } else {
            for (let i = 0; i < handLandmarks[h].length; i++) {
              this.smoothedHands[h][i].x += (handLandmarks[h][i].x - this.smoothedHands[h][i].x) * this.smoothingFactor;
              this.smoothedHands[h][i].y += (handLandmarks[h][i].y - this.smoothedHands[h][i].y) * this.smoothingFactor;
            }
          }
        }
      }
    }
  }
  
  calculateConfidence(landmarks) {
    let total = 0;
    let count = 0;
    for (const lm of landmarks) {
      if (lm.visibility !== undefined) {
        total += lm.visibility;
        count++;
      }
    }
    return count > 0 ? (total / count) * 100 : 0;
  }
  
  /**
   * Main render method
   */
  render(ctx, width, height) {
    if (!this.smoothedLandmarks || !this.isDetected) return;
    
    ctx.save();
    
    // Mirror the display
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    
    // Layer 1: Outer aura shell (low opacity)
    this.renderAuraShell(ctx, width, height);
    
    // Layer 2: Skeleton bones
    this.renderSkeleton(ctx, width, height);
    
    // Layer 3: Joint nodes
    this.renderJoints(ctx, width, height);
    
    // Layer 4: Detailed hands (if available)
    this.renderDetailedHands(ctx, width, height);
    
    ctx.restore();
  }
  
  /**
   * Render outer aura/shell effect
   */
  renderAuraShell(ctx, width, height) {
    const landmarks = this.smoothedLandmarks;
    const offset = this.auraOffset;
    
    // Create body silhouette path
    ctx.beginPath();
    
    // Head circle
    const nose = landmarks[POSE.NOSE];
    const leftEar = landmarks[POSE.LEFT_EAR];
    const rightEar = landmarks[POSE.RIGHT_EAR];
    
    if (nose && leftEar && rightEar) {
      const headCenterX = nose.x * width;
      const headCenterY = (nose.y - 0.05) * height;
      const headRadius = Math.abs(leftEar.x - rightEar.x) * width * 0.8 + offset;
      
      ctx.arc(headCenterX, headCenterY, headRadius, 0, Math.PI * 2);
    }
    
    ctx.fillStyle = COLORS.aura;
    ctx.fill();
    
    // Body shell - connect major points with offset
    const bodyPoints = [
      landmarks[POSE.LEFT_SHOULDER],
      landmarks[POSE.RIGHT_SHOULDER],
      landmarks[POSE.RIGHT_HIP],
      landmarks[POSE.LEFT_HIP]
    ];
    
    if (bodyPoints.every(p => p)) {
      ctx.beginPath();
      
      // Create expanded polygon
      const centerX = bodyPoints.reduce((sum, p) => sum + p.x, 0) / 4 * width;
      const centerY = bodyPoints.reduce((sum, p) => sum + p.y, 0) / 4 * height;
      
      bodyPoints.forEach((p, i) => {
        const x = p.x * width;
        const y = p.y * height;
        
        // Expand outward from center
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const expandX = x + (dx / dist) * offset;
        const expandY = y + (dy / dist) * offset;
        
        if (i === 0) {
          ctx.moveTo(expandX, expandY);
        } else {
          ctx.lineTo(expandX, expandY);
        }
      });
      
      ctx.closePath();
      ctx.fillStyle = COLORS.aura;
      ctx.fill();
      ctx.strokeStyle = COLORS.auraStroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Arm aura tubes
    this.renderLimbAura(ctx, width, height, [
      POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW, POSE.LEFT_WRIST
    ], offset * 0.6);
    
    this.renderLimbAura(ctx, width, height, [
      POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST
    ], offset * 0.6);
    
    // Leg aura tubes
    this.renderLimbAura(ctx, width, height, [
      POSE.LEFT_HIP, POSE.LEFT_KNEE, POSE.LEFT_ANKLE
    ], offset * 0.7);
    
    this.renderLimbAura(ctx, width, height, [
      POSE.RIGHT_HIP, POSE.RIGHT_KNEE, POSE.RIGHT_ANKLE
    ], offset * 0.7);
  }
  
  renderLimbAura(ctx, width, height, jointIndices, thickness) {
    const landmarks = this.smoothedLandmarks;
    const points = jointIndices.map(i => landmarks[i]).filter(p => p && p.visibility > 0.5);
    
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.lineWidth = thickness * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = COLORS.aura;
    
    ctx.moveTo(points[0].x * width, points[0].y * height);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * width, points[i].y * height);
    }
    ctx.stroke();
  }
  
  /**
   * Render skeleton bones
   */
  renderSkeleton(ctx, width, height) {
    const landmarks = this.smoothedLandmarks;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    SKELETON_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      
      if (!p1 || !p2) return;
      if (p1.visibility < 0.5 || p2.visibility < 0.5) return;
      
      const x1 = p1.x * width;
      const y1 = p1.y * height;
      const x2 = p2.x * width;
      const y2 = p2.y * height;
      
      // Glow layer
      ctx.strokeStyle = COLORS.skeletonGlow;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Main bone
      ctx.strokeStyle = COLORS.skeleton;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  }
  
  /**
   * Render joint nodes
   */
  renderJoints(ctx, width, height) {
    const landmarks = this.smoothedLandmarks;
    
    landmarks.forEach((lm, i) => {
      if (!lm || lm.visibility < 0.5) return;
      
      const x = lm.x * width;
      const y = lm.y * height;
      const isMajor = MAJOR_JOINTS.includes(i);
      const radius = isMajor ? 8 : 4;
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.skeletonGlow;
      ctx.fill();
      
      // Main joint (Swiss red)
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.skeleton;
      ctx.fill();
      
      // White center highlight
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.joint;
      ctx.fill();
    });
  }
  
  /**
   * Render detailed hand skeletons
   */
  renderDetailedHands(ctx, width, height) {
    this.smoothedHands.forEach(hand => {
      if (!hand) return;
      
      // Draw connections
      ctx.lineCap = 'round';
      
      HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = hand[i];
        const p2 = hand[j];
        if (!p1 || !p2) return;
        
        const x1 = p1.x * width;
        const y1 = p1.y * height;
        const x2 = p2.x * width;
        const y2 = p2.y * height;
        
        // Glow
        ctx.strokeStyle = COLORS.skeletonGlow;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Line
        ctx.strokeStyle = COLORS.skeleton;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
      
      // Draw joints
      hand.forEach((lm, i) => {
        const x = lm.x * width;
        const y = lm.y * height;
        const isFingertip = [4, 8, 12, 16, 20].includes(i);
        const radius = isFingertip ? 5 : 3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.skeleton;
        ctx.fill();
        
        if (isFingertip) {
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = COLORS.joint;
          ctx.fill();
        }
      });
    });
  }
  
  /**
   * Get detection status
   */
  getStatus() {
    return {
      detected: this.isDetected,
      confidence: this.detectionConfidence,
      landmarks: this.smoothedLandmarks ? 33 : 0,
      hands: this.smoothedHands.filter(h => h).length
    };
  }
}

// ==============================================
// SCANNING GRID OVERLAY
// ==============================================

export class ScanningGrid {
  constructor() {
    this.time = 0;
    this.gridSize = 40;
  }
  
  update(deltaTime) {
    this.time += deltaTime * 0.001;
  }
  
  render(ctx, width, height) {
    ctx.save();
    
    // Scanning line
    const scanY = ((this.time * 0.3) % 1) * height;
    
    const gradient = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
    gradient.addColorStop(0, 'rgba(220, 0, 24, 0)');
    gradient.addColorStop(0.5, 'rgba(220, 0, 24, 0.1)');
    gradient.addColorStop(1, 'rgba(220, 0, 24, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Grid lines
    ctx.strokeStyle = 'rgba(220, 0, 24, 0.05)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Corner brackets
    this.drawCornerBrackets(ctx, width, height);
    
    ctx.restore();
  }
  
  drawCornerBrackets(ctx, width, height) {
    const size = 50;
    const margin = 30;
    const lineWidth = 3;
    
    ctx.strokeStyle = COLORS.bundesrot;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'square';
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(margin, margin + size);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + size, margin);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - margin - size, margin);
    ctx.lineTo(width - margin, margin);
    ctx.lineTo(width - margin, margin + size);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - size);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(margin + size, height - margin);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - margin - size, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.lineTo(width - margin, height - margin - size);
    ctx.stroke();
  }
}

