/**
 * CORPUS — Tutorial Side Panel
 * Slides in from the right, never blocks the character
 * 
 * "A gentle guide walking beside you, not a wall blocking your view."
 */

// ==============================================
// TUTORIAL STEP DEFINITIONS (Goldilocks: 5 steps)
// ==============================================

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'WELCOME',
    description: 'You are about to become art. Your body controls the experience.',
    icon: '✨',
    gesture: null,
    autoAdvance: 3000 // Auto-advance after 3s
  },
  {
    id: 'body',
    title: 'BODY',
    description: 'Step into the frame. The system will track 33 points on your body.',
    icon: '👤',
    gesture: 'body',
    waitText: 'Detecting...'
  },
  {
    id: 'gesture',
    title: 'GESTURES',
    description: 'Make a fist to summon ethereal sparks. Try it now!',
    icon: '✊',
    gesture: 'Closed_Fist',
    waitText: 'Show me a fist...'
  },
  {
    id: 'sound',
    title: 'SOUND',
    description: 'Click 🔊 Sound in the footer to enable music. Your arms become instruments!',
    icon: '🎵',
    gesture: 'sound',
    waitText: 'Enable sound...'
  },
  {
    id: 'complete',
    title: 'READY',
    description: 'You\'re all set! Click ? anytime for the full gesture guide.',
    icon: '🎉',
    gesture: null,
    autoAdvance: 3000
  }
];

// ==============================================
// TUTORIAL PANEL CLASS
// ==============================================

