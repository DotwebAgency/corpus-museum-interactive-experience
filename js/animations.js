/**
 * CORPUS — AWWWARD-Winning GSAP Animation System
 * Million-dollar quality animations for the digital portrait experience
 * Bleeding-edge 2026 techniques
 */

// Wait for GSAP to be available
const waitForGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) {
      resolve(window.gsap);
    } else {
      const check = setInterval(() => {
        if (window.gsap) {
          clearInterval(check);
          resolve(window.gsap);
        }
      }, 50);
    }
  });
};

// ==============================================
// GSAP CONFIGURATION — LUXURY DEFAULTS
// ==============================================

export async function initGSAP() {
  const gsap = await waitForGSAP();
  
  gsap.config({
    force3D: true,
    nullTargetWarn: false
  });

  gsap.defaults({
    ease: "power2.out",
    duration: 0.6
  });
  
  return gsap;
}

// ==============================================
// CUSTOM LUXURY EASINGS
// ==============================================

export const EASINGS = {
  // Core luxury easings
  elegant: "power3.out",
  luxuryIn: "power4.in",
  luxuryOut: "power4.out", 
  luxuryInOut: "power3.inOut",
  
  // Bounce & elastic
  bounce: "elastic.out(1, 0.5)",
  gentleBounce: "elastic.out(0.8, 0.6)",
  springy: "back.out(1.7)",
  snap: "power4.out",
  
  // Smooth
  smooth: "power2.inOut",
  breathe: "sine.inOut",
  soft: "power1.out",
  dramatic: "expo.out",
  
  // Custom curves for luxury feel
  reveal: "power3.out",
  fadeIn: "power2.out",
  fadeOut: "power2.in"
};

// ==============================================
// ETHEREAL PARTICLE SYSTEM
// ==============================================

export class EtherealParticles {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.time = 0;
    
