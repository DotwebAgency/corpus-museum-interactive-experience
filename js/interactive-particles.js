/**
 * CORPUS — Interactive Particle Physics System
 * AWWWARDS-Quality Body-Reactive Particles
 * 
 * Particles respond to body movement:
 * - Deflect away from hands
 * - Get pushed by fast movements
 * - Swirl around moving body parts
 */

// ==============================================
// LANDMARK VELOCITY TRACKER
// ==============================================

export class LandmarkVelocityTracker {
  constructor(historyLength = 3) {
    this.historyLength = historyLength;
    this.poseHistory = [];
    this.handHistory = [[], []]; // Two hands
    this.lastTimestamp = 0;
    this.smoothFactor = 0.3;
    
    // Cached velocities
    this.poseVelocities = null;
    this.handVelocities = [null, null];
  }
  
  update(pose, hands, timestamp) {
    const dt = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    
    if (dt <= 0 || dt > 200) return; // Skip invalid or first frame
    
    const dtSeconds = dt / 1000;
    
    // Update pose velocity
    if (pose && pose.length >= 33) {
      if (this.poseHistory.length > 0) {
        const prevPose = this.poseHistory[this.poseHistory.length - 1];
        this.poseVelocities = pose.map((p, i) => {
          const prev = prevPose[i];
          if (!prev || !p) return { x: 0, y: 0, speed: 0 };
          
          const vx = (p.x - prev.x) / dtSeconds;
          const vy = (p.y - prev.y) / dtSeconds;
          return {
            x: vx,
            y: vy,
            speed: Math.hypot(vx, vy)
          };
        });
      }
      
      this.poseHistory.push(pose.map(p => ({ x: p.x, y: p.y })));
      if (this.poseHistory.length > this.historyLength) {
        this.poseHistory.shift();
      }
    }
    
    // Update hand velocities
    for (let h = 0; h < 2; h++) {
      const hand = hands && hands[h];
      if (hand && hand.length >= 21) {
        if (this.handHistory[h].length > 0) {
          const prevHand = this.handHistory[h][this.handHistory[h].length - 1];
          this.handVelocities[h] = hand.map((p, i) => {
            const prev = prevHand[i];
            if (!prev || !p) return { x: 0, y: 0, speed: 0 };
            
            const vx = (p.x - prev.x) / dtSeconds;
            const vy = (p.y - prev.y) / dtSeconds;
            return {
              x: vx,
              y: vy,
              speed: Math.hypot(vx, vy)
            };
          });
        }
        
        this.handHistory[h].push(hand.map(p => ({ x: p.x, y: p.y })));
        if (this.handHistory[h].length > this.historyLength) {
          this.handHistory[h].shift();
        }
      } else {
        this.handVelocities[h] = null;
        this.handHistory[h] = [];
      }
    }
  }
  
  getPoseVelocity(index) {
    if (!this.poseVelocities || index >= this.poseVelocities.length) {
      return { x: 0, y: 0, speed: 0 };
    }
    return this.poseVelocities[index];
  }
  
  getHandVelocity(handIndex, landmarkIndex) {
    const vel = this.handVelocities[handIndex];
    if (!vel || landmarkIndex >= vel.length) {
      return { x: 0, y: 0, speed: 0 };
    }
    return vel[landmarkIndex];
  }
  
  // Get average velocity for a hand (palm area)
  getAverageHandVelocity(handIndex) {
    const vel = this.handVelocities[handIndex];
    if (!vel) return { x: 0, y: 0, speed: 0 };
    
    // Average of wrist and MCP joints
    const indices = [0, 5, 9, 13, 17];
    let sumX = 0, sumY = 0;
    
    for (const i of indices) {
      sumX += vel[i].x;
      sumY += vel[i].y;
    }
    
    const avgX = sumX / indices.length;
    const avgY = sumY / indices.length;
    
    return {
      x: avgX,
      y: avgY,
      speed: Math.hypot(avgX, avgY)
    };
  }
}

// ==============================================
// INTERACTIVE PETAL STREAM
// ==============================================