export class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.isComplete = false;
    this.panel = null;
    this.gsap = null;
    this.onComplete = null;
    this.gestureCallback = null;
    this.autoAdvanceTimer = null;
    
    // Check if tutorial was completed before
    this.wasCompletedBefore = localStorage.getItem('corpus-tutorial-complete') === 'true';
  }
  
  // ==============================================
  // INITIALIZATION
  // ==============================================
  
  init(gsap, gestureCallback) {
    this.gsap = gsap;
    this.gestureCallback = gestureCallback;
    this.createPanel();
    console.log('[Tutorial] Panel initialized');
  }
  
  createPanel() {
    // Create side panel container
    this.panel = document.createElement('aside');
    this.panel.id = 'tutorial-panel';
    this.panel.className = 'tutorial-panel';
    this.panel.setAttribute('aria-label', 'Tutorial');
    this.panel.innerHTML = `
      <div class="tutorial-panel-inner">
        <!-- Header -->
        <div class="tutorial-header">
          <span class="tutorial-step-label">Step <span id="tutorial-current">1</span>/<span id="tutorial-total">${TUTORIAL_STEPS.length}</span></span>
          <button class="tutorial-close" aria-label="Close tutorial">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        
        <!-- Progress dots -->
        <div class="tutorial-progress">
          ${TUTORIAL_STEPS.map((_, i) => `<span class="progress-dot${i === 0 ? ' active' : ''}" data-step="${i}"></span>`).join('')}
        </div>
        
        <!-- Content -->
        <div class="tutorial-content">
          <span class="tutorial-icon">✨</span>
          <h3 class="tutorial-title">WELCOME</h3>
          <p class="tutorial-description">Loading...</p>
          <div class="tutorial-wait hidden">
            <div class="tutorial-spinner"></div>
            <span class="tutorial-wait-text">Detecting...</span>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="tutorial-actions">
          <button class="tutorial-btn tutorial-btn-primary">Begin</button>
          <button class="tutorial-btn tutorial-btn-skip">Skip All</button>
        </div>
      </div>
    `;
    
    // Insert into main app (after header, before footer)
    const mainApp = document.querySelector('.main-app');
    if (mainApp) {
      mainApp.appendChild(this.panel);
    } else {
      document.body.appendChild(this.panel);
    }
    
    // Bind event listeners
    const closeBtn = this.panel.querySelector('.tutorial-close');
    const primaryBtn = this.panel.querySelector('.tutorial-btn-primary');
    const skipBtn = this.panel.querySelector('.tutorial-btn-skip');
    
    closeBtn.addEventListener('click', () => this.hide());
    primaryBtn.addEventListener('click', () => this.handlePrimaryAction());
    skipBtn.addEventListener('click', () => this.skip());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === 'Enter') this.handlePrimaryAction();
      if (e.key === 'Escape') this.hide();
    });
  }
  
  // ==============================================
  // TUTORIAL FLOW
  // ==============================================
  
  start() {
    if (this.wasCompletedBefore) {
      console.log('[Tutorial] Already completed before, skipping');
      return false;
    }
    
    this.isActive = true;
    this.currentStep = 0;
    this.showStep(0);
    this.show();
    
    return true;
  }
  
  show() {
    this.panel.classList.add('visible');
    
    if (this.gsap) {
      this.gsap.fromTo(this.panel,
        { x: '100%' },
        { x: '0%', duration: 0.3, ease: 'power2.out' }
      );
    }
  }
  
  hide() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
    }
    
    if (this.gsap) {
      this.gsap.to(this.panel, {
        x: '100%',
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          this.panel.classList.remove('visible');
          this.isActive = false;
        }
      });
    } else {
      this.panel.classList.remove('visible');
      this.isActive = false;
    }
  }
  
  showStep(index) {
    const step = TUTORIAL_STEPS[index];
    if (!step) return;
    
    // Update step counter
    this.panel.querySelector('#tutorial-current').textContent = index + 1;
    
    // Update progress dots
    this.panel.querySelectorAll('.progress-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.classList.toggle('complete', i < index);
    });
    
    // Update content
    const icon = this.panel.querySelector('.tutorial-icon');
    const title = this.panel.querySelector('.tutorial-title');
    const desc = this.panel.querySelector('.tutorial-description');
    const waitEl = this.panel.querySelector('.tutorial-wait');
    const waitText = this.panel.querySelector('.tutorial-wait-text');
    const primaryBtn = this.panel.querySelector('.tutorial-btn-primary');
    const skipBtn = this.panel.querySelector('.tutorial-btn-skip');
    
    // Animate out old content, then in new
    if (this.gsap) {
      const tl = this.gsap.timeline();
      
      tl.to([icon, title, desc], {
        opacity: 0,
        y: -10,
        duration: 0.15,
        stagger: 0.03
      });
      
      tl.call(() => {
        icon.textContent = step.icon;
        title.textContent = step.title;
        desc.textContent = step.description;
        
        // Show/hide wait indicator
        if (step.gesture && step.gesture !== 'body' && step.gesture !== 'sound') {
          waitEl.classList.remove('hidden');
          waitText.textContent = step.waitText || 'Detecting...';
          primaryBtn.style.display = 'none';
        } else if (step.gesture === 'body' || step.gesture === 'sound') {
          waitEl.classList.remove('hidden');
          waitText.textContent = step.waitText || 'Waiting...';
          primaryBtn.style.display = 'none';
        } else {
          waitEl.classList.add('hidden');
          primaryBtn.style.display = 'block';
          primaryBtn.textContent = index === 0 ? 'Begin' : 
                                   index === TUTORIAL_STEPS.length - 1 ? 'Start Playing' : 'Continue';
        }
        
        // Show/hide skip button
        skipBtn.style.display = index === TUTORIAL_STEPS.length - 1 ? 'none' : 'block';
      });
      
      tl.to([icon, title, desc], {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.05
      });
    } else {
      icon.textContent = step.icon;
      title.textContent = step.title;
      desc.textContent = step.description;
    }
    
    // Auto-advance if specified
    if (step.autoAdvance && index > 0) {
      this.autoAdvanceTimer = setTimeout(() => {
        if (index === TUTORIAL_STEPS.length - 1) {
          this.complete();
        } else {
          this.nextStep();
        }
      }, step.autoAdvance);
    }
  }
  
  handlePrimaryAction() {
    const step = TUTORIAL_STEPS[this.currentStep];
    
    if (this.currentStep === TUTORIAL_STEPS.length - 1) {
      // Last step - complete
      this.complete();
    } else if (!step.gesture) {
      // No gesture needed - advance
      this.nextStep();
    }
    // Otherwise, wait for gesture detection
  }
  
  nextStep() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
    }
    
    this.currentStep++;
    if (this.currentStep >= TUTORIAL_STEPS.length) {
      this.complete();
    } else {
      this.showStep(this.currentStep);
    }
  }
  
  skip() {
    this.complete();
  }
  
  complete() {
    this.isComplete = true;
    localStorage.setItem('corpus-tutorial-complete', 'true');
    
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
    }
    
    this.hide();
    
    if (this.onComplete) {
      this.onComplete();
    }
    
    console.log('[Tutorial] Complete!');
  }
  
  // ==============================================
  // GESTURE DETECTION CALLBACK
  // ==============================================
  
  checkGesture(gestureType, data = {}) {
    if (!this.isActive) return;
    
    const step = TUTORIAL_STEPS[this.currentStep];
    if (!step || !step.gesture) return;
    
    let detected = false;
    
    switch (step.gesture) {
      case 'body':
        // Check if body is detected
        detected = data.bodyDetected === true;
        break;
        
      case 'sound':
        // Check if sound was enabled
        detected = data.soundEnabled === true;
        break;
        
      case 'Closed_Fist':
        detected = gestureType === 'Closed_Fist';
        break;
        
      case 'Open_Palm':
        detected = gestureType === 'Open_Palm';
        break;
        
      case 'scale_change':
        detected = gestureType === 'ILoveYou' || gestureType === 'Thumb_Down' || gestureType === 'Victory';
        break;
        
      case 'face':
        detected = data.mouthOpen === true;
        break;
    }
    
    if (detected) {
      this.onGestureSuccess();
    }
  }
  
  onGestureSuccess() {
    const waitEl = this.panel.querySelector('.tutorial-wait');
    const waitText = this.panel.querySelector('.tutorial-wait-text');
    
    // Show success
    waitText.textContent = '✓ Perfect!';
    waitEl.classList.add('success');
    
    // Advance after brief delay
    setTimeout(() => {
      waitEl.classList.remove('success');
      this.nextStep();
    }, 800);
  }
  
  // ==============================================
  // PUBLIC API
  // ==============================================
  
  restart() {
    localStorage.removeItem('corpus-tutorial-complete');
    this.wasCompletedBefore = false;
    this.currentStep = 0;
    this.isComplete = false;
    this.start();
  }
  
  isRunning() {
    return this.isActive;
  }
}

// Export singleton instance
export const tutorialManager = new TutorialManager();
