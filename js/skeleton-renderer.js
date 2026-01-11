/**
 * DIGITALE SCHWEIZ — Skeleton Renderer
 * Schweizerische Eidgenossenschaft
 * 
 * Renders hand skeletons and face mesh overlays
 */

import { hexToRgba, SWISS_COLORS } from './themes.js';

// Hand landmark connections
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm
  [5, 9], [9, 13], [13, 17]
];

// Fingertip indices
const FINGERTIPS = [4, 8, 12, 16, 20];
const WRIST = 0;

// Face landmark groups
const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
const LIPS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];

export class SkeletonRenderer {
  constructor(theme) {
    this.theme = theme;
    
    // Swiss Federal color scheme
    this.colors = {
      handLeft: SWISS_COLORS.red,
      handRight: SWISS_COLORS.blue,
      faceOval: SWISS_COLORS.gray600,
      eyes: SWISS_COLORS.blue,
      lips: SWISS_COLORS.red,
      joints: SWISS_COLORS.white,
      fingertips: SWISS_COLORS.red
    };
  }
  
  setTheme(theme) {
    this.theme = theme;
  }
  
  /**
   * Draw hand skeleton with Swiss Federal styling
   */
  drawHandSkeleton(ctx, landmarks, width, height, handedness = 'Right') {
    if (!landmarks || landmarks.length === 0) return;
    
    const isLeft = handedness === 'Left';
    const baseColor = isLeft ? this.colors.handLeft : this.colors.handRight;
    
    // Draw connections with glow
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    HAND_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      
      if (!p1 || !p2) return;
      
      const x1 = p1.x * width;
      const y1 = p1.y * height;
      const x2 = p2.x * width;
      const y2 = p2.y * height;
      
      // Glow layer
      ctx.strokeStyle = hexToRgba(baseColor, 0.3);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Main line
      ctx.strokeStyle = hexToRgba(baseColor, 0.9);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    
    // Draw joints
    landmarks.forEach((landmark, i) => {
      const x = landmark.x * width;
      const y = landmark.y * height;
      
      const isFingertip = FINGERTIPS.includes(i);
      const isWrist = i === WRIST;
      
      let radius = 3;
      let color = baseColor;
      
      if (isFingertip) {
        radius = 5;
        color = this.colors.fingertips;
      } else if (isWrist) {
        radius = 6;
        color = baseColor;
      }
      
      // Glow
      ctx.beginPath();
      ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, 0.3);
      ctx.fill();
      
      // Main dot
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, 0.9);
      ctx.fill();
      
      // Center highlight
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(this.colors.joints, 0.8);
      ctx.fill();
    });
  }
  
  /**
   * Draw face mesh with Swiss Federal styling
   */
  drawFaceMesh(ctx, landmarks, width, height) {
    if (!landmarks || landmarks.length === 0) return;
    
    // Draw face oval
    this.drawLandmarkPath(ctx, landmarks, FACE_OVAL, width, height, this.colors.faceOval, 1.5, true);
    
    // Draw eyes
    this.drawLandmarkPath(ctx, landmarks, LEFT_EYE, width, height, this.colors.eyes, 1.5, true);
    this.drawLandmarkPath(ctx, landmarks, RIGHT_EYE, width, height, this.colors.eyes, 1.5, true);
    
    // Draw lips
    this.drawLandmarkPath(ctx, landmarks, LIPS, width, height, this.colors.lips, 1.5, true);
    
    // Draw key landmark dots
    const keyPoints = [
      1,   // Nose tip
      33,  // Left eye inner
      263, // Right eye inner
      61,  // Left mouth corner
      291, // Right mouth corner
      10,  // Forehead
      152  // Chin
    ];
    
    keyPoints.forEach(i => {
      const landmark = landmarks[i];
      if (!landmark) return;
      
      const x = landmark.x * width;
      const y = landmark.y * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(SWISS_COLORS.red, 0.8);
      ctx.fill();
    });
  }
  
  /**
   * Helper: Draw a path through landmark indices
   */
  drawLandmarkPath(ctx, landmarks, indices, width, height, color, lineWidth = 1.5, closed = false) {
    if (indices.length < 2) return;
    
    ctx.strokeStyle = hexToRgba(color, 0.7);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    
    const first = landmarks[indices[0]];
    if (!first) return;
    
    ctx.moveTo(first.x * width, first.y * height);
    
    for (let i = 1; i < indices.length; i++) {
      const landmark = landmarks[indices[i]];
      if (!landmark) continue;
      ctx.lineTo(landmark.x * width, landmark.y * height);
    }
    
    if (closed) {
      ctx.closePath();
    }
    
    ctx.stroke();
  }
}
