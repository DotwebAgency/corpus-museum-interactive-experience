/**
 * CORPUS — Interactive Tutorial System
 * Guides users through discovering all gestures and sounds
 * 
 * "Every master was once a beginner. This is where the journey starts."
 */

// ==============================================
// TUTORIAL STEP DEFINITIONS
// ==============================================

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to CORPUS',
    subtitle: 'Your body is now a musical instrument',
    description: 'Let\'s learn the basics in 60 seconds. You\'ll discover how to create music and visual magic with just your movements.',
    icon: '✨',
    gesture: null, // No detection needed
    actionText: 'Start Tutorial',
    skipText: 'Skip — I\'ll explore'
  },
  {
    id: 'melody',
    title: 'Move Your Right Arm',
    subtitle: 'Up and down controls the melody',
    description: 'Raise your right arm high for high notes, lower it for low notes. The faster you move, the louder the sound.',
    icon: '🎵',
    gesture: 'rightArm',
    actionText: 'Move your arm up and down...',
    successText: 'Beautiful! You\'re making music!'
  },
  {
    id: 'bass',
    title: 'Now Your Left Arm',
    subtitle: 'Control the bass line',
    description: 'Your left arm creates deep bass notes. Move it up and down to add rhythm to your melody.',
    icon: '🎸',
    gesture: 'leftArm',
    actionText: 'Move your left arm...',
    successText: 'Feel that bass!'
  },
  {
    id: 'fist',
    title: 'Make a Fist',
    subtitle: 'Drums + Ethereal Sparks',
    description: 'Close your hand into a fist. Left fist = kick drum, Right fist = snare. Plus, watch the magical sparks appear!',
    icon: '✊',
    gesture: 'Closed_Fist',
    actionText: 'Close your fist...',
    successText: 'Boom! You summoned the sparks!'
  },
  {
    id: 'palm',
    title: 'Open Your Palm',
    subtitle: 'Strum a chord',
    description: 'Spread your fingers wide open. This triggers a beautiful chord strum and pushes the particles away.',
    icon: '✋',
    gesture: 'Open_Palm',
    actionText: 'Open your hand wide...',
    successText: 'What a lovely chord!'
  },
  {
    id: 'victory',
    title: 'Victory Sign',
    subtitle: 'Change the musical scale',
    description: 'Make a peace sign (✌️) to cycle through different musical scales: Pentatonic, Minor, Major, Blues, Japanese, Dorian.',
    icon: '✌️',
    gesture: 'Victory',
    actionText: 'Show the victory sign...',
    successText: 'Scale changed! Try different ones!'
  },
  {
    id: 'face',
    title: 'Use Your Face',
    subtitle: 'Expression = Effects',
    description: 'Open your mouth wide for a "wah" filter effect. Raise your eyebrows to add reverb. Smile to add vibrato!',
    icon: '😊',
    gesture: 'face',
    actionText: 'Try opening your mouth...',
    successText: 'You\'re a natural!'
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    subtitle: 'Go make some magic',
    description: 'You now know all the basics. Experiment, combine gestures, and create your own musical performance. Click the [?] button anytime to see the full guide.',
    icon: '🎉',
    gesture: null,
    actionText: 'Start Playing',
    skipText: null
  }
];

// ==============================================
// TUTORIAL MANAGER CLASS
// ==============================================

