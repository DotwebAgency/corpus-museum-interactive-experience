/**
 * CORPUS — Tutorial Side Panel
 * Slides in from the right, never blocks the character
 * Uses Phosphor Icons for clean, modern look
 */

// ==============================================
// TUTORIAL STEP DEFINITIONS (5 steps - Goldilocks)
// ==============================================

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'WELCOME',
    description: 'Your body becomes the instrument. Your movement becomes art.',
    icon: 'sparkle',
    gesture: null,
    autoAdvance: 3000
  },
  {
    id: 'body',
    title: 'STEP INTO FRAME',
    description: 'Position yourself so the camera can see your upper body.',
    icon: 'user',
    gesture: 'body',
    waitText: 'Detecting your presence...'
  },
  {
    id: 'gesture',
    title: 'MAKE A FIST',
    description: 'Close your hand to summon ethereal sparks around you.',
    icon: 'hand-fist',
    gesture: 'Closed_Fist',
    waitText: 'Show me a fist...'
  },
  {
    id: 'sound',
    title: 'ENABLE SOUND',
    description: 'Click the sound button in the footer. Your arms become instruments!',
    icon: 'speaker-high',
    gesture: 'sound',
    waitText: 'Enable sound below...'
  },
  {
    id: 'complete',
    title: 'YOU\'RE READY',
    description: 'Explore! Click the help button anytime for the full gesture guide.',
    icon: 'check-circle',
    gesture: null,
    autoAdvance: 3000
  }
];

// Phosphor icon SVGs (weight: regular)
const PHOSPHOR_ICONS = {
  'sparkle': '<svg viewBox="0 0 256 256"><path d="M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19.06,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144Z" fill="currentColor"/></svg>',
  'user': '<svg viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" fill="currentColor"/></svg>',
  'hand-fist': '<svg viewBox="0 0 256 256"><path d="M200,80H184V64a32,32,0,0,0-56-21.13A32,32,0,0,0,72,64v8a32,32,0,0,0-32,32v40a96,96,0,0,0,192,0V112A32,32,0,0,0,200,80ZM88,64a16,16,0,0,1,32,0v40a16,16,0,0,1-32,0Zm48,0a16,16,0,0,1,32,0V80H136Zm80,80a80,80,0,0,1-160,0V104a16,16,0,0,1,16-16v16a32,32,0,0,0,64,0V80h32v24a32,32,0,0,0,64,0,16,16,0,0,1,16,16v24Zm-16-24a16,16,0,0,1-32,0V96h16a16,16,0,0,1,16,16Z" fill="currentColor"/></svg>',
  'speaker-high': '<svg viewBox="0 0 256 256"><path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM144,207.64,84.91,161.69A7.94,7.94,0,0,0,80,160H32V96H80a7.94,7.94,0,0,0,4.91-1.69L144,48.36ZM200,128a40,40,0,0,1-16,32,8,8,0,0,1-9.6-12.8,24,24,0,0,0,0-38.4,8,8,0,0,1,9.6-12.8A40,40,0,0,1,200,128Zm32,0a72,72,0,0,1-28.8,57.6,8,8,0,0,1-9.6-12.8,56,56,0,0,0,0-89.6,8,8,0,0,1,9.6-12.8A72,72,0,0,1,232,128Z" fill="currentColor"/></svg>',
  'check-circle': '<svg viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" fill="currentColor"/></svg>',
  'caret-right': '<svg viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" fill="currentColor"/></svg>',
  'x': '<svg viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" fill="currentColor"/></svg>',
  'circle-notch': '<svg viewBox="0 0 256 256"><path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z" fill="currentColor"/></svg>'
};

