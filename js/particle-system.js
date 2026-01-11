/**
 * DIGITALE SCHWEIZ — Particle System
 * Schweizerische Eidgenossenschaft
 * 
 * Advanced particle system with 3D depth effects and mesh connections
 */

import { hexToRgba, SWISS_COLORS } from './themes.js';

// ==============================================
// PERLIN NOISE IMPLEMENTATION
// ==============================================

class PerlinNoise {
  constructor() {
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = Math.floor(Math.random() * 256);
    }
    this.permutation = [...this.permutation, ...this.permutation];
  }
  
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  lerp(a, b, t) {
    return a + t * (b - a);
  }
  
  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  
  noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;
    
    return this.lerp(
      this.lerp(this.grad(this.permutation[A], x, y), this.grad(this.permutation[B], x - 1, y), u),
      this.lerp(this.grad(this.permutation[A + 1], x, y - 1), this.grad(this.permutation[B + 1], x - 1, y - 1), u),
      v
    );
  }
}

const perlin = new PerlinNoise();

// ==============================================
// PARTICLE CLASS
// ==============================================

class Particle {
  constructor(x, y, color, theme) {
    this.x = x;
    this.y = y;
    this.z = 0; // Depth
    
    this.targetX = x;
    this.targetY = y;
    this.targetZ = 0;
    
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    
    this.baseRadius = 1.5 + Math.random() * 1.5;
    this.radius = this.baseRadius;
    
    this.color = color;
    this.alpha = 0.8;
    
    this.noiseOffsetX = Math.random() * 1000;
    this.noiseOffsetY = Math.random() * 1000;
    this.noiseSpeed = 0.002 + Math.random() * 0.003;
    
    this.hasTarget = false;
    this.targetType = null;
    
    this.theme = theme;
  }
  
  update(dt, mode, formationProgress) {
    const time = performance.now() * this.noiseSpeed;
    
    // Perlin noise movement
    const noiseX = perlin.noise2D(this.noiseOffsetX + time, this.noiseOffsetY);
    const noiseY = perlin.noise2D(this.noiseOffsetX, this.noiseOffsetY + time);
    
    if (this.hasTarget && formationProgress > 0) {
      // Move toward target
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dz = this.targetZ - this.z;
      
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Attraction strength based on mode and formation progress
      let attraction = 0.1 * formationProgress;
      
      if (mode === 'dissolve') {
        attraction *= 0.3;
        // Add more noise in dissolve mode
        this.vx += noiseX * 2;
        this.vy += noiseY * 2;
      } else if (mode === 'explore') {
        attraction *= 0.5;
      }
      
      // Spring-like attraction
      this.vx += dx * attraction;
      this.vy += dy * attraction;
      this.vz += dz * attraction * 0.5;
      
      // Jitter when close
      if (distance < 5) {
        this.vx += noiseX * 0.5;
        this.vy += noiseY * 0.5;
      }
    } else {
      // Free floating with noise
      this.vx += noiseX * 0.3;
      this.vy += noiseY * 0.3;
    }
    
    // Damping
    const damping = 0.92;
    this.vx *= damping;
    this.vy *= damping;
    this.vz *= damping;
    
    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    
    // Clamp z depth
    this.z = Math.max(-1, Math.min(1, this.z));
    
    // 3D depth scaling - particles closer appear larger
    const depthScale = 1 + this.z * 0.3;
    this.radius = this.baseRadius * depthScale;
    
    // Alpha based on depth
    this.alpha = 0.4 + (1 + this.z) * 0.3;
  }
  
  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(this.color, this.alpha);
    ctx.fill();
    
    // Subtle glow for closer particles
    if (this.z > 0.3) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(this.color, 0.1);
      ctx.fill();
    }
  }
}

// ==============================================
// MAIN PARTICLE SYSTEM
// ==============================================

export class ParticleSystem {
  constructor(width, height, maxParticles, theme) {
    this.width = width;
    this.height = height;
    this.maxParticles = maxParticles;
    this.theme = theme;
    
    this.particles = [];
    this.targets = [];
    this.mode = 'mirror';
    this.formationProgress = 0;
    
    this.meshLineDistance = 30;
    this.showMeshLines = true;
    
    this.initParticles();
    
    console.log(`[ParticleSystem] Initialized with ${this.particles.length} particles`);
  }
  
  initParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.maxParticles; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const color = this.theme.particles[Math.floor(Math.random() * this.theme.particles.length)];
      
      this.particles.push(new Particle(x, y, color, this.theme));
    }
  }
  
  resize(width, height) {
    this.width = width;
    this.height = height;
  }
  
  setTheme(theme) {
    this.theme = theme;
    
    // Update particle colors
    this.particles.forEach(p => {
      p.color = theme.particles[Math.floor(Math.random() * theme.particles.length)];
      p.theme = theme;
    });
  }
  
  setMode(mode) {
    this.mode = mode;
  }
  
  setFormationProgress(progress) {
    this.formationProgress = progress;
  }
  
  setTargets(targets) {
    this.targets = targets;
    
    // Assign targets to particles
    if (targets.length === 0) {
      this.particles.forEach(p => {
        p.hasTarget = false;
        p.targetType = null;
      });
      return;
    }
    
    // Distribute particles among targets
    const particlesPerTarget = Math.floor(this.particles.length / targets.length);
    
    this.particles.forEach((p, i) => {
      const targetIndex = Math.floor(i / particlesPerTarget);
      const target = targets[Math.min(targetIndex, targets.length - 1)];
      
      if (target) {
        // Add some spread around the target
        const spread = p.targetType === 'face' ? 2 : 5;
        p.targetX = target.x + (Math.random() - 0.5) * spread;
        p.targetY = target.y + (Math.random() - 0.5) * spread;
        p.targetZ = target.z || 0;
        p.hasTarget = true;
        p.targetType = target.type;
      }
    });
  }
  
  update(dt) {
    this.particles.forEach(p => {
      p.update(dt, this.mode, this.formationProgress);
      
      // Boundary wrapping
      if (p.x < -50) p.x = this.width + 50;
      if (p.x > this.width + 50) p.x = -50;
      if (p.y < -50) p.y = this.height + 50;
      if (p.y > this.height + 50) p.y = -50;
    });
  }
  
  render(ctx) {
    // Draw mesh lines (Iron Man effect)
    if (this.showMeshLines && this.formationProgress > 0.5) {
      this.renderMeshLines(ctx);
    }
    
    // Sort by depth (back to front)
    const sorted = [...this.particles].sort((a, b) => a.z - b.z);
    
    // Render particles
    sorted.forEach(p => p.render(ctx));
  }
  
  renderMeshLines(ctx) {
    const connected = this.particles.filter(p => p.hasTarget);
    const maxDistance = this.meshLineDistance;
    
    ctx.strokeStyle = this.theme.meshLines;
    ctx.lineWidth = 0.5;
    
    // Only check nearby particles for performance
    for (let i = 0; i < connected.length; i += 3) {
      const p1 = connected[i];
      
      for (let j = i + 3; j < connected.length && j < i + 30; j += 3) {
        const p2 = connected[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.3 * this.formationProgress;
          ctx.strokeStyle = hexToRgba(this.theme.particles[0], alpha);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }
  
  getActiveCount() {
    return this.particles.length;
  }
}

// ==============================================
// INTRO PARTICLE SYSTEM
// ==============================================

export class IntroParticleSystem {
  constructor(width, height, count, theme) {
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.particles = [];
    
    // Create particles with slow drift
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.2, // Slight upward drift
        radius: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.3,
        color: theme.particles[Math.floor(Math.random() * theme.particles.length)],
        noiseOffset: Math.random() * 1000
      });
    }
  }
  
  resize(width, height) {
    this.width = width;
    this.height = height;
  }
  
  update(dt) {
    const time = performance.now() * 0.001;
    
    this.particles.forEach(p => {
      // Perlin noise influence
      const noise = perlin.noise2D(p.noiseOffset + time * 0.5, p.noiseOffset);
      
      p.x += p.vx + noise * 0.5;
      p.y += p.vy;
      
      // Wrap around
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;
      
      // Subtle alpha pulsing
      p.alpha = 0.1 + Math.sin(time + p.noiseOffset) * 0.1 + 0.1;
    });
  }
  
  render(ctx) {
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(p.color, p.alpha);
      ctx.fill();
    });
  }
}
