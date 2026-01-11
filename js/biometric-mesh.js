/**
 * DIGITALE IDENTITÄT SCHWEIZ — Biometric Mesh Renderer
 * Schweizerische Eidgenossenschaft
 * 
 * Clean, precise mesh visualization for face and hand landmarks
 * Designed for trust and clarity, not chaos
 */

// ==============================================
// FACE LANDMARK GROUPS (Curated for aesthetics)
// ==============================================

// Face oval contour
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
];

// Left eyebrow
const LEFT_EYEBROW = [276, 283, 282, 295, 285];

// Right eyebrow  
const RIGHT_EYEBROW = [46, 53, 52, 65, 55];

// Left eye contour
const LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];

// Right eye contour
const RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];

// Nose bridge and tip
const NOSE = [168, 6, 197, 195, 5, 4, 1, 19, 94, 2];

// Upper lip
const UPPER_LIP = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];

// Lower lip
const LOWER_LIP = [146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61];

// Hand connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],     // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],     // Index
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17]           // Palm
];

const FINGERTIPS = [4, 8, 12, 16, 20];

// ==============================================
// SWISS FEDERAL COLORS
// ==============================================

const COLORS = {
  bundesrot: '#DC0018',
  bundesrotLight: 'rgba(220, 0, 24, 0.6)',
  bundesrotGlow: 'rgba(220, 0, 24, 0.3)',
  success: '#00843D',
  successLight: 'rgba(0, 132, 61, 0.6)',
  white: '#FFFFFF',
  anthrazit: '#1A1A1A'
};

// ==============================================
// BIOMETRIC MESH RENDERER CLASS
// ==============================================

export class BiometricMeshRenderer {
  constructor() {
    this.state = 'idle'; // idle, detecting, analyzing, verified
    this.animationProgress = 0;
    this.meshOpacity = 0;
    this.lineDrawProgress = 0;
    this.isVerified = false;
    this.lastUpdateTime = 0;
    
    // For smooth animations
    this.targetMeshOpacity = 0;
    this.targetLineProgress = 0;
  }
  
  /**
   * Set the current state
   */
  setState(state) {
    this.state = state;
    
    switch (state) {
      case 'idle':
        this.targetMeshOpacity = 0;
        this.targetLineProgress = 0;
        this.isVerified = false;
        break;
      case 'detecting':
        this.targetMeshOpacity = 0.3;
        this.targetLineProgress = 0;
        break;
      case 'analyzing':
        this.targetMeshOpacity = 1;
        this.targetLineProgress = 1;
        break;
      case 'verified':
        this.targetMeshOpacity = 1;
        this.targetLineProgress = 1;
        this.isVerified = true;
        break;
    }
  }
  
  /**
   * Update animation state
   */
  update(deltaTime) {
    const lerpSpeed = 0.05;
    
    // Smooth opacity transition
    this.meshOpacity += (this.targetMeshOpacity - this.meshOpacity) * lerpSpeed;
    
    // Smooth line draw progress
    this.lineDrawProgress += (this.targetLineProgress - this.lineDrawProgress) * lerpSpeed;
    
    // Animation progress for effects
    this.animationProgress += deltaTime * 0.001;
  }
  
  /**
   * Render the complete biometric overlay
   */
  render(ctx, faceLandmarks, handLandmarks, width, height) {
    ctx.save();
    
    // Mirror the canvas for natural feel
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    
    // Render face mesh
    if (faceLandmarks && faceLandmarks.length > 0) {
      this.renderFaceMesh(ctx, faceLandmarks[0], width, height);
    }
    
    // Render hand meshes
    if (handLandmarks && handLandmarks.length > 0) {
      handLandmarks.forEach((hand, index) => {
        this.renderHandMesh(ctx, hand, width, height, index);
      });
    }
    
    ctx.restore();
  }
  