// ==============================================
// TUTORIAL MANAGER CLASS
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
    console.log('[Tutorial] Initialized, completed before:', this.wasCompletedBefore);
  }
  
  createPanel() {
    this.panel = document.createElement('aside');
    this.panel.id = 'tutorial-panel';
    this.panel.className = 'tutorial-panel';
    this.panel.setAttribute('aria-label', 'Tutorial');
    this.panel.innerHTML = `
      <div class="tutorial-panel-inner">
        <!-- Close button -->
        <button class="tutorial-close" aria-label="Close tutorial">
          ${PHOSPHOR_ICONS['x']}
        </button>
        
        <!-- Progress -->
        <div class="tutorial-progress">
          <span class="tutorial-step-num" id="tutorial-current">1</span>
          <span class="tutorial-step-sep">/</span>
          <span class="tutorial-step-total">${TUTORIAL_STEPS.length}</span>
        </div>
        
        <!-- Progress bar -->
        <div class="tutorial-progress-bar">
          <div class="tutorial-progress-fill" id="tutorial-progress-fill"></div>
        </div>
        
        <!-- Content -->
        <div class="tutorial-content">
          <div class="tutorial-icon" id="tutorial-icon">
            ${PHOSPHOR_ICONS['sparkle']}
          </div>
          <h3 class="tutorial-title" id="tutorial-title">WELCOME</h3>
          <p class="tutorial-description" id="tutorial-desc">Loading...</p>
        </div>
        
        <!-- Wait indicator -->
        <div class="tutorial-wait hidden" id="tutorial-wait">
          <div class="tutorial-spinner">
            ${PHOSPHOR_ICONS['circle-notch']}
          </div>
          <span class="tutorial-wait-text" id="tutorial-wait-text">Detecting...</span>
        </div>
        
        <!-- Actions -->
        <div class="tutorial-actions">
          <button class="tutorial-btn tutorial-btn-primary" id="tutorial-primary">Begin</button>
          <button class="tutorial-btn tutorial-btn-skip" id="tutorial-skip">Skip All</button>
        </div>
      </div>
    `;
    
    // Insert into main app
    const mainApp = document.querySelector('.main-app');
    if (mainApp) {
      mainApp.appendChild(this.panel);
    } else {
      document.body.appendChild(this.panel);
    }
    
    // Bind events
    this.panel.querySelector('.tutorial-close').addEventListener('click', () => this.hide());
    this.panel.querySelector('#tutorial-primary').addEventListener('click', () => this.handlePrimaryAction());
    this.panel.querySelector('#tutorial-skip').addEventListener('click', () => this.skip());
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === 'Enter') this.handlePrimaryAction();
      if (e.key === 'Escape') this.hide();
    });
  }
  
  // ==============================================
  // PUBLIC API (matches what app.js expects)
  // ==============================================
  
  shouldShowOnStart() {
    return !this.wasCompletedBefore;
  }
  
  isShowing() {
    return this.isActive;
  }
  
  isRunning() {
    return this.isActive;
  }
  
  // ==============================================
  // TUTORIAL FLOW
  // ==============================================
  
  start() {
    if (this.wasCompletedBefore) {
      console.log('[Tutorial] Already completed, not showing');
      return false;
    }
    
    console.log('[Tutorial] Starting...');
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
    
    console.log('[Tutorial] Showing step:', index, step.id);
    
    // Update progress
    this.panel.querySelector('#tutorial-current').textContent = index + 1;
    const progressFill = this.panel.querySelector('#tutorial-progress-fill');
    progressFill.style.width = `${((index + 1) / TUTORIAL_STEPS.length) * 100}%`;
    
    // Get elements
    const iconEl = this.panel.querySelector('#tutorial-icon');
    const titleEl = this.panel.querySelector('#tutorial-title');
    const descEl = this.panel.querySelector('#tutorial-desc');
    const waitEl = this.panel.querySelector('#tutorial-wait');
    const waitText = this.panel.querySelector('#tutorial-wait-text');
    const primaryBtn = this.panel.querySelector('#tutorial-primary');
    const skipBtn = this.panel.querySelector('#tutorial-skip');
    
    // Update content
    iconEl.innerHTML = PHOSPHOR_ICONS[step.icon] || PHOSPHOR_ICONS['sparkle'];
    titleEl.textContent = step.title;
    descEl.textContent = step.description;
    
    // Show/hide wait indicator based on step type
    if (step.gesture && !step.autoAdvance) {
      waitEl.classList.remove('hidden');
      waitText.textContent = step.waitText || 'Detecting...';
      primaryBtn.style.display = 'none';
    } else {
      waitEl.classList.add('hidden');
      primaryBtn.style.display = 'block';
      
      if (index === 0) {
        primaryBtn.textContent = 'Begin';
      } else if (index === TUTORIAL_STEPS.length - 1) {
        primaryBtn.textContent = 'Start Creating';
      } else {
        primaryBtn.textContent = 'Continue';
      }
    }
    
    // Hide skip on last step
    skipBtn.style.display = index === TUTORIAL_STEPS.length - 1 ? 'none' : 'block';
    
    // Auto-advance for welcome/complete steps
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
      this.complete();
    } else if (!step.gesture) {
      this.nextStep();
    }
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
  // GESTURE DETECTION (called from app.js)
  // ==============================================
  
  checkGesture(gestureData) {
    if (!this.isActive) return;
    
    const step = TUTORIAL_STEPS[this.currentStep];
    if (!step || !step.gesture) return;
    
    let detected = false;
    
    console.log('[Tutorial] Checking gesture for step:', step.id, 'gestureData:', gestureData);
    
    switch (step.gesture) {
      case 'body':
        // Check if body is detected (pose exists)
        detected = gestureData.bodyDetected === true;
        break;
        
      case 'sound':
        // Check if sound was enabled
        detected = gestureData.soundEnabled === true;
        break;
        
      case 'Closed_Fist':
        // Check if any hand has closed fist
        if (gestureData.gestures) {
          detected = gestureData.gestures.some(g => g && g.name === 'Closed_Fist');
        }
        break;
        
      case 'Open_Palm':
        if (gestureData.gestures) {
          detected = gestureData.gestures.some(g => g && g.name === 'Open_Palm');
        }
        break;
    }
    
    if (detected) {
      console.log('[Tutorial] Gesture detected!');
      this.onGestureSuccess();
    }
  }
  
  onGestureSuccess() {
    const waitEl = this.panel.querySelector('#tutorial-wait');
    const waitText = this.panel.querySelector('#tutorial-wait-text');
    
    // Show success
    waitText.innerHTML = `${PHOSPHOR_ICONS['check-circle']} Perfect!`;
    waitEl.classList.add('success');
    
    // Advance after brief delay
    setTimeout(() => {
      waitEl.classList.remove('success');
      this.nextStep();
    }, 800);
  }
  
  restart() {
    localStorage.removeItem('corpus-tutorial-complete');
    this.wasCompletedBefore = false;
    this.currentStep = 0;
    this.isComplete = false;
    this.start();
  }
}

// Export singleton
export const tutorialManager = new TutorialManager();