export class InteractivePetalStream {
  constructor() {
    // PERFORMANCE OPTIMIZED: Use object pool instead of creating/destroying
    this.maxPetals = 280; // Increased for more dramatic spark effect
    this.petals = new Array(this.maxPetals);
    this.activeCount = 0;
    
    // Pre-initialize all petal objects (object pooling)
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals[i] = this.createPetalObject();
    }
    
    this.isActive = false;
    
    // Support multiple spawn sources (multiple fists)
    this.spawnSources = [];
    this.smoothSources = [];
    
    // Legacy single source (backward compat)
    this.sourceX = 0.5;
    this.sourceY = 0.5;
    this.smoothX = 0.5;
    this.smoothY = 0.5;
    
    // Interaction zones
    this.zones = [];
    this.velocityTracker = null;
    
    // PERFORMANCE: Frame throttling for collision checks
    this.frameCount = 0;
    this.collisionCheckInterval = 2; // Check every 2nd frame
    
    // Pre-computed random values (reused for turbulence)
    this.randomCache = new Float32Array(256);
    this.randomIndex = 0;
    for (let i = 0; i < 256; i++) {
      this.randomCache[i] = (Math.random() - 0.5) * 2;
    }
    
    // Configuration - BALANCED for smooth 60fps with MORE SPARKS
    this.config = {
      spawnRate: 0.92, // Increased for more dramatic spark effect
      
      // Interaction
      handInteractionRadius: 0.08,    // Palm push radius
      fingerInteractionRadius: 0.035, // Fingertip radius
      faceInteractionRadius: 0.05,    // Face area radius
      bodyInteractionRadius: 0.045,   // Body joints radius
      
      // Forces
      deflectionStrength: 0.015,
      momentumTransfer: 0.25,
      turbulenceStrength: 0.002,
      attractionStrength: 0.001,
      
      // Physics
      gravity: -0.00003,
      drag: 0.98,
      maxSpeed: 0.02
    };
  }
  
  // PERFORMANCE: Create reusable petal object
  createPetalObject() {
    return {
      x: 0, y: 0,
      vx: 0, vy: 0,
      size: 6,
      rotation: 0,
      rotSpeed: 0,
      color: '#E8B4B8',
      opacity: 0,
      life: 0,
      active: false,
      lastCollisionTime: 0,
      collisionCooldown: 100
    };
  }
  
  // PERFORMANCE: Get next random from cache
  nextRandom() {
    this.randomIndex = (this.randomIndex + 1) & 255;
    return this.randomCache[this.randomIndex];
  }
  
  setVelocityTracker(tracker) {
    this.velocityTracker = tracker;
  }
  
  start(x, y) {
    this.isActive = true;
    this.sourceX = x;
    this.sourceY = y;
    this.spawnSources = [{ x, y }];
  }
  
  // NEW: Start with multiple spawn sources (both fists)
  startMultiple(positions) {
    this.isActive = true;
    this.spawnSources = positions.map(p => ({ x: p.x, y: p.y }));
    
    // Keep smooth sources array in sync
    while (this.smoothSources.length < this.spawnSources.length) {
      this.smoothSources.push({ x: 0.5, y: 0.5 });
    }
    while (this.smoothSources.length > this.spawnSources.length) {
      this.smoothSources.pop();
    }
    
    // Legacy compat
    if (positions.length > 0) {
      this.sourceX = positions[0].x;
      this.sourceY = positions[0].y;
    }
  }
  
  stop() {
    this.isActive = false;
    this.spawnSources = [];
  }
  
  // Set current body data for collision detection
  setBodyData(pose, hands, face) {
    this.zones = [];
    
    // Add hand zones (highest priority - large radius)
    if (hands) {
      for (let h = 0; h < Math.min(2, hands.length); h++) {
        const hand = hands[h];
        if (!hand || hand.length < 21) continue;
        
        // Palm center (average of wrist and MCP joints)
        const palmX = (hand[0].x + hand[5].x + hand[9].x + hand[13].x + hand[17].x) / 5;
        const palmY = (hand[0].y + hand[5].y + hand[9].y + hand[13].y + hand[17].y) / 5;
        
        this.zones.push({
          x: 1 - palmX, // Mirror for display
          y: palmY,
          radius: this.config.handInteractionRadius,
          velocitySource: { type: 'hand', index: h },
          strength: 1.0,
          type: 'palm'
        });
        
        // Fingertips (smaller, precise)
        const fingertips = [4, 8, 12, 16, 20];
        for (const tip of fingertips) {
          this.zones.push({
            x: 1 - hand[tip].x,
            y: hand[tip].y,
            radius: this.config.fingerInteractionRadius,
            velocitySource: { type: 'handLandmark', handIndex: h, landmarkIndex: tip },
            strength: 0.6,
            type: 'fingertip'
          });
        }
      }
    }
    
    // Add pose zones (body joints)
    if (pose && pose.length >= 33) {
      const vis = (idx) => (pose[idx]?.visibility || 0) > 0.3;
      
      // Shoulders
      if (vis(11)) {
        this.zones.push({
          x: 1 - pose[11].x, y: pose[11].y,
          radius: this.config.bodyInteractionRadius,
          velocitySource: { type: 'pose', index: 11 },
          strength: 0.5,
          type: 'body'
        });
      }
      if (vis(12)) {
        this.zones.push({
          x: 1 - pose[12].x, y: pose[12].y,
          radius: this.config.bodyInteractionRadius,
          velocitySource: { type: 'pose', index: 12 },
          strength: 0.5,
          type: 'body'
        });
      }
      
      // Elbows
      if (vis(13)) {
        this.zones.push({
          x: 1 - pose[13].x, y: pose[13].y,
          radius: this.config.bodyInteractionRadius * 0.8,
          velocitySource: { type: 'pose', index: 13 },
          strength: 0.6,
          type: 'body'
        });
      }
      if (vis(14)) {
        this.zones.push({
          x: 1 - pose[14].x, y: pose[14].y,
          radius: this.config.bodyInteractionRadius * 0.8,
          velocitySource: { type: 'pose', index: 14 },
          strength: 0.6,
          type: 'body'
        });
      }
      
      // Wrists (important for hand-less tracking)
      if (vis(15) && (!hands || !hands[0])) {
        this.zones.push({
          x: 1 - pose[15].x, y: pose[15].y,
          radius: this.config.bodyInteractionRadius,
          velocitySource: { type: 'pose', index: 15 },
          strength: 0.7,
          type: 'body'
        });
      }
      if (vis(16) && (!hands || !hands[1])) {
        this.zones.push({
          x: 1 - pose[16].x, y: pose[16].y,
          radius: this.config.bodyInteractionRadius,
          velocitySource: { type: 'pose', index: 16 },
          strength: 0.7,
          type: 'body'
        });
      }
    }
    
    // Add face zone (gentle interaction)
    if (face && face.length >= 468) {
      // Nose tip
      const nose = face[4];
      this.zones.push({
        x: 1 - nose.x,
        y: nose.y,
        radius: this.config.faceInteractionRadius,
        velocitySource: null, // Face has minimal velocity effect
        strength: 0.3,
        type: 'face'
      });
    }
  }
  
  update(x, y, dt, theme) {
    this.frameCount++;
    const doCollisionCheck = (this.frameCount % this.collisionCheckInterval) === 0;
    
    // Smoothly follow the fist position (legacy)
    this.smoothX += (x - this.smoothX) * 0.3;
    this.smoothY += (y - this.smoothY) * 0.3;
    
    // Smoothly follow ALL spawn sources
    for (let s = 0; s < this.spawnSources.length; s++) {
      if (!this.smoothSources[s]) {
        this.smoothSources[s] = { x: this.spawnSources[s].x, y: this.spawnSources[s].y };
      }
      this.smoothSources[s].x += (this.spawnSources[s].x - this.smoothSources[s].x) * 0.3;
      this.smoothSources[s].y += (this.spawnSources[s].y - this.smoothSources[s].y) * 0.3;
    }
    
    const colors = theme === 'light' 
      ? ['#E08898', '#70A0C8', '#A090C0', '#E0B090']
      : ['#E8B4B8', '#A8C8DC', '#C8B8D8', '#F0D4C0'];
    
    // PERFORMANCE: Spawn using object pool
    if (this.isActive && this.activeCount < this.maxPetals) {
      for (let s = 0; s < this.smoothSources.length; s++) {
        const source = this.smoothSources[s];
        if (!source) continue;
        
        if (Math.random() < this.config.spawnRate && this.activeCount < this.maxPetals) {
          // Find inactive petal in pool
          for (let i = 0; i < this.maxPetals; i++) {
            const p = this.petals[i];
            if (!p.active) {
              // Reuse this petal
              const angle = Math.random() * Math.PI * 2;
              const speed = 0.003 + Math.random() * 0.005;
              
              p.x = source.x + this.nextRandom() * 0.01;
              p.y = source.y + this.nextRandom() * 0.01;
              p.vx = Math.cos(angle) * speed;
              p.vy = Math.sin(angle) * speed - 0.002;
              p.size = 5 + Math.random() * 8;
              p.rotation = Math.random() * Math.PI * 2;
              p.rotSpeed = this.nextRandom() * 0.06;
              p.color = colors[(Math.random() * colors.length) | 0];
              p.opacity = 1;
              p.life = 0;
              p.active = true;
              p.lastCollisionTime = 0;
              
              this.activeCount++;
              break;
            }
          }
        }
      }
    }
    
    // PERFORMANCE: Update active petals with optimized collision
    const now = performance.now();
    const dtLife = dt * 0.001;
    const drag = this.config.drag;
    const gravity = this.config.gravity;
    const maxSpeedSq = this.config.maxSpeed * this.config.maxSpeed;
    
    for (let i = 0; i < this.maxPetals; i++) {
      const p = this.petals[i];
      if (!p.active) continue;
      
      // PERFORMANCE: Only check collisions every N frames
      if (doCollisionCheck && this.zones.length > 0) {
        for (let z = 0; z < this.zones.length; z++) {
          const zone = this.zones[z];
          const dx = p.x - zone.x;
          const dy = p.y - zone.y;
          
          // PERFORMANCE: Use squared distance (avoid Math.hypot)
          const distSq = dx * dx + dy * dy;
          const radiusSq = zone.radius * zone.radius;
          
          if (distSq < radiusSq && now - p.lastCollisionTime > p.collisionCooldown) {
            const distance = Math.sqrt(distSq);
            const forceFalloff = (1 - distance / zone.radius) ** 2;
            
            // Normalized direction
            const invDist = distance > 0.001 ? 1 / distance : 1;
            const nx = dx * invDist;
            const ny = dy * invDist;
            
            // Get velocity of this zone
            let zvx = 0, zvy = 0;
            if (this.velocityTracker && zone.velocitySource) {
              const src = zone.velocitySource;
              if (src.type === 'hand') {
                const zv = this.velocityTracker.getAverageHandVelocity(src.index);
                zvx = -zv.x; zvy = zv.y;
              } else if (src.type === 'handLandmark') {
                const zv = this.velocityTracker.getHandVelocity(src.handIndex, src.landmarkIndex);
                zvx = -zv.x; zvy = zv.y;
              } else if (src.type === 'pose') {
                const zv = this.velocityTracker.getPoseVelocity(src.index);
                zvx = -zv.x; zvy = zv.y;
              }
            }
            
            // Apply forces
            const force = this.config.deflectionStrength * forceFalloff * zone.strength;
            const momentum = this.config.momentumTransfer * forceFalloff * zone.strength;
            const turbulence = this.config.turbulenceStrength * forceFalloff;
            
            p.vx += nx * force + zvx * momentum + this.nextRandom() * turbulence;
            p.vy += ny * force + zvy * momentum + this.nextRandom() * turbulence;
            p.rotSpeed += this.nextRandom() * 0.05 * forceFalloff;
            p.lastCollisionTime = now;
          }
        }
      }
      
      // Apply physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= gravity;
      p.vx *= drag;
      p.vy *= drag;
      
      // PERFORMANCE: Squared speed check
      const speedSq = p.vx * p.vx + p.vy * p.vy;
      if (speedSq > maxSpeedSq) {
        const invSpeed = this.config.maxSpeed / Math.sqrt(speedSq);
        p.vx *= invSpeed;
        p.vy *= invSpeed;
      }
      
      p.rotation += p.rotSpeed;
      p.life += dtLife;
      p.opacity = Math.max(0, 1 - p.life / 3.5);
      
      // Deactivate dead petals (no array manipulation)
      if (p.opacity <= 0) {
        p.active = false;
        this.activeCount--;
      }
    }
  }
  
  render(ctx, w, h) {
    // PERFORMANCE: Only iterate active petals
    for (let i = 0; i < this.maxPetals; i++) {
      const p = this.petals[i];
      if (!p.active) continue;
      
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x * w, p.y * h);
      ctx.rotate(p.rotation);
      
      // Draw petal shape
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner highlight
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.ellipse(0, -p.size * 0.2, p.size * 0.15, p.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  hasActivePetals() {
    return this.activeCount > 0;
  }
  
  getParticleCount() {
    return this.activeCount;
  }
  
  // ============================================
  // GESTURE-TRIGGERED EFFECTS
  // ============================================
  
  /**
   * Wind Push Effect (Open_Palm gesture)
   * Creates a radial blast that pushes particles away from palm
   * PERFORMANCE OPTIMIZED: Uses squared distances and pool iteration
   */
  triggerWindPush(x, y, radius = 0.15) {
    const strength = 0.025;
    const innerRadius = radius * 0.3;
    const radiusSq = radius * radius;
    const innerRadiusSq = innerRadius * innerRadius;
    
    for (let i = 0; i < this.maxPetals; i++) {
      const p = this.petals[i];
      if (!p.active) continue;
      
      const dx = p.x - x;
      const dy = p.y - y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < radiusSq && distSq > 0.000001) {
        const distance = Math.sqrt(distSq);
        const falloff = (1 - distance / radius) ** 1.5;
        
        const invDist = 1 / distance;
        const nx = dx * invDist;
        const ny = dy * invDist;
        
        const force = strength * falloff;
        p.vx += nx * force;
        p.vy += ny * force;
        
        if (distSq < innerRadiusSq) {
          p.vx += nx * force * 1.5;
          p.vy += ny * force * 1.5;
        }
        
        p.rotSpeed += this.nextRandom() * 0.075 * falloff;
      }
    }
  }
  
  /**
   * Magnet Attraction Effect (Pointing_Up gesture)
   * Draws particles toward a fingertip position
   * PERFORMANCE OPTIMIZED: Uses squared distances and pool iteration
   */
  triggerMagnetAttraction(x, y, radius = 0.12) {
    const strength = 0.008;
    const captureRadius = radius * 0.15;
    const radiusSq = radius * radius;
    const captureRadiusSq = captureRadius * captureRadius;
    
    for (let i = 0; i < this.maxPetals; i++) {
      const p = this.petals[i];
      if (!p.active) continue;
      
      const dx = x - p.x;
      const dy = y - p.y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < radiusSq && distSq > 0.000001) {
        const distance = Math.sqrt(distSq);
        const falloff = (1 - distance / radius) ** 0.8;
        
        const invDist = 1 / distance;
        const nx = dx * invDist;
        const ny = dy * invDist;
        
        if (distSq > captureRadiusSq) {
          const force = strength * falloff;
          p.vx += nx * force;
          p.vy += ny * force;
        } else {
          const orbitForce = strength * 0.5;
          p.vx += -ny * orbitForce + nx * strength * 0.3;
          p.vy += nx * orbitForce + ny * strength * 0.3;
        }
        
        p.rotSpeed += this.nextRandom() * 0.04 * falloff;
      }
    }
  }
  
  // Debug: render interaction zones
  renderDebugZones(ctx, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    
    for (const zone of this.zones) {
      ctx.beginPath();
      ctx.arc(zone.x * w, zone.y * h, zone.radius * w, 0, Math.PI * 2);
      
      switch (zone.type) {
        case 'palm':
          ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
          ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
          break;
        case 'fingertip':
          ctx.fillStyle = 'rgba(100, 255, 100, 0.3)';
          ctx.strokeStyle = 'rgba(100, 255, 100, 0.6)';
          break;
        case 'body':
          ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
          ctx.strokeStyle = 'rgba(100, 100, 255, 0.6)';
          break;
        case 'face':
          ctx.fillStyle = 'rgba(255, 200, 100, 0.3)';
          ctx.strokeStyle = 'rgba(255, 200, 100, 0.6)';
          break;
      }
      
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