  /**
   * Render face biometric mesh
   */
  renderFaceMesh(ctx, landmarks, width, height) {
    if (this.meshOpacity < 0.01) return;
    
    const color = this.isVerified ? COLORS.success : COLORS.bundesrot;
    const colorLight = this.isVerified ? COLORS.successLight : COLORS.bundesrotLight;
    const colorGlow = this.isVerified ? 'rgba(0, 132, 61, 0.3)' : COLORS.bundesrotGlow;
    
    // Set base styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw regions in order
    const regions = [
      { points: FACE_OVAL, closed: true, width: 2 },
      { points: LEFT_EYEBROW, closed: false, width: 1.5 },
      { points: RIGHT_EYEBROW, closed: false, width: 1.5 },
      { points: LEFT_EYE, closed: true, width: 1.5 },
      { points: RIGHT_EYE, closed: true, width: 1.5 },
      { points: NOSE, closed: false, width: 1.5 },
      { points: UPPER_LIP, closed: false, width: 1.5 },
      { points: LOWER_LIP, closed: false, width: 1.5 }
    ];
    
    regions.forEach((region, regionIndex) => {
      // Calculate how much of this region to draw based on progress
      const regionStart = regionIndex / regions.length;
      const regionEnd = (regionIndex + 1) / regions.length;
      const regionProgress = Math.max(0, Math.min(1, 
        (this.lineDrawProgress - regionStart) / (regionEnd - regionStart)
      ));
      
      if (regionProgress < 0.01) return;
      
      const points = region.points.map(i => landmarks[i]).filter(p => p);
      if (points.length < 2) return;
      
      // Draw glow layer
      ctx.strokeStyle = colorGlow;
      ctx.lineWidth = region.width + 4;
      ctx.globalAlpha = this.meshOpacity * 0.5;
      this.drawPath(ctx, points, width, height, region.closed, regionProgress);
      
      // Draw main line
      ctx.strokeStyle = colorLight;
      ctx.lineWidth = region.width;
      ctx.globalAlpha = this.meshOpacity;
      this.drawPath(ctx, points, width, height, region.closed, regionProgress);
    });
    
    // Draw key landmark dots
    if (this.lineDrawProgress > 0.8) {
      const keyPoints = [1, 33, 263, 61, 291, 10, 152]; // Nose, eyes, mouth, forehead, chin
      const dotOpacity = Math.min(1, (this.lineDrawProgress - 0.8) * 5);
      
      keyPoints.forEach(i => {
        const p = landmarks[i];
        if (!p) return;
        
        const x = p.x * width;
        const y = p.y * height;
        
        // Glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = colorGlow;
        ctx.globalAlpha = this.meshOpacity * dotOpacity * 0.5;
        ctx.fill();
        
        // Dot
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = this.meshOpacity * dotOpacity;
        ctx.fill();
      });
    }
    
    ctx.globalAlpha = 1;
  }
  
  /**
   * Render hand biometric mesh
   */
  renderHandMesh(ctx, landmarks, width, height, handIndex) {
    if (this.meshOpacity < 0.01) return;
    
    const color = this.isVerified ? COLORS.success : COLORS.bundesrot;
    const colorLight = this.isVerified ? COLORS.successLight : COLORS.bundesrotLight;
    const colorGlow = this.isVerified ? 'rgba(0, 132, 61, 0.3)' : COLORS.bundesrotGlow;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw connections
    HAND_CONNECTIONS.forEach(([i, j], connIndex) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      if (!p1 || !p2) return;
      
      // Staggered draw progress
      const connectionProgress = Math.max(0, Math.min(1,
        (this.lineDrawProgress - connIndex * 0.03) * 1.5
      ));
      if (connectionProgress < 0.01) return;
      
      const x1 = p1.x * width;
      const y1 = p1.y * height;
      const x2 = p2.x * width;
      const y2 = p2.y * height;
      
      // Interpolate based on progress
      const endX = x1 + (x2 - x1) * connectionProgress;
      const endY = y1 + (y2 - y1) * connectionProgress;
      
      // Glow
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = colorGlow;
      ctx.lineWidth = 6;
      ctx.globalAlpha = this.meshOpacity * 0.5;
      ctx.stroke();
      
      // Line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = colorLight;
      ctx.lineWidth = 2;
      ctx.globalAlpha = this.meshOpacity;
      ctx.stroke();
    });
    
