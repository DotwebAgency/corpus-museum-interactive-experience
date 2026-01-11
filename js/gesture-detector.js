/**
 * DIGITALE SCHWEIZ — Gesture Detector
 * Schweizerische Eidgenossenschaft
 * 
 * Detects hand gestures from MediaPipe landmarks
 */

export class GestureDetector {
  constructor() {
    this.lastGesture = null;
    this.gestureStartTime = 0;
    this.gestureCooldown = 1000; // ms between gesture triggers
    this.lastTriggerTime = 0;
    
    // Landmark indices
    this.WRIST = 0;
    this.THUMB_TIP = 4;
    this.INDEX_TIP = 8;
    this.MIDDLE_TIP = 12;
    this.RING_TIP = 16;
    this.PINKY_TIP = 20;
    
    this.INDEX_MCP = 5;
    this.MIDDLE_MCP = 9;
    this.RING_MCP = 13;
    this.PINKY_MCP = 17;
  }
  
  /**
   * Calculate distance between two landmarks
   */
  distance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Check if finger is curled (tip close to palm)
   */
  isFingerCurled(landmarks, tipIndex, mcpIndex) {
    const tip = landmarks[tipIndex];
    const mcp = landmarks[mcpIndex];
    const wrist = landmarks[this.WRIST];
    
    if (!tip || !mcp || !wrist) return false;
    
    // Finger is curled if tip is closer to wrist than MCP is
    const tipToWrist = this.distance(tip, wrist);
    const mcpToWrist = this.distance(mcp, wrist);
    
    return tipToWrist < mcpToWrist * 1.2;
  }
  
  /**
   * Detect fist gesture (all fingers curled)
   */
  isFist(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    
    const indexCurled = this.isFingerCurled(landmarks, this.INDEX_TIP, this.INDEX_MCP);
    const middleCurled = this.isFingerCurled(landmarks, this.MIDDLE_TIP, this.MIDDLE_MCP);
    const ringCurled = this.isFingerCurled(landmarks, this.RING_TIP, this.RING_MCP);
    const pinkyCurled = this.isFingerCurled(landmarks, this.PINKY_TIP, this.PINKY_MCP);
    
    return indexCurled && middleCurled && ringCurled && pinkyCurled;
  }
  
  /**
   * Detect open palm gesture (all fingers extended)
   */
  isOpenPalm(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    
    const indexExtended = !this.isFingerCurled(landmarks, this.INDEX_TIP, this.INDEX_MCP);
    const middleExtended = !this.isFingerCurled(landmarks, this.MIDDLE_TIP, this.MIDDLE_MCP);
    const ringExtended = !this.isFingerCurled(landmarks, this.RING_TIP, this.RING_MCP);
    const pinkyExtended = !this.isFingerCurled(landmarks, this.PINKY_TIP, this.PINKY_MCP);
    
    return indexExtended && middleExtended && ringExtended && pinkyExtended;
  }
  
  /**
   * Detect peace sign (index and middle extended, others curled)
   */
  isPeaceSign(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    
    const indexExtended = !this.isFingerCurled(landmarks, this.INDEX_TIP, this.INDEX_MCP);
    const middleExtended = !this.isFingerCurled(landmarks, this.MIDDLE_TIP, this.MIDDLE_MCP);
    const ringCurled = this.isFingerCurled(landmarks, this.RING_TIP, this.RING_MCP);
    const pinkyCurled = this.isFingerCurled(landmarks, this.PINKY_TIP, this.PINKY_MCP);
    
    return indexExtended && middleExtended && ringCurled && pinkyCurled;
  }
  
  /**
   * Detect pointing gesture (only index extended)
   */
  isPointing(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;
    
    const indexExtended = !this.isFingerCurled(landmarks, this.INDEX_TIP, this.INDEX_MCP);
    const middleCurled = this.isFingerCurled(landmarks, this.MIDDLE_TIP, this.MIDDLE_MCP);
    const ringCurled = this.isFingerCurled(landmarks, this.RING_TIP, this.RING_MCP);
    const pinkyCurled = this.isFingerCurled(landmarks, this.PINKY_TIP, this.PINKY_MCP);
    
    return indexExtended && middleCurled && ringCurled && pinkyCurled;
  }
  
  /**
   * Main gesture detection method
   * Returns gesture name if detected and cooldown passed
   */
  detect(handLandmarks) {
    if (!handLandmarks || handLandmarks.length === 0) {
      this.lastGesture = null;
      return null;
    }
    
    const now = performance.now();
    
    // Check cooldown
    if (now - this.lastTriggerTime < this.gestureCooldown) {
      return null;
    }
    
    // Use first hand for gesture detection
    const landmarks = handLandmarks[0];
    
    let detectedGesture = null;
    
    if (this.isFist(landmarks)) {
      detectedGesture = 'fist';
    } else if (this.isPeaceSign(landmarks)) {
      detectedGesture = 'peace';
    } else if (this.isPointing(landmarks)) {
      detectedGesture = 'point';
    } else if (this.isOpenPalm(landmarks)) {
      detectedGesture = 'palm';
    }
    
    // Gesture changed
    if (detectedGesture !== this.lastGesture) {
      this.lastGesture = detectedGesture;
      
      if (detectedGesture) {
        this.lastTriggerTime = now;
        return detectedGesture;
      }
    }
    
    return null;
  }
}
