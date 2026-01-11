/**
 * CORPUS — GSAP Animation System
 * Awwwards-quality animations for the digital portrait experience
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
// GSAP CONFIGURATION
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
// CUSTOM EASINGS
// ==============================================

export const EASINGS = {
  elegant: "power3.out",
  bounce: "elastic.out(1, 0.5)",
  smooth: "power2.inOut",
  snap: "power4.out",
  breathe: "sine.inOut",
  dramatic: "expo.out",
  soft: "power1.out",
  springy: "back.out(1.7)"
};

// ==============================================
// INTRO SCREEN ANIMATIONS
// ==============================================

export const IntroAnimations = {
  /**
   * Initial page load reveal sequence
   */
  pageReveal(gsap, elements) {
    const tl = gsap.timeline();
    
    // Kill any existing CSS animations
    gsap.set([
      elements.logo,
      elements.title,
      elements.tagline,
      elements.subtitle,
      elements.cta,
      elements.privacy,
      elements.footer
    ].filter(Boolean), { 
      clearProps: "animation",
      opacity: 0,
      y: 40
    });
    
    tl
      // Logo draws in
      .to(elements.logo, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASINGS.elegant
      })
      // Title reveals with subtle blur clear
      .to(elements.title, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: EASINGS.elegant
      }, "-=0.6")
      // Tagline
      .to(elements.tagline, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: EASINGS.soft
      }, "-=0.7")
      // Subtitle
      .to(elements.subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: EASINGS.soft
      }, "-=0.5")
      // CTA button with bounce
      .to(elements.cta, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: EASINGS.springy
      }, "-=0.4")
      // Privacy note
      .to(elements.privacy, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: EASINGS.soft
      }, "-=0.3")
      // Footer
      .to(elements.footer, {
        opacity: 1,
        duration: 0.5,
        ease: EASINGS.soft
      }, "-=0.3");
    
    return tl;
  },

  /**
   * Button hover animation - smooth, no clipping
   */
  createButtonHover(gsap, button) {
    const flourish = button.querySelector('.cta-flourish');
    
    const hoverTl = gsap.timeline({ paused: true })
      .to(button, {
        scale: 1.03,
        y: -4,
        boxShadow: "0 12px 48px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.2)",
        duration: 0.4,
        ease: EASINGS.smooth
      });
    
    if (flourish) {
      hoverTl.to(flourish, {
        x: 8,
        duration: 0.35,
        ease: EASINGS.smooth
      }, "-=0.35");
    }
    
    // Smooth enter/leave handling
    button.addEventListener('mouseenter', () => {
      hoverTl.timeScale(1).play();
    });
    
    button.addEventListener('mouseleave', () => {
      hoverTl.timeScale(1.2).reverse();
    });
    
    return hoverTl;
  },

  /**
   * Button press animation
   */
  buttonPress(gsap, button) {
    return gsap.timeline()
      .to(button, {
        scale: 0.97,
        duration: 0.1,
        ease: "power2.in"
      })
      .to(button, {
        scale: 1,
        duration: 0.2,
        ease: EASINGS.springy
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
        duration: 0.3,
        ease: "power2.in"
      })
      .to(elements.subtitle, {
        y: -30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2")
      .to(elements.tagline, {
        y: -30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2")
      .to(elements.title, {
        y: -40,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.2")
      .to(elements.logo, {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.3")
      .to([elements.privacy, elements.footer], {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.4")
      .to(elements.vignette, {
        opacity: 0,
        duration: 0.4
      }, "-=0.2")
      .to(elements.screen, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      }, "-=0.2");
    
    return tl;
  }
};

// ==============================================
// MAIN APP ANIMATIONS
// ==============================================

export const MainAnimations = {
  /**
   * Entry sequence for main app
   */
  entrySequence(gsap, elements) {
    const tl = gsap.timeline();
    
    // Setup initial states
    gsap.set(elements.mainApp, { display: 'flex', opacity: 1 });
    gsap.set(elements.frameBorders, { scaleX: 0, scaleY: 0, transformOrigin: 'center' });
    gsap.set(elements.header, { y: -60, opacity: 0 });
    gsap.set(elements.footer, { y: 60, opacity: 0 });
    gsap.set(elements.statusPanel, { x: 100, opacity: 0, scale: 0.9 });
    
    tl
      // Frames animate in from corners
      .to(elements.frameBorders, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: EASINGS.elegant
      })
      // Header slides down
      .to(elements.header, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: EASINGS.elegant
      }, "-=0.4")
      // Footer slides up
      .to(elements.footer, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: EASINGS.elegant
      }, "-=0.4")
      // Status panel enters with bounce
      .to(elements.statusPanel, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: EASINGS.springy
      }, "-=0.3");
    
    return tl;
  },

  /**
   * Status panel pulse when spark activates
   */
  sparkActivate(gsap, sparkIndicator) {
    gsap.set(sparkIndicator, { display: 'flex' });
    
    return gsap.timeline()
      .from(sparkIndicator, {
        opacity: 0,
        scale: 0.8,
        y: 10,
        duration: 0.4,
        ease: EASINGS.springy
      });
  },

  /**
   * Status panel hide when spark deactivates
   */
  sparkDeactivate(gsap, sparkIndicator) {
    return gsap.timeline()
      .to(sparkIndicator, {
        opacity: 0,
        scale: 0.9,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(sparkIndicator, { display: 'none' });
        }
      });
  },

  /**
   * Continuous spark orb pulse (when active)
   */
  createSparkPulse(gsap, sparkOrb, sparkIcon) {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
    
    tl.to(sparkOrb, {
      scale: 1.1,
      duration: 0.8,
      ease: EASINGS.breathe
    });
    
    // Icon subtle rotation
    gsap.to(sparkIcon, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: "none"
    });
    
    return tl;
  },

  /**
   * Theme toggle animation
   */
  themeToggle(gsap, button, isDark) {
    return gsap.timeline()
      .to(button, {
        rotation: isDark ? 0 : 180,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in"
      })
      .to(button, {
        scale: 1,
        duration: 0.3,
        ease: EASINGS.springy
      });
  },

  /**
   * Create hover for theme toggle
   */
  createThemeToggleHover(gsap, button) {
    const hoverTl = gsap.timeline({ paused: true })
      .to(button, {
        scale: 1.1,
        duration: 0.3,
        ease: EASINGS.smooth
      });
    
    button.addEventListener('mouseenter', () => hoverTl.play());
    button.addEventListener('mouseleave', () => hoverTl.reverse());
    
    return hoverTl;
  }
};

// ==============================================
// LOADING ANIMATIONS
// ==============================================

export const LoadingAnimations = {
  /**
   * Show loading overlay
   */
  show(gsap, overlay, text) {
    gsap.set(overlay, { display: 'flex', opacity: 0 });
    
    return gsap.timeline()
      .to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
  },

  /**
   * Hide loading overlay
   */
  hide(gsap, overlay) {
    return gsap.timeline()
      .to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        }
      });
  },

  /**
   * Update progress bar
   */
  updateProgress(gsap, progressBar, percent) {
    return gsap.to(progressBar, {
      width: `${percent}%`,
      duration: 0.5,
      ease: EASINGS.smooth
    });
  },

  /**
   * Create flame flicker animation
   */
  createFlameFlicker(gsap, flame) {
    return gsap.timeline({ repeat: -1 })
      .to(flame, {
        scaleX: 0.95,
        scaleY: 1.05,
        duration: 0.15,
        ease: "power1.inOut"
      })
      .to(flame, {
        scaleX: 1.02,
        scaleY: 0.98,
        duration: 0.12,
        ease: "power1.inOut"
      })
      .to(flame, {
        scaleX: 0.98,
        scaleY: 1.02,
        duration: 0.13,
        ease: "power1.inOut"
      });
  }
};