    // Louvre color palette
    this.colors = [
      { r: 212, g: 175, b: 55, a: 0.4 },   // Gold
      { r: 244, g: 228, b: 232, a: 0.35 }, // Rose
      { r: 250, g: 248, b: 244, a: 0.5 },  // Pearl
      { r: 228, g: 228, b: 244, a: 0.35 }, // Lavender
      { r: 228, g: 244, b: 236, a: 0.35 }  // Mint
    ];
  }
  
  init(particleCount = 60) {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'ethereal-particles-canvas';
    this.canvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
    `;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }
    
    this.animate();
  }
  
  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }
  
  createParticle() {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: 1 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1, // Slight upward drift
      color: color,
      phase: Math.random() * Math.PI * 2,
      frequency: 0.5 + Math.random() * 0.5
    };
  }
  
  // Perlin-style noise for organic movement
  noise(x, y, t) {
    const n = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5);
    return n * 0.5 + 0.5;
  }
  
  update() {
    this.time += 0.016;
    
    this.particles.forEach(p => {
      // Perlin-influenced movement
      const noiseX = this.noise(p.x, p.y, this.time) - 0.5;
      const noiseY = this.noise(p.y, p.x, this.time * 0.7) - 0.5;
      
      p.x += p.speedX + noiseX * 0.5;
      p.y += p.speedY + noiseY * 0.3;
      
      // Breathing size
      p.currentSize = p.size * (0.8 + 0.4 * Math.sin(this.time * p.frequency + p.phase));
      
      // Wrap around
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;
    });
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.currentSize * 3
      );
      
      const { r, g, b, a } = p.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a * 0.3})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.currentSize * 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  animate() {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// ==============================================
// CURSOR GRADIENT FOLLOWER
// ==============================================

export class CursorGradient {
  constructor(container) {
    this.container = container;
    this.gradient = null;
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.currentX = 0.5;
    this.currentY = 0.5;
    this.animationId = null;
  }
  
  init() {
    // Create gradient overlay
    this.gradient = document.createElement('div');
    this.gradient.className = 'cursor-gradient-overlay';
    this.gradient.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;
    this.container.appendChild(this.gradient);
    
    // Track mouse
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / rect.width;
      this.mouseY = (e.clientY - rect.top) / rect.height;
    });
    
    this.container.addEventListener('mouseenter', () => {
      this.gradient.style.opacity = '1';
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.gradient.style.opacity = '0';
    });
    
    this.animate();
  }
  
  animate() {
    // Smooth follow
    this.currentX += (this.mouseX - this.currentX) * 0.08;
    this.currentY += (this.mouseY - this.currentY) * 0.08;
    
    const x = this.currentX * 100;
    const y = this.currentY * 100;
    
    this.gradient.style.background = `
      radial-gradient(
        ellipse 40% 30% at ${x}% ${y}%,
        rgba(212, 175, 55, 0.08) 0%,
        rgba(244, 228, 232, 0.04) 30%,
        transparent 70%
      )
    `;
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.gradient && this.gradient.parentNode) {
      this.gradient.parentNode.removeChild(this.gradient);
    }
  }
}

// ==============================================
// TEXT SPLITTING UTILITY (Free alternative to SplitText)
// ==============================================

export class TextSplitter {
  /**
   * Split text into characters for animation
   * @param {HTMLElement} element - Element containing text to split
   * @returns {Object} - { chars: Array<HTMLSpanElement>, revert: Function }
   */
  static splitChars(element) {
    const originalText = element.textContent;
    const originalHTML = element.innerHTML;
    
    // Create character spans
    const chars = [];
    element.innerHTML = '';
    
    for (let i = 0; i < originalText.length; i++) {
      const char = originalText[i];
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.className = 'split-char';
      element.appendChild(span);
      chars.push(span);
    }
    
    return {
      chars,
      revert: () => {
        element.innerHTML = originalHTML;
      }
    };
  }
  
  /**
   * Split text into words for animation
   * @param {HTMLElement} element - Element containing text to split
   * @returns {Object} - { words: Array<HTMLSpanElement>, revert: Function }
   */
  static splitWords(element) {
    const originalHTML = element.innerHTML;
    const text = element.textContent;
    const wordList = text.split(/\s+/);
    
    element.innerHTML = '';
    const words = [];
    
    wordList.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.className = 'split-word';
      element.appendChild(span);
      words.push(span);
      
      // Add space after word (except last)
      if (index < wordList.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
    
    return {
      words,
      revert: () => {
        element.innerHTML = originalHTML;
      }
    };
  }
  
  /**
   * Split text into lines (based on <br> tags)
   * @param {HTMLElement} element - Element containing text with <br> tags
   * @returns {Object} - { lines: Array<HTMLSpanElement>, revert: Function }
   */
  static splitLines(element) {
    const originalHTML = element.innerHTML;
    const htmlContent = element.innerHTML;
    const lineParts = htmlContent.split(/<br\s*\/?>/gi);
    
    element.innerHTML = '';
    const lines = [];
    
    lineParts.forEach((line, index) => {
      const span = document.createElement('span');
      span.innerHTML = line.trim();
      span.style.display = 'block';
      span.style.willChange = 'transform, opacity, filter';
      span.className = 'split-line';
      element.appendChild(span);
      lines.push(span);
    });
    
    return {
      lines,
      revert: () => {
        element.innerHTML = originalHTML;
      }
    };
  }
}

// ==============================================
// INTRO SCREEN ANIMATIONS — AWWWARD QUALITY
// ==============================================

export const IntroAnimations = {
  
  // Store particle system reference
  particleSystem: null,
  cursorGradient: null,
  textSplits: [], // Store text splits for cleanup
  
  /**
   * Initialize ambient effects
   */
  initAmbient(gsap, introScreen) {
    // Initialize ethereal particles
    this.particleSystem = new EtherealParticles(introScreen);
    this.particleSystem.init(65);
    
    // Initialize cursor gradient follower
    this.cursorGradient = new CursorGradient(introScreen);
    this.cursorGradient.init();
    
    // Golden vignette breathing
    const vignette = introScreen.querySelector('.intro-vignette');
    if (vignette) {
      gsap.to(vignette, {
        opacity: 0.6,
        duration: 5,
        ease: EASINGS.breathe,
        yoyo: true,
        repeat: -1
      });
    }
  },
  
  /**
   * AWWWARD-Quality Page Reveal Sequence
   * Total Duration: ~4.5 seconds
   */
  pageReveal(gsap, elements) {
    const tl = gsap.timeline();
    
    // Clear previous text splits
    this.textSplits.forEach(split => split.revert && split.revert());
    this.textSplits = [];
    
    // Initial setup - everything hidden
    const allElements = [
      elements.logo,
      elements.title,
      elements.tagline,
      elements.subtitle,
      elements.cta,
      elements.privacy,
      elements.footer
    ].filter(Boolean);
    
    gsap.set(allElements, { 
      clearProps: "animation",
      opacity: 0,
      y: 60
    });
    
    // Additional setup for advanced effects
    if (elements.logo) {
      gsap.set(elements.logo, { scale: 0.8, filter: 'blur(10px)' });
    }
    if (elements.cta) {
      gsap.set(elements.cta, { scale: 0.95 });
    }
    
    // Split title into characters for AWWWARD-quality reveal
    let titleChars = null;
    if (elements.title) {
      const titleSplit = TextSplitter.splitChars(elements.title);
      this.textSplits.push(titleSplit);
      titleChars = titleSplit.chars;
      // Set initial state for chars
      gsap.set(titleChars, { 
        opacity: 0, 
        y: 80, 
        rotationX: -40,
        transformOrigin: 'bottom center'
      });
      gsap.set(elements.title, { opacity: 1, y: 0 }); // Container visible
    }
    
    // Split subtitle into lines for blur-sharpen effect
    let subtitleLines = null;
    if (elements.subtitle) {
      const subtitleSplit = TextSplitter.splitLines(elements.subtitle);
      this.textSplits.push(subtitleSplit);
      subtitleLines = subtitleSplit.lines;
      gsap.set(subtitleLines, { 
        opacity: 0, 
        y: 30, 
        filter: 'blur(8px)' 
      });
      gsap.set(elements.subtitle, { opacity: 1, y: 0 }); // Container visible
    }
    
    tl
      // Stage 1: Logo materializes with blur clear (0-1.2s)
      .to(elements.logo, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: EASINGS.luxuryOut,
        onStart: () => console.log('[CORPUS] Logo animation started')
      })
      
      // Stage 2: Title reveals CHARACTER BY CHARACTER (0.6-2.0s)
      .to(titleChars || elements.title, titleChars ? {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.0,
        stagger: {
          each: 0.06,
          from: 'center'
        },
        ease: 'back.out(1.7)'
      } : {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: EASINGS.elegant
      }, "-=0.6")
      
      // Stage 3: Tagline with elegant italic sweep (1.2-2.4s)
      .to(elements.tagline, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: EASINGS.soft
      }, "-=0.8")
      
      // Stage 4: Subtitle LINE BY LINE with blur-sharpen effect (1.6-2.8s)
      .to(subtitleLines || elements.subtitle, subtitleLines ? {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.2,
        ease: EASINGS.elegant
      } : {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: EASINGS.soft
      }, "-=0.6")
      
      // Stage 5: CTA button materializes with spring (2.0-3.2s)
      .to(elements.cta, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: EASINGS.springy
      }, "-=0.5")
      
      // Stage 6: Privacy note soft fade (2.6-3.4s)
      .to(elements.privacy, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: EASINGS.soft
      }, "-=0.4")
      
      // Stage 7: Footer brand (3.0-3.6s)
      .to(elements.footer, {
        opacity: 1,
        duration: 0.6,
        ease: EASINGS.soft
      }, "-=0.4")
      
      // Stage 8: Add subtle shimmer to CTA (3.2s+)
      .call(() => {
        if (elements.cta) {
          this.startButtonShimmer(gsap, elements.cta);
        }
        console.log('[CORPUS] pageReveal timeline completed');
      });
    
    return tl;
  },

  /**
   * Button shimmer loop - indicates interactivity
   */
  startButtonShimmer(gsap, button) {
    const shimmer = document.createElement('div');
    shimmer.className = 'cta-shimmer';
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 100%);
      pointer-events: none;
      z-index: 10;
    `;
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(shimmer);
    
    gsap.to(shimmer, {
      left: '150%',
      duration: 2.5,
      ease: 'power1.inOut',
      repeat: -1,
      repeatDelay: 3
    });
  },

  /**
   * AWWWARD-Quality Button Hover
   */
  createButtonHover(gsap, button) {
    const flourish = button.querySelector('.cta-flourish');
    const text = button.querySelector('.cta-text');
    
    const hoverTl = gsap.timeline({ paused: true })
      .to(button, {
        scale: 1.04,
        y: -6,
        boxShadow: "0 20px 60px rgba(212, 175, 55, 0.5), 0 0 100px rgba(212, 175, 55, 0.15)",
        duration: 0.5,
        ease: EASINGS.smooth
      });
    
    if (text) {
      hoverTl.to(text, {
        letterSpacing: '0.08em',
        textShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
        duration: 0.4,
        ease: EASINGS.smooth
      }, "-=0.45");
    }
    
    if (flourish) {
      hoverTl.to(flourish, {
        x: 10,
        scale: 1.1,
        rotation: 5,
        duration: 0.4,
        ease: EASINGS.smooth
      }, "-=0.4");
    }
    
    // Smooth enter/leave handling
    button.addEventListener('mouseenter', () => {
      hoverTl.timeScale(1).play();
    });
    
    button.addEventListener('mouseleave', () => {
      hoverTl.timeScale(1.3).reverse();
    });
    
    return hoverTl;
  },

  /**
   * Button Press with Particle Burst
   */
  buttonPress(gsap, button) {
    return gsap.timeline()
      .to(button, {
        scale: 0.96,
        duration: 0.1,
        ease: "power2.in"
      })
      .to(button, {
        scale: 1.02,
        duration: 0.25,
        ease: EASINGS.springy
      });
  },

  /**
   * Portal Transition - Button expands to fill screen
   */
  portalTransition(gsap, button, onComplete) {
    const rect = button.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.className = 'portal-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      background: linear-gradient(135deg, #D4AF37 0%, #F4E4C4 50%, #D4AF37 100%);
      border-radius: 8px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);
    
    return gsap.timeline()
      .to(overlay, {
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        duration: 0.8,
        ease: 'power4.inOut'
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          overlay.remove();
          if (onComplete) onComplete();
        }
      });
  },

  /**
   * Exit sequence before transitioning to main
   */
  exitSequence(gsap, elements) {
    const tl = gsap.timeline();
    
    tl
      // Fade out elements in sequence
      .to(elements.cta, {
        scale: 0.9,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.4,
        ease: "power2.in"
      })
      .to(elements.subtitle, {
        y: -40,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, "-=0.25")
      .to(elements.tagline, {
        y: -40,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      }, "-=0.25")
      .to(elements.title, {
        y: -50,
        opacity: 0,
        filter: 'blur(5px)',
        duration: 0.45,
        ease: "power2.in"
      }, "-=0.25")
      .to(elements.logo, {
        scale: 0.7,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.45,
        ease: "power2.in"
      }, "-=0.35")
      .to([elements.privacy, elements.footer], {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.4")
      .to(elements.vignette, {
        opacity: 0,
        duration: 0.5
      }, "-=0.3")
      .to(elements.screen, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.3");
    
    return tl;
  },
  
  /**
   * Cleanup ambient effects and text splits
   */
  cleanup() {
    // Clean up particle system
    if (this.particleSystem) {
      this.particleSystem.destroy();
      this.particleSystem = null;
    }
    // Clean up cursor gradient
    if (this.cursorGradient) {
      this.cursorGradient.destroy();
      this.cursorGradient = null;
    }
    // Revert text splits to original HTML
    if (this.textSplits && this.textSplits.length > 0) {
      this.textSplits.forEach(split => {
        if (split && split.revert) {
          split.revert();
        }
      });
      this.textSplits = [];
    }
  }
};

// ==============================================
// LOADING / AWAKENING ANIMATIONS
// ==============================================

export const LoadingAnimations = {
  
  /**
   * Show generic loading overlay
   */
  show(gsap, overlay, text) {
    gsap.set(overlay, { display: 'flex', opacity: 0 });
    return gsap.to(overlay, {
      opacity: 1,
      duration: 0.3,
      ease: EASINGS.fadeIn
    });
  },
  
  /**
   * Hide generic loading overlay
   */
  hide(gsap, overlay) {
    return gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: EASINGS.fadeOut,
      onComplete: () => {
        overlay.style.display = 'none';
      }
    });
  },
  
  /**
   * Awakening Screen Entry
   */
  awakeningEntry(gsap, elements) {
    const tl = gsap.timeline();
    
    gsap.set(elements.overlay, { opacity: 0, display: 'flex' });
    gsap.set(elements.content, { scale: 0.9, opacity: 0 });
    gsap.set(elements.progressTrack, { scaleX: 0, transformOrigin: 'left' });
    gsap.set(elements.status, { opacity: 0, y: 20 });
    
    tl
      .to(elements.overlay, {
        opacity: 1,
        duration: 0.5,
        ease: EASINGS.fadeIn
      })
      .to(elements.content, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: EASINGS.springy
      }, "-=0.2")
      .to(elements.progressTrack, {
        scaleX: 1,
        duration: 0.5,
        ease: EASINGS.elegant
      }, "-=0.3")
      .to(elements.status, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: EASINGS.soft
      }, "-=0.2");
    
    return tl;
  },

  /**
   * Update Progress with Animation
   */
  updateProgress(gsap, progressFill, progress) {
    return gsap.to(progressFill, {
      scaleX: progress / 100,
      duration: 0.3,
      ease: EASINGS.smooth
    });
  },
  
  /**
   * Status Message Transition
   */
  updateStatus(gsap, statusElement, newMessage) {
    return gsap.timeline()
      .to(statusElement, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: EASINGS.fadeOut
      })
      .call(() => {
        statusElement.textContent = newMessage;
      })
      .to(statusElement, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: EASINGS.fadeIn
      });
  },

  /**
   * Completion Flourish
   */
  completionFlourish(gsap, elements) {
    const tl = gsap.timeline();
    
    tl
      // Progress bar pulses gold
      .to(elements.progressFill, {
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)',
        duration: 0.3,
        ease: EASINGS.snap
      })
      // Content scales slightly
      .to(elements.content, {
        scale: 1.02,
        duration: 0.2,
        ease: EASINGS.snap
      }, "-=0.2")
      .to(elements.content, {
        scale: 1,
        duration: 0.3,
        ease: EASINGS.gentle
      })
      // Status gets gold treatment
      .to(elements.status, {
        color: '#D4AF37',
        textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
        duration: 0.4
      }, "-=0.4");
    
    return tl;
  },
  
  /**
   * Awakening Exit
   */
  awakeningExit(gsap, elements) {
    const tl = gsap.timeline();
    
    tl
      .to(elements.content, {
        scale: 0.95,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.5,
        ease: EASINGS.luxuryIn
      })
      .to(elements.overlay, {
        opacity: 0,
        duration: 0.4,
        ease: EASINGS.fadeOut,
        onComplete: () => {
          elements.overlay.style.display = 'none';
        }
      }, "-=0.2");
    
    return tl;
  }
};