    // Draw fingertip dots
    if (this.lineDrawProgress > 0.5) {
      const dotOpacity = Math.min(1, (this.lineDrawProgress - 0.5) * 2);
      
      FINGERTIPS.forEach(i => {
        const p = landmarks[i];
        if (!p) return;
        
        const x = p.x * width;
        const y = p.y * height;
        
        // Glow
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = colorGlow;
        ctx.globalAlpha = this.meshOpacity * dotOpacity * 0.5;
        ctx.fill();
        
        // Dot
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = this.meshOpacity * dotOpacity;
        ctx.fill();
      });
      
      // Wrist dot
      const wrist = landmarks[0];
      if (wrist) {
        ctx.beginPath();
        ctx.arc(wrist.x * width, wrist.y * height, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = this.meshOpacity * dotOpacity;
        ctx.fill();
      }
    }
    
    ctx.globalAlpha = 1;
  }
  
  /**
   * Draw a path through points with optional closure
   */
  drawPath(ctx, points, width, height, closed, progress) {
    if (points.length < 2) return;
    
    // Calculate total path length for progress animation
    const totalPoints = closed ? points.length + 1 : points.length;
    const pointsToDraw = Math.floor(totalPoints * progress);
    
    if (pointsToDraw < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x * width, points[0].y * height);
    
    for (let i = 1; i < pointsToDraw; i++) {
      const idx = i % points.length;
      ctx.lineTo(points[idx].x * width, points[idx].y * height);
    }
    
    if (closed && progress >= 1) {
      ctx.closePath();
    }
    
    ctx.stroke();
  }
  
  /**
   * Render scanning line effect
   */
  renderScanLine(ctx, width, height) {
    const scanY = (Math.sin(this.animationProgress * 2) * 0.5 + 0.5) * height;
    
    // Gradient line
    const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
    gradient.addColorStop(0, 'rgba(220, 0, 24, 0)');
    gradient.addColorStop(0.5, 'rgba(220, 0, 24, 0.3)');
    gradient.addColorStop(1, 'rgba(220, 0, 24, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, scanY - 50, width, 100);
    
    // Scan line
    ctx.strokeStyle = COLORS.bundesrotLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(width, scanY);
    ctx.stroke();
  }
}

// ==============================================
// SCAN LINE OVERLAY (for detection phase)
// ==============================================

export class ScanOverlay {
  constructor() {
    this.progress = 0;
    this.isActive = false;
  }
  
  start() {
    this.isActive = true;
    this.progress = 0;
  }
  
  stop() {
    this.isActive = false;
  }
  
  update(deltaTime) {
    if (this.isActive) {
      this.progress += deltaTime * 0.001;
    }
  }
  
  render(ctx, width, height) {
    if (!this.isActive) return;
    
    // Moving scan line
    const scanY = ((this.progress * 0.5) % 1) * height;
    
    // Gradient
    const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    gradient.addColorStop(0, 'rgba(220, 0, 24, 0)');
    gradient.addColorStop(0.5, 'rgba(220, 0, 24, 0.15)');
    gradient.addColorStop(1, 'rgba(220, 0, 24, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Sharp line
    ctx.strokeStyle = 'rgba(220, 0, 24, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(width, scanY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Corner brackets
    const bracketSize = 60;
    const bracketWidth = 3;
    const margin = 40;
    
    ctx.strokeStyle = COLORS.bundesrot;
    ctx.lineWidth = bracketWidth;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(margin, margin + bracketSize);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + bracketSize, margin);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - margin - bracketSize, margin);
    ctx.lineTo(width - margin, margin);
    ctx.lineTo(width - margin, margin + bracketSize);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - bracketSize);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(margin + bracketSize, height - margin);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - margin - bracketSize, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.lineTo(width - margin, height - margin - bracketSize);
    ctx.stroke();
  }
}