export class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.isComplete = false;
    this.overlay = null;
    this.gsap = null;
    this.onComplete = null;
    this.gestureCallback = null;
    this.detectionTimeout = null;
    this.hasDetectedGesture = false;
    
    // Check if tutorial was completed before
    this.wasCompletedBefore = localStorage.getItem('corpus-tutorial-complete') === 'true';
  }
  
  // ==============================================
  // INITIALIZATION
  // ==============================================
  
  init(gsap, gestureCallback) {
    this.gsap = gsap;
    this.gestureCallback = gestureCallback;
    this.createOverlay();
    console.log('[Tutorial] Initialized');
  }
  
  createOverlay() {
    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.id = 'tutorial-overlay';
    this.overlay.className = 'tutorial-overlay hidden';
    this.overlay.innerHTML = `
      <div class="tutorial-backdrop"></div>
      <div class="tutorial-card">
        <div class="tutorial-progress">
          <div class="tutorial-progress-bar"></div>
          <span class="tutorial-progress-text">1 / ${TUTORIAL_STEPS.length}</span>
        </div>
        
        <div class="tutorial-icon-container">
          <span class="tutorial-icon">✨</span>
        </div>
        
        <h2 class="tutorial-title">Welcome</h2>
        <p class="tutorial-subtitle">Your journey begins</p>
        <p class="tutorial-description">Loading...</p>
        
        <div class="tutorial-detection">
          <div class="tutorial-detection-ring"></div>
          <span class="tutorial-detection-text">Detecting...</span>
        </div>
        
        <div class="tutorial-actions">
          <button class="tutorial-btn tutorial-btn-primary">Continue</button>
          <button class="tutorial-btn tutorial-btn-secondary">Skip Tutorial</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Bind event listeners
    const primaryBtn = this.overlay.querySelector('.tutorial-btn-primary');
    const secondaryBtn = this.overlay.querySelector('.tutorial-btn-secondary');
    
    primaryBtn.addEventListener('click', () => this.handlePrimaryAction());
    secondaryBtn.addEventListener('click', () => this.skip());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === 'Enter') this.handlePrimaryAction();
      if (e.key === 'Escape') this.skip();
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
    this.overlay.classList.remove('hidden');
    
    // Animate entrance
    if (this.gsap) {
      this.gsap.fromTo(this.overlay.querySelector('.tutorial-backdrop'),
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      this.gsap.fromTo(this.overlay.querySelector('.tutorial-card'),
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
    
    this.renderStep();
    console.log('[Tutorial] Started');
    return true;
  }
  
  renderStep() {
    const step = TUTORIAL_STEPS[this.currentStep];
    if (!step) return;
    
    const card = this.overlay.querySelector('.tutorial-card');
    const icon = card.querySelector('.tutorial-icon');
    const title = card.querySelector('.tutorial-title');
    const subtitle = card.querySelector('.tutorial-subtitle');
    const description = card.querySelector('.tutorial-description');
    const detection = card.querySelector('.tutorial-detection');
    const detectionText = card.querySelector('.tutorial-detection-text');
    const primaryBtn = card.querySelector('.tutorial-btn-primary');
    const secondaryBtn = card.querySelector('.tutorial-btn-secondary');
    const progressBar = card.querySelector('.tutorial-progress-bar');
    const progressText = card.querySelector('.tutorial-progress-text');
    
    // Update content
    icon.textContent = step.icon;
    title.textContent = step.title;
    subtitle.textContent = step.subtitle;
    description.textContent = step.description;
    primaryBtn.textContent = step.actionText;
    
    // Progress
    const progress = ((this.currentStep + 1) / TUTORIAL_STEPS.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${this.currentStep + 1} / ${TUTORIAL_STEPS.length}`;
    
    // Show/hide detection area
    if (step.gesture) {
      detection.classList.remove('hidden');
      detection.classList.remove('success');
      detectionText.textContent = step.actionText;
      this.hasDetectedGesture = false;
      this.startDetectionTimeout();
    } else {
      detection.classList.add('hidden');
      clearTimeout(this.detectionTimeout);
    }
    
    // Show/hide skip button
    if (step.skipText) {
      secondaryBtn.classList.remove('hidden');
      secondaryBtn.textContent = step.skipText;
    } else if (this.currentStep === 0) {
      secondaryBtn.classList.remove('hidden');
      secondaryBtn.textContent = 'Skip — I\'ll explore';
    } else {
      secondaryBtn.classList.add('hidden');
    }
    
    // Final step special handling
    if (step.id === 'complete') {
      primaryBtn.textContent = 'Start Playing';
      secondaryBtn.classList.add('hidden');
    }
    
    // Animate content change
    if (this.gsap && this.currentStep > 0) {
      this.gsap.fromTo(icon, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      this.gsap.fromTo(title, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
      this.gsap.fromTo(description, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.1 });
    }
  }
  
  startDetectionTimeout() {
    clearTimeout(this.detectionTimeout);
    this.detectionTimeout = setTimeout(() => {
      if (!this.hasDetectedGesture && this.isActive) {
        // Show "skip this step" hint
        const detection = this.overlay.querySelector('.tutorial-detection');
        const primaryBtn = this.overlay.querySelector('.tutorial-btn-primary');
        primaryBtn.textContent = 'Skip This Step';
      }
    }, 8000); // 8 seconds to detect
  }
  
  // ==============================================
  // GESTURE DETECTION INTEGRATION
  // ==============================================
  
  checkGesture(gestureData) {
    if (!this.isActive || this.hasDetectedGesture) return;
    
    const step = TUTORIAL_STEPS[this.currentStep];
    if (!step || !step.gesture) return;
    
    let detected = false;
    
    switch (step.gesture) {
      case 'rightArm':
        // Check if right arm is moving significantly
        detected = gestureData.rightArmMoving;
        break;
      case 'leftArm':
        detected = gestureData.leftArmMoving;
        break;
      case 'Closed_Fist':
        detected = gestureData.gestures?.some(g => g?.name === 'Closed_Fist');
        break;
      case 'Open_Palm':
        detected = gestureData.gestures?.some(g => g?.name === 'Open_Palm');
        break;
      case 'Victory':
        detected = gestureData.gestures?.some(g => g?.name === 'Victory');
        break;
      case 'face':
        detected = gestureData.mouthOpen > 0.3;
        break;
    }
    
    if (detected) {
      this.onGestureDetected();
    }
  }
  
  onGestureDetected() {
    if (this.hasDetectedGesture) return;
    this.hasDetectedGesture = true;
    
    const step = TUTORIAL_STEPS[this.currentStep];
    const detection = this.overlay.querySelector('.tutorial-detection');
    const detectionText = this.overlay.querySelector('.tutorial-detection-text');
    const primaryBtn = this.overlay.querySelector('.tutorial-btn-primary');
    
    // Success animation
    detection.classList.add('success');
    detectionText.textContent = step.successText || 'Perfect!';
    primaryBtn.textContent = 'Continue';
    
    clearTimeout(this.detectionTimeout);
    
    // Celebration animation
    if (this.gsap) {
      this.gsap.to(detection, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }
    
    // Auto-advance after delay
    setTimeout(() => {
      if (this.isActive && this.hasDetectedGesture) {
        this.nextStep();
      }
    }, 1500);
  }
  
  // ==============================================
  // NAVIGATION
  // ==============================================
  
  handlePrimaryAction() {
    const step = TUTORIAL_STEPS[this.currentStep];
    
    if (step.id === 'welcome') {
      this.nextStep();
    } else if (step.id === 'complete') {
      this.complete();
    } else if (step.gesture && !this.hasDetectedGesture) {
      // Skip this detection step
      this.nextStep();
    } else {
      this.nextStep();
    }
  }
  
  nextStep() {
    this.currentStep++;
    
    if (this.currentStep >= TUTORIAL_STEPS.length) {
      this.complete();
      return;
    }
    
    // Animate out then in
    if (this.gsap) {
      const card = this.overlay.querySelector('.tutorial-card');
      this.gsap.to(card, {
        opacity: 0.5,
        x: -20,
        duration: 0.15,
        onComplete: () => {
          this.renderStep();
          this.gsap.fromTo(card,
            { opacity: 0.5, x: 20 },
            { opacity: 1, x: 0, duration: 0.15 }
          );
        }
      });
    } else {
      this.renderStep();
    }
  }
  
  skip() {
    console.log('[Tutorial] Skipped');
    this.hide();
    // Don't mark as complete - they can redo it
  }
  
  complete() {
    console.log('[Tutorial] Completed!');
    this.isComplete = true;
    localStorage.setItem('corpus-tutorial-complete', 'true');
    
    // Celebration animation
    if (this.gsap) {
      const card = this.overlay.querySelector('.tutorial-card');
      this.gsap.to(card, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => this.hide()
      });
    } else {
      this.hide();
    }
    
    if (this.onComplete) {
      this.onComplete();
    }
  }
  
  hide() {
    this.isActive = false;
    clearTimeout(this.detectionTimeout);
    
    if (this.gsap) {
      this.gsap.to(this.overlay.querySelector('.tutorial-card'), {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3
      });
      this.gsap.to(this.overlay.querySelector('.tutorial-backdrop'), {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          this.overlay.classList.add('hidden');
        }
      });
    } else {
      this.overlay.classList.add('hidden');
    }
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
  
  isShowing() {
    return this.isActive;
  }
  
  shouldShowOnStart() {
    return !this.wasCompletedBefore;
  }
}

// Export singleton
export const tutorialManager = new TutorialManager();