// ==============================================
// MAIN APP ANIMATIONS
// ==============================================

export const MainAnimations = {
  /**
   * AWWWARD-Quality Entry Sequence
   */
  entrySequence(gsap, elements) {
    const tl = gsap.timeline();
    
    // Setup initial states - elements already pre-hidden via CSS/JS
    gsap.set(elements.mainApp, { display: 'flex', opacity: 1 });
    
    // Only set frame borders if they exist
    if (elements.frameBorders && elements.frameBorders.length > 0) {
      gsap.set(elements.frameBorders, { 
        scaleX: 0, 
        scaleY: 0, 
        transformOrigin: 'center',
        opacity: 0
      });
    }
    
    // Ensure header/footer start from hidden state
    if (elements.header) {
      gsap.set(elements.header, { y: -80, opacity: 0, visibility: 'visible' });
    }
    if (elements.footer) {
      gsap.set(elements.footer, { y: 80, opacity: 0, visibility: 'visible' });
    }
    if (elements.statusPanel) {
      gsap.set(elements.statusPanel, { x: 120, opacity: 0, scale: 0.9 });
    }
    
    // Small initial delay for smoother transition
    tl.to({}, { duration: 0.1 });
    
    // Frames animate in with stagger (if they exist)
    if (elements.frameBorders && elements.frameBorders.length > 0) {
      tl.to(elements.frameBorders, {
        scaleX: 1,
        scaleY: 1,
        opacity: 0.7,
        duration: 0.8,
        stagger: {
          each: 0.1,
          from: 'start'
        },
        ease: EASINGS.elegant
      });
    }
    
    // Header slides down with bounce
    if (elements.header) {
      tl.to(elements.header, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: EASINGS.springy,
        clearProps: 'transform' // Clean up inline styles after animation
      }, elements.frameBorders?.length ? "-=0.5" : "+=0");
    }
    
    // Footer slides up
    if (elements.footer) {
      tl.to(elements.footer, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: EASINGS.springy,
        clearProps: 'transform' // Clean up inline styles after animation
      }, "-=0.5");
    }
    
    // Status panel if exists
    if (elements.statusPanel) {
      tl.to(elements.statusPanel, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: EASINGS.springy,
        clearProps: 'transform,scale'
      }, "-=0.4");
    }
    
    return tl;
  },

  /**
   * Theme Toggle Animation
   */
  themeToggle(gsap, elements, theme) {
    const isDark = theme === 'dark';
    const tl = gsap.timeline();
    
    // Flash overlay
    const flash = document.createElement('div');
    flash.className = 'theme-flash';
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)'};
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
    `;
    document.body.appendChild(flash);
    
    tl
      .to(flash, {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.in'
      })
      .to(flash, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => flash.remove()
      });
    
    // Toggle icon animation
    if (elements.themeToggle) {
      tl.to(elements.themeToggle, {
      rotation: 360,
        duration: 0.5,
        ease: EASINGS.smooth
      }, 0);
    }
    
    return tl;
  },

  /**
   * Header Button Hover
   */
  createHeaderButtonHover(gsap, button) {
    const hoverTl = gsap.timeline({ paused: true })
      .to(button, {
        scale: 1.08,
        boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)',
        duration: 0.3,
        ease: EASINGS.smooth
      });
    
    button.addEventListener('mouseenter', () => hoverTl.play());
    button.addEventListener('mouseleave', () => hoverTl.reverse());
    
    return hoverTl;
  },

  /**
   * Status Badge Pulse
   */
  statusPulse(gsap, statusDot) {
    return gsap.timeline({ repeat: -1, repeatDelay: 2 })
      .to(statusDot, {
        scale: 1.3,
        boxShadow: '0 0 20px rgba(168, 208, 188, 0.6)',
        duration: 0.4,
        ease: EASINGS.smooth
      })
      .to(statusDot, {
        scale: 1,
        boxShadow: '0 0 8px rgba(168, 208, 188, 0.3)',
        duration: 0.4,
        ease: EASINGS.smooth
      });
  },

  /**
   * Detection Change Animation
   */
  detectionChange(gsap, statusDot, isDetected) {
    return gsap.timeline()
      .to(statusDot, {
        scale: 1.5,
        duration: 0.15,
        ease: 'power2.out'
      })
      .to(statusDot, {
        scale: 1,
        backgroundColor: isDetected ? 'var(--mint-cream)' : 'var(--dusty-rose)',
        boxShadow: isDetected 
          ? '0 0 16px var(--mint-glow), 0 0 24px var(--mint-glow)'
          : '0 0 8px var(--rose-glow)',
        duration: 0.3,
        ease: EASINGS.springy
      });
  },

  /**
   * Fullscreen Toggle Animation
   */
  fullscreenToggle(gsap, button, isFullscreen) {
    return gsap.timeline()
      .to(button, {
        scale: 0.9,
        duration: 0.1
      })
      .to(button, {
        scale: 1,
        duration: 0.3,
        ease: EASINGS.springy
    });
  },

  /**
   * Footer Metric Update Animation
   */
  updateMetric(gsap, element, value) {
    return gsap.timeline()
      .to(element, {
        scale: 1.1,
        duration: 0.1
      })
      .call(() => {
        element.textContent = value;
      })
      .to(element, {
        scale: 1,
        duration: 0.2,
        ease: EASINGS.springy
      });
  }
};

// ==============================================
// UTILITY ANIMATIONS
// ==============================================

export const UtilityAnimations = {
  /**
   * Fade In
   */
  fadeIn(gsap, element, duration = 0.5) {
    return gsap.fromTo(element, 
      { opacity: 0 },
      { opacity: 1, duration, ease: EASINGS.fadeIn }
    );
  },

  /**
   * Fade Out
   */
  fadeOut(gsap, element, duration = 0.5) {
    return gsap.to(element, 
      { opacity: 0, duration, ease: EASINGS.fadeOut }
    );
  },

  /**
   * Slide In From Direction
   */
  slideIn(gsap, element, direction = 'up', distance = 40, duration = 0.6) {
    const props = {
      opacity: 1,
      duration,
      ease: EASINGS.elegant
    };
    
    const from = { opacity: 0 };
    
    switch(direction) {
      case 'up': from.y = distance; props.y = 0; break;
      case 'down': from.y = -distance; props.y = 0; break;
      case 'left': from.x = distance; props.x = 0; break;
      case 'right': from.x = -distance; props.x = 0; break;
    }
    
    return gsap.fromTo(element, from, props);
  },

  /**
   * Scale In with Bounce
   */
  popIn(gsap, element, duration = 0.6) {
    return gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration, ease: EASINGS.springy }
    );
  },
  
  /**
   * Stagger Reveal for Multiple Elements
   */
  staggerReveal(gsap, elements, staggerTime = 0.1) {
    return gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: staggerTime,
        ease: EASINGS.elegant 
      }
    );
  }
};

// ==============================================
// KEYBOARD NAVIGATION
// ==============================================

/**
 * Setup keyboard navigation for accessibility
 * @param {Function} onEnterPress - Callback when Enter/Space is pressed
 */
export function setupKeyboardNavigation(onEnterPress) {
  let keyboardNavigationActive = false;
  
  document.addEventListener('keydown', (e) => {
    // Only trigger on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      // Prevent default space scroll behavior
      if (e.key === ' ') {
        e.preventDefault();
      }
      
      // Only fire once per key press
      if (!keyboardNavigationActive && onEnterPress) {
        keyboardNavigationActive = true;
        onEnterPress();
      }
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      keyboardNavigationActive = false;
    }
  });
}

// ==============================================
// EXPORT DEFAULT
// ==============================================

export default {
  initGSAP,
  EASINGS,
  EtherealParticles,
  CursorGradient,
  TextSplitter,
  IntroAnimations,
  LoadingAnimations,
  MainAnimations,
  UtilityAnimations,
  setupKeyboardNavigation
};