// ==============================================
// UTILITY ANIMATIONS
// ==============================================

export const UtilAnimations = {
  /**
   * Generic fade in
   */
  fadeIn(gsap, el, options = {}) {
    return gsap.to(el, {
      opacity: 1,
      duration: options.duration || 0.4,
      ease: options.ease || "power2.out",
      ...options
    });
  },

  /**
   * Generic fade out
   */
  fadeOut(gsap, el, options = {}) {
    return gsap.to(el, {
      opacity: 0,
      duration: options.duration || 0.3,
      ease: options.ease || "power2.in",
      ...options
    });
  },

  /**
   * Stagger reveal for multiple elements
   */
  staggerReveal(gsap, els, options = {}) {
    gsap.set(els, { opacity: 0, y: 20 });
    
    return gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.5,
      stagger: options.stagger || 0.1,
      ease: options.ease || EASINGS.soft,
      ...options
    });
  },

  /**
   * Subtle float animation for dust particles
   */
  createFloatAnimation(gsap, particle, index) {
    const delay = index * 0.2;
    const duration = 3 + Math.random() * 2;
    
    return gsap.to(particle, {
      y: `-=${50 + Math.random() * 30}`,
      x: `+=${(Math.random() - 0.5) * 20}`,
      opacity: 0,
      duration: duration,
      delay: delay,
      ease: "none",
      repeat: -1,
      repeatDelay: Math.random()
    });
  }
};

// ==============================================
// KEYBOARD HANDLER
// ==============================================

let keyboardNavigationActive = true;

export function setupKeyboardNavigation(callback) {
  document.addEventListener('keydown', (e) => {
    // Only trigger once (prevent double-firing)
    if (!keyboardNavigationActive) return;
    
    // Enter or Space triggers the action
    if (e.key === 'Enter' || e.key === ' ') {
      // Don't trigger if user is typing in an input
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // Disable to prevent multiple triggers during transition
        keyboardNavigationActive = false;
        callback();
        // Re-enable after transition completes
        setTimeout(() => {
          keyboardNavigationActive = true;
        }, 2000);
      }
    }
  });
}

export function disableKeyboardNavigation() {
  keyboardNavigationActive = false;
}

export function enableKeyboardNavigation() {
  keyboardNavigationActive = true;
}
