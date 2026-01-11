/**
 * CORPUS — Digital Portrait Experience
 * Main Application Controller
 * "Behold the form."
 */

import { MediaPipeTracker } from './mediapipe-tracker.js';
import { HumanAvatarRenderer, ScanningGrid } from './human-avatar.js';
import { 
  initGSAP, 
  IntroAnimations, 
  MainAnimations, 
  LoadingAnimations,
  setupKeyboardNavigation 
} from './animations.js';
import { bodyInstrument } from './body-instrument.js';
import { tutorialManager } from './tutorial.js';
import { helpModal } from './help-modal.js';
import { introSounds } from './intro-sounds.js';

// ==============================================
// STATE
// ==============================================

const state = {
  isRunning: false,
  isDetected: false,
  detectionMode: 'none',
  theme: 'light', // Light mode is default
  fps: 0,
  frameCount: 0,
  lastFpsTime: 0,
  lastFrameTime: 0,
  sparkActive: false,
  gsap: null,
  buttonHoverTl: null,
  sparkPulseTl: null,
  animationsReady: false,
  currentGestures: [], // Native MediaPipe gesture detection
  cinemaMode: false,   // Fullscreen cinema mode for recording
  soundEnabled: false  // Musical Body Instrument enabled state
};

// Roman numerals
const toRoman = (num) => {
  if (num <= 0 || num > 100) return num.toString();
  const vals = [100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
  }
  return result;
};

// ==============================================
// DOM ELEMENTS
// ==============================================

const elements = {};

function getElements() {
  elements.introScreen = document.getElementById('intro-screen');
  elements.mainApp = document.getElementById('main-app');
  elements.loadingOverlay = document.getElementById('loading-overlay');
  elements.enableCameraBtn = document.getElementById('enable-camera-btn');
  elements.mainCanvas = document.getElementById('main-canvas');
  elements.cameraVideo = document.getElementById('camera-video');
  elements.modeLatin = document.getElementById('mode-latin');
  elements.statusDot = document.getElementById('status-dot');
  elements.statusText = document.getElementById('status-text');
  elements.bodyStatus = document.getElementById('body-status');
  elements.handsStatus = document.getElementById('hands-status');
  elements.faceStatus = document.getElementById('face-status');
  elements.landmarkCount = document.getElementById('landmark-count');
  elements.fpsCounter = document.getElementById('fps-counter');
  elements.loadingText = document.getElementById('loading-text');
  elements.loadingBar = document.getElementById('loading-bar');
  elements.themeToggle = document.getElementById('theme-toggle');
  
  // New detection panel elements
  elements.detectionPanel = document.getElementById('detection-panel');
  elements.panelStatusDot = document.getElementById('panel-status-dot');
  elements.gestureLabel = document.getElementById('gesture-label');
  elements.gestureFist = document.getElementById('gesture-fist');
  elements.gesturePalm = document.getElementById('gesture-palm');
  elements.gestureIdle = document.getElementById('gesture-idle');
  elements.bodyIndicator = document.getElementById('body-indicator');
  elements.handsIndicator = document.getElementById('hands-indicator');
  elements.faceIndicator = document.getElementById('face-indicator');
  elements.bodyLandmarks = document.getElementById('body-landmarks');
  elements.handLandmarks = document.getElementById('hand-landmarks');
  elements.faceLandmarks = document.getElementById('face-landmarks');
  elements.particleCount = document.getElementById('particle-count');
  
  // NEW: Left/Right hand detection elements
  elements.leftHandIndicator = document.querySelector('.hand-indicator:first-child');
  elements.rightHandIndicator = document.querySelector('.hand-indicator:last-child');
  elements.leftGestureState = document.getElementById('left-gesture-state');
  elements.rightGestureState = document.getElementById('right-gesture-state');
  
  // NEW: Awakening overlay elements (AWWWARD quality)
  elements.awakeningOverlay = document.getElementById('awakening-overlay');
  elements.awakeningPercent = document.getElementById('awakening-percent');
  elements.awakeningStatus = document.getElementById('awakening-status');
  elements.awakeningProgressFill = document.getElementById('awakening-progress-fill');
  elements.awakeningEyeRays = document.querySelector('.eye-rays');
  
  // GSAP-First Loading Elements
  elements.loadingHistoryText = document.getElementById('loading-history-text');
  elements.loadingInstrumentIcons = document.getElementById('loading-instrument-icons');
  elements.loadingProgressBar = document.getElementById('loading-progress-bar');
  elements.loadingProgressFill = document.getElementById('loading-progress-fill');
  
  // GSAP-First Intro Elements
  elements.introHistoryText = document.getElementById('intro-history-text');
  elements.portalButton = document.querySelector('.intro-portal-button');
  elements.portalRingOuter = document.getElementById('portal-ring-outer');
  elements.portalRingInner = document.getElementById('portal-ring-inner');
  elements.portalVitruvian = document.getElementById('portal-vitruvian');
  elements.portalText = document.getElementById('portal-text');
  elements.introTitleWrapper = document.getElementById('intro-title-wrapper');
  elements.introTaglineWrapper = document.getElementById('intro-tagline-wrapper');
  elements.introScrollIndicator = document.getElementById('intro-scroll-indicator');
  
  // Legacy alias
  elements.statusPanel = elements.detectionPanel;
  elements.appHeader = document.querySelector('.app-header');
  elements.appFooter = document.querySelector('.app-footer');
  elements.frameBorders = document.querySelectorAll('.frame-border');
  elements.candleFlame = document.querySelector('.candle-flame');
  
  // NEW: Footer status elements (integrated status bar)
  elements.footerBodyStatus = document.getElementById('footer-body-status');
  elements.footerHandsStatus = document.getElementById('footer-hands-status');
  elements.footerFaceStatus = document.getElementById('footer-face-status');
  elements.footerLandmarks = document.getElementById('footer-landmarks');
  elements.footerParticles = document.getElementById('footer-particles');
  
  // NEW: Detection pills
  elements.detectBody = document.getElementById('detect-body');
  elements.detectHands = document.getElementById('detect-hands');
  elements.detectFace = document.getElementById('detect-face');
  
  // NEW: Hand gesture indicators
  elements.leftHandGesture = document.getElementById('left-hand-gesture');
  elements.rightHandGesture = document.getElementById('right-hand-gesture');
  
  // Intro elements for animation
  elements.introLogo = document.querySelector('.intro-logo');
  elements.introTitle = document.querySelector('.intro-title');
  elements.introTagline = document.querySelector('.intro-tagline');
  elements.introSubtitle = document.querySelector('.intro-subtitle');
  elements.introPrivacy = document.querySelector('.intro-privacy');
  elements.introFooter = document.querySelector('.intro-footer');
  elements.introVignette = document.querySelector('.intro-vignette');
  elements.ctaFlourish = document.querySelector('.cta-flourish');
  
  // Sound controls (Musical Body Instrument)
  elements.soundToggle = document.getElementById('sound-toggle');
  elements.scaleSelect = document.getElementById('scale-select');
  elements.footerInstruction = document.getElementById('footer-instruction');
  
  // Help button
  elements.helpBtn = document.getElementById('help-btn');
  
  // Gesture palette
  elements.gesturePalette = document.getElementById('gesture-palette');
  elements.gestureFistItem = document.getElementById('gesture-fist');
  elements.gesturePalmItem = document.getElementById('gesture-palm');
  elements.gesturePointItem = document.getElementById('gesture-point');
  elements.gestureVictoryItem = document.getElementById('gesture-victory');
  elements.gestureThumbItem = document.getElementById('gesture-thumb');
}

// ==============================================
// SYSTEMS
// ==============================================

let tracker = null;
let avatarRenderer = null;
let scanningGrid = null;
let mainCtx = null;

// ==============================================
// GSAP INITIALIZATION & ANIMATIONS
// ==============================================

async function initAnimations() {
  state.gsap = await initGSAP();
  const gsap = state.gsap;
  
  // Initialize AWWWARD-quality ambient effects (particles, cursor gradient)
  IntroAnimations.initAmbient(gsap, elements.introScreen);
  
  // Check if this is the new GSAP-first intro
  const isGSAPFirst = elements.introScreen.classList.contains('gsap-first-experience');
  
  if (isGSAPFirst) {
    // GSAP-First Experience - Animate logo with path drawing
    if (elements.introLogo) {
      IntroAnimations.animateLogo(gsap, elements.introLogo);
    }
    
    // Initialize portal button with hover effects and sounds
    if (elements.portalButton) {
      IntroAnimations.initPortalButton(gsap, elements.portalButton);
      
      // Initialize intro sounds for portal interaction
      introSounds.initialize();
      
      // Add portal hover sound
      elements.portalButton.addEventListener('mouseenter', () => {
        introSounds.playPortalHover();
      });
    }
    
    // Start historical quotes rotation
    if (elements.introHistoryText) {
      IntroAnimations.startQuotesRotation(gsap, elements.introHistoryText);
    }
    
    // Animate scroll indicator
    if (elements.introScrollIndicator) {
      gsap.to(elements.introScrollIndicator, {
        opacity: 1,
        duration: 1,
        delay: 4,
        ease: 'power2.out'
      });
    }
    
    // GSAP-First specific reveal - use wrappers and portal button
    const gsapFirstElements = {
      logo: elements.introLogo,
      title: elements.introTitleWrapper || elements.introTitle,
      tagline: elements.introTaglineWrapper || elements.introTagline,
      subtitle: elements.introHistoryText, // History text replaces subtitle
      cta: elements.portalButton,
      privacy: elements.introPrivacy,
      footer: elements.introFooter
    };
    
    IntroAnimations.pageReveal(gsap, gsapFirstElements);
  } else {
    // Legacy intro reveal sequence
  const introElements = {
    logo: elements.introLogo,
    title: elements.introTitle,
    tagline: elements.introTagline,
    subtitle: elements.introSubtitle,
    cta: elements.enableCameraBtn,
    privacy: elements.introPrivacy,
    footer: elements.introFooter
  };
  
  IntroAnimations.pageReveal(gsap, introElements);
  
    // Setup button hover animation (for legacy button)
    if (elements.enableCameraBtn) {
  state.buttonHoverTl = IntroAnimations.createButtonHover(gsap, elements.enableCameraBtn);
    }
  }
  
  // Setup keyboard navigation
  setupKeyboardNavigation(() => {
    if (!elements.introScreen.classList.contains('hidden')) {
      const btn = elements.enableCameraBtn || elements.portalButton;
      if (btn) btn.click();
    }
  });
  
  // Setup flame flicker (if exists)
  if (elements.candleFlame) {
    // Note: createFlameFlicker removed in new animations.js
  }
  
  // Setup header button hovers
  if (elements.themeToggle) {
    MainAnimations.createHeaderButtonHover(gsap, elements.themeToggle);
  }
  if (elements.fullscreenToggle) {
    MainAnimations.createHeaderButtonHover(gsap, elements.fullscreenToggle);
  }
  
  state.animationsReady = true;
  console.log('[CORPUS] AWWWARD-quality GSAP animations initialized');
}

// ==============================================
// THEME
// ==============================================

function initTheme() {
  const saved = localStorage.getItem('corpus-theme');
  if (saved) {
    state.theme = saved;
  }
  applyTheme(state.theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
  if (avatarRenderer) avatarRenderer.setTheme(theme);
  if (scanningGrid) scanningGrid.setTheme(theme);
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('corpus-theme', newTheme);
  
  // Animate theme toggle
  if (state.gsap && elements.themeToggle) {
    MainAnimations.themeToggle(state.gsap, elements.themeToggle, newTheme === 'dark');
  }
  
  applyTheme(newTheme);
}

// ==============================================
// CANVAS
// ==============================================

function initCanvas() {
  mainCtx = elements.mainCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.isRunning) requestAnimationFrame(resizeCanvas);
  });
  const observer = new MutationObserver(() => {
    if (!elements.mainApp.classList.contains('hidden')) requestAnimationFrame(resizeCanvas);
  });
  observer.observe(elements.mainApp, { attributes: true, attributeFilter: ['class'] });
}

function resizeCanvas() {
  if (!elements.mainCanvas?.parentElement) return;
  const rect = elements.mainCanvas.parentElement.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    elements.mainCanvas.width = rect.width;
    elements.mainCanvas.height = rect.height;
  }
}

// ==============================================
// CAMERA
// ==============================================

async function handleEnableCamera() {
  const gsap = state.gsap;
  const isGSAPFirst = elements.introScreen.classList.contains('gsap-first-experience');
  
  // Determine which button was clicked
  const clickedButton = elements.portalButton || elements.enableCameraBtn;
  
  // Portal transition for GSAP-first, simple fade for legacy
  if (gsap && isGSAPFirst && clickedButton) {
    // Play portal activation sound
    introSounds.playPortalActivate();
    
    // Use portal expansion transition
    IntroAnimations.portalTransition(gsap, clickedButton, () => {
      // Portal animation complete, hide intro
      elements.introScreen.style.visibility = 'hidden';
      elements.introScreen.classList.add('hidden');
    });
  } else if (gsap) {
    // Legacy button press animation
    IntroAnimations.buttonPress(gsap, elements.enableCameraBtn);
    
    gsap.to(elements.introScreen, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        elements.introScreen.style.visibility = 'hidden';
        elements.introScreen.classList.add('hidden');
      }
    });
  } else {
    elements.introScreen.style.opacity = '0';
    elements.introScreen.style.visibility = 'hidden';
    elements.introScreen.classList.add('hidden');
  }
  
  // Show awakening overlay (which is now on top of the fading intro)
  showAwakening();
  
  try {
    tracker = new MediaPipeTracker();
    await tracker.initialize(
      elements.cameraVideo,
      handleTrackingResults,
      (progress, msg) => updateAwakeningProgress(progress * 100, msg)
    );
    
    avatarRenderer = new HumanAvatarRenderer();
    avatarRenderer.setTheme(state.theme);
    
    scanningGrid = new ScanningGrid();
    scanningGrid.setTheme(state.theme);
    
    // Brief pause at 100% before transition
    await new Promise(r => setTimeout(r, 300));
    await hideAwakening();
    // Now transition directly to main app - skip intro screen entirely
    transitionToMainDirect();
  } catch (error) {
    console.error('[CORPUS] Init failed:', error);
    hideAwakening();
    alert('Error: ' + error.message);
  }
}

// ===== AWAKENING OVERLAY FUNCTIONS =====
function showAwakening() {
  if (elements.awakeningOverlay) {
    // Reset state
    elements.awakeningOverlay.classList.remove('hidden');
    elements.awakeningOverlay.style.opacity = '1';
    elements.awakeningOverlay.style.visibility = 'visible';
    
    if (elements.awakeningPercent) elements.awakeningPercent.textContent = '0';
    if (elements.awakeningStatus) elements.awakeningStatus.textContent = 'Awakening the instruments...';
    if (elements.loadingProgressFill) elements.loadingProgressFill.style.width = '0%';
    
    // Initialize intro sounds
    introSounds.initialize().then(() => {
      introSounds.startDrone();
    });
    
    // Use GSAP-first awakening entry if available
    if (state.gsap) {
      const awakeningElements = {
        overlay: elements.awakeningOverlay,
        content: elements.awakeningOverlay.querySelector('.awakening-content'),
        historyText: elements.loadingHistoryText,
        instrumentIcons: elements.loadingInstrumentIcons,
        progressBar: elements.loadingProgressBar,
        progressTrack: elements.awakeningOverlay.querySelector('.awakening-progress-track'),
        status: elements.awakeningStatus
      };
      
      LoadingAnimations.awakeningEntry(state.gsap, awakeningElements);
    }
  }
}

function updateAwakeningProgress(percent, status) {
  const roundedPercent = Math.round(percent);
  
  // Update percentage display
  if (elements.awakeningPercent) {
    elements.awakeningPercent.textContent = roundedPercent;
  }
  
  // Update progress bar fill (old style)
  if (elements.awakeningProgressFill) {
    elements.awakeningProgressFill.style.width = `${roundedPercent}%`;
    
    // At 100%, add extra glow
    if (roundedPercent >= 100) {
      elements.awakeningProgressFill.style.boxShadow = '0 0 30px var(--gold-glow)';
    }
  }
  
  // Update new GSAP-first progress bar
  if (elements.loadingProgressFill) {
    elements.loadingProgressFill.style.width = `${roundedPercent}%`;
  }
  
  // Update instrument phases (GSAP-first)
  if (state.gsap && elements.loadingInstrumentIcons) {
    const phase = LoadingAnimations.updateInstrumentPhase(
      state.gsap, 
      elements.loadingInstrumentIcons, 
      roundedPercent
    );
    
    // Play phase sound when phase changes
    if (phase) {
      introSounds.playPhaseSound(phase);
    }
    
    // Update status message based on phase
    if (phase && LoadingAnimations.phaseMessages[phase]) {
      const phaseMessage = LoadingAnimations.phaseMessages[phase];
      if (elements.awakeningStatus && elements.awakeningStatus.textContent !== phaseMessage) {
        elements.awakeningStatus.textContent = phaseMessage;
      }
    }
  }
  
  // Activate eye rays at completion
  if (roundedPercent >= 100 && elements.awakeningEyeRays) {
    elements.awakeningEyeRays.classList.add('active');
    elements.awakeningEyeRays.style.opacity = '1';
  }
  
  // Update status text with transition
  if (elements.awakeningStatus && status) {
    // Translate German status messages - Louvre elegance
    const statusMap = {
      'Lade MediaPipe Module...': 'Preparing the artist\'s vision',
      'Lade Körpererkennung...': 'Perceiving the human form',
      'Lade Gesichtserkennung...': 'Studying the countenance',
      'Lade Gestenerkennung...': 'Learning the language of gesture',
      'Aktiviere Kamera...': 'Opening the eye of the canvas',
      'Bereit': 'The sitting may begin'
    };
    
    const newStatus = statusMap[status] || status;
    
    // Only update if status changed
    if (elements.awakeningStatus.textContent !== newStatus) {
      elements.awakeningStatus.classList.add('changing');
      setTimeout(() => {
        elements.awakeningStatus.textContent = newStatus;
        elements.awakeningStatus.classList.remove('changing');
      }, 200);
    }
  }
}

function hideAwakening() {
  return new Promise((resolve) => {
  if (elements.awakeningOverlay) {
    if (state.gsap) {
        state.gsap.to(elements.awakeningOverlay, {
        opacity: 0,
        scale: 1.05,
          duration: 0.6, // Faster for better flow
        ease: 'power2.inOut',
        onComplete: () => {
          elements.awakeningOverlay.classList.add('hidden');
          elements.awakeningOverlay.style.opacity = '';
          elements.awakeningOverlay.style.transform = '';
            resolve();
        }
      });
    } else {
      elements.awakeningOverlay.classList.add('hidden');
        resolve();
    }
    } else {
      resolve();
  }
  });
}

// ===== HAND INDICATOR UPDATE =====
function updateHandIndicator(indicator, stateEl, gesture) {
  if (!indicator) return;
  
  // Reset classes
  indicator.classList.remove('fist', 'palm');
  
  // Determine gesture class
  if (gesture === 'Closed_Fist') {
    indicator.classList.add('fist');
    if (stateEl) stateEl.textContent = 'FIST';
  } else if (gesture === 'Open_Palm') {
    indicator.classList.add('palm');
    if (stateEl) stateEl.textContent = 'PALM';
  } else if (gesture === 'Pointing_Up') {
    indicator.classList.add('palm'); // Use palm style for pointing
    if (stateEl) stateEl.textContent = 'POINT';
  } else {
    if (stateEl) stateEl.textContent = '—';
  }
}

// Direct transition that immediately shows main app (intro already hidden when button clicked)
function transitionToMainDirect() {
  const gsap = state.gsap;
  
  // Cleanup intro screen ambient effects (particles, cursor gradient)
  IntroAnimations.cleanup();
  
  // Ensure intro screen is fully hidden (should be already from button click)
  elements.introScreen.style.opacity = '0';
  elements.introScreen.style.visibility = 'hidden';
  elements.introScreen.classList.add('hidden');
  
  // Go directly to main app
  showMainApp(gsap);
}

// LEGACY: Full animated transition (for spacebar trigger, etc.)
function transitionToMain() {
  const gsap = state.gsap;
  
  // Prevent multiple transitions
  if (elements.introScreen.classList.contains('transitioning')) {
    return;
  }
  elements.introScreen.classList.add('transitioning');
  
  if (gsap) {
    // Orchestrated exit sequence
    const exitElements = {
      cta: elements.enableCameraBtn,
      subtitle: elements.introSubtitle,
      tagline: elements.introTagline,
      title: elements.introTitle,
      logo: elements.introLogo,
      privacy: elements.introPrivacy,
      footer: elements.introFooter,
      vignette: elements.introVignette,
      screen: elements.introScreen
    };
    
    const exitTl = IntroAnimations.exitSequence(gsap, exitElements);
    exitTl.eventCallback('onComplete', () => {
      // Ensure clean state before hiding
      elements.introScreen.style.opacity = '0';
      elements.introScreen.style.visibility = 'hidden';
      elements.introScreen.classList.add('hidden');
      elements.introScreen.classList.remove('transitioning');
      
      // Small delay to ensure DOM update
      requestAnimationFrame(() => {
      showMainApp(gsap);
      });
    });
  } else {
    // Fallback without GSAP
    elements.introScreen.classList.add('hidden');
    elements.introScreen.classList.remove('transitioning');
    elements.mainApp.classList.remove('hidden');
    hideLoading();
    startApp();
  }
}

function showMainApp(gsap) {
  hideLoading();
  
  // Make container available but hidden initially - let GSAP animate everything
  elements.mainApp.classList.remove('hidden');
  elements.mainApp.style.display = 'flex';
  elements.mainApp.style.visibility = 'visible';
  // Keep opacity at 0 initially - GSAP entrySequence will animate it
  elements.mainApp.style.opacity = '0';
  
  // Pre-hide header and footer for clean animation entry
  if (elements.appHeader) {
    elements.appHeader.style.opacity = '0';
    elements.appHeader.style.transform = 'translateY(-80px)';
  }
  if (elements.appFooter) {
    elements.appFooter.style.opacity = '0';
    elements.appFooter.style.transform = 'translateY(80px)';
  }
  
  // Small delay to ensure DOM is ready before animation
  requestAnimationFrame(() => {
    // Now reveal main app container
    elements.mainApp.style.opacity = '1';
  
  // Setup main app elements for GSAP animation
  const mainElements = {
    mainApp: elements.mainApp,
    header: elements.appHeader,
    footer: elements.appFooter,
    statusPanel: elements.statusPanel,
    frameBorders: elements.frameBorders
  };
  
  // Entry sequence with bounce effects
  const entryTl = MainAnimations.entrySequence(gsap, mainElements);
  entryTl.eventCallback('onComplete', () => {
    // Setup spark pulse animation (paused by default)
    if (elements.sparkOrb && elements.sparkIcon) {
      state.sparkPulseTl = MainAnimations.createSparkPulse(gsap, elements.sparkOrb, elements.sparkIcon);
    }
    startApp();
    });
  });
}

function startApp() {
  requestAnimationFrame(resizeCanvas);
  setTimeout(resizeCanvas, 100);
  setTimeout(resizeCanvas, 300);
  state.isRunning = true;
  state.lastFrameTime = performance.now();
  requestAnimationFrame(mainLoop);
  
  // Start tutorial after a delay to let user see themselves first
  startTutorialAfterDelay();
}

// ==============================================
// TRACKING
// ==============================================

function handleTrackingResults(results) {
  const timestamp = performance.now();
  
  // Process native gesture recognition
  if (results.gestures && results.gestures.length > 0) {
    // gestures is array of arrays: [[{categoryName, score}], [{categoryName, score}]]
    // Each inner array is for one hand
    state.currentGestures = results.gestures.map(handGestures => {
      if (handGestures && handGestures.length > 0) {
        // Get highest confidence gesture
        const topGesture = handGestures[0];
        return {
          name: topGesture.categoryName,
          confidence: topGesture.score
        };
      }
      return null;
    }).filter(Boolean);
    
    // DEBUG: Log non-None gestures to console
    const meaningfulGestures = state.currentGestures.filter(g => g.name !== 'None');
    if (meaningfulGestures.length > 0) {
      console.log('[CORPUS] 👋 Gestures detected:', meaningfulGestures.map(g => `${g.name}(${(g.confidence*100).toFixed(0)}%)`).join(', '));
    }
  } else {
    state.currentGestures = [];
  }
  
  if (avatarRenderer) {
    avatarRenderer.update(
      results.poseLandmarks,
      results.handLandmarks,
      results.faceLandmarks,
      timestamp,
      state.currentGestures, // Pass gestures to avatar renderer
      results.faceBlendshapes // Pass face expressions for emotional particle effects
    );
    const status = avatarRenderer.getStatus();
    state.isDetected = status.detected;
    state.detectionMode = status.mode;
    
    // Handle spark activation/deactivation
    const wasSpark = state.sparkActive;
    state.sparkActive = status.spark;
    
    // Update Musical Body Instrument (always update if enabled for consistent response)
    if (bodyInstrument.isEnabled && bodyInstrument.isInitialized) {
      const pose = results.poseLandmarks?.[0];
      if (pose && pose.length >= 17) {
        bodyInstrument.update(
          pose,
          results.handLandmarks,
          avatarRenderer.velocityTracker,
          state.currentGestures,
          results.faceBlendshapes
        );
      }
    }
  }
  
  const hasPose = results.poseLandmarks && results.poseLandmarks.length > 0;
  const handCount = results.handLandmarks ? results.handLandmarks.length : 0;
  const hasFace = results.faceLandmarks && results.faceLandmarks.length > 0;
  updateUI(hasPose, handCount, hasFace);
  
  // Update gesture palette
  updateGesturePalette(state.currentGestures);
  
  // Update tutorial if active
  if (tutorialManager.isShowing()) {
    const gestureData = checkGestureForTutorial();
    tutorialManager.checkGesture(gestureData);
  }
}

function updateUI(hasPose, handCount, hasFace) {
  const modeMap = {
    'full': 'FULL BODY',
    'upper': 'UPPER BODY',
    'face': 'FACE ONLY',
    'none': 'WAITING'
  };
  
  // Header status
  if (elements.modeLatin) elements.modeLatin.textContent = modeMap[state.detectionMode] || 'WAITING';
  if (elements.statusDot) elements.statusDot.className = 'status-dot' + (hasPose ? ' active' : '');
  if (elements.statusText) elements.statusText.textContent = hasPose ? 'Presence perceived' : 'Seeking presence';
  
  // NEW: Panel status dot
  if (elements.panelStatusDot) {
    elements.panelStatusDot.className = 'panel-status-dot' + (hasPose ? ' active' : '');
  }
  
  // NEW: Left/Right Hand Gesture Display
  // NOTE: Webcam is mirrored, so visual left = user's right hand
  // We swap the indicators so "L" appears on the left side but tracks user's right hand
  if (elements.leftHandIndicator && elements.rightHandIndicator) {
    // Get gesture states from currentGestures (index 0 = left, index 1 = right)
    const leftGesture = state.currentGestures[0]?.name || null;
    const rightGesture = state.currentGestures[1]?.name || null;
    
    // INVERTED: Left indicator shows RIGHT hand gesture (mirrored webcam)
    updateHandIndicator(elements.leftHandIndicator, elements.leftGestureState, rightGesture);
    
    // INVERTED: Right indicator shows LEFT hand gesture (mirrored webcam)
    updateHandIndicator(elements.rightHandIndicator, elements.rightGestureState, leftGesture);
    
    // Update main gesture label
    if (elements.gestureLabel) {
      if (state.sparkActive) {
        elements.gestureLabel.textContent = 'SPARKING';
      } else if (leftGesture === 'Open_Palm' || rightGesture === 'Open_Palm') {
        elements.gestureLabel.textContent = 'PUSHING';
      } else if (leftGesture === 'Pointing_Up' || rightGesture === 'Pointing_Up') {
        elements.gestureLabel.textContent = 'ATTRACTING';
      } else if (hasPose) {
        elements.gestureLabel.textContent = 'DETECTED';
      } else {
        elements.gestureLabel.textContent = 'AWAITING';
      }
    }
  }
  
  // Status rows with indicators
  if (elements.bodyStatus) {
    elements.bodyStatus.textContent = hasPose ? '✓' : '—';
    elements.bodyStatus.className = 'status-value' + (hasPose ? ' active' : '');
  }
  if (elements.bodyIndicator) {
    elements.bodyIndicator.className = 'status-indicator' + (hasPose ? ' active' : '');
  }
  
  if (elements.handsStatus) {
    elements.handsStatus.textContent = handCount === 0 ? '—' : handCount === 1 ? 'I' : 'II';
    elements.handsStatus.className = 'status-value' + (handCount > 0 ? ' active' : '');
  }
  if (elements.handsIndicator) {
    elements.handsIndicator.className = 'status-indicator' + (handCount > 0 ? ' active' : '');
  }
  
  if (elements.faceStatus) {
    elements.faceStatus.textContent = hasFace ? '✓' : '—';
    elements.faceStatus.className = 'status-value' + (hasFace ? ' active' : '');
  }
  if (elements.faceIndicator) {
    elements.faceIndicator.className = 'status-indicator' + (hasFace ? ' active' : '');
  }
  
  // Landmark counts
  const bodyLandmarkCount = hasPose ? 33 : 0;
  const handLandmarkCount = handCount * 21;
  const faceLandmarkCount = hasFace ? 468 : 0;
  const totalCount = bodyLandmarkCount + handLandmarkCount + faceLandmarkCount;
  
  if (elements.landmarkCount) elements.landmarkCount.textContent = totalCount;
  if (elements.bodyLandmarks) elements.bodyLandmarks.textContent = bodyLandmarkCount;
  if (elements.handLandmarks) elements.handLandmarks.textContent = handLandmarkCount;
  if (elements.faceLandmarks) elements.faceLandmarks.textContent = faceLandmarkCount;
  
  // Particle count
  if (elements.particleCount && avatarRenderer) {
    elements.particleCount.textContent = avatarRenderer.getParticleCount();
  }
  
  // ===== UPDATE FOOTER STATUS BAR =====
  if (elements.footerBodyStatus) {
    elements.footerBodyStatus.textContent = hasPose ? '✓' : '—';
    elements.footerBodyStatus.className = 'metric-value' + (hasPose ? ' active' : '');
  }
  if (elements.footerHandsStatus) {
    elements.footerHandsStatus.textContent = handCount === 0 ? '—' : handCount;
    elements.footerHandsStatus.className = 'metric-value' + (handCount > 0 ? ' active' : '');
  }
  if (elements.footerFaceStatus) {
    elements.footerFaceStatus.textContent = hasFace ? '✓' : '—';
    elements.footerFaceStatus.className = 'metric-value' + (hasFace ? ' active' : '');
  }
  if (elements.footerLandmarks) {
    elements.footerLandmarks.textContent = totalCount;
  }
  if (elements.footerParticles && avatarRenderer) {
    elements.footerParticles.textContent = avatarRenderer.getParticleCount();
  }
  
  // ===== UPDATE DETECTION PILLS =====
  if (elements.detectBody) {
    elements.detectBody.classList.toggle('active', hasPose);
  }
  if (elements.detectHands) {
    elements.detectHands.classList.toggle('active', handCount > 0);
  }
  if (elements.detectFace) {
    elements.detectFace.classList.toggle('active', hasFace);
  }
  
  // ===== UPDATE HAND GESTURE INDICATORS =====
  if (elements.leftHandGesture) {
    const leftGesture = state.currentGestures[0]?.name || null;
    const isLeftActive = handCount > 0 && leftGesture !== null;
    const isLeftFist = leftGesture === 'Closed_Fist';
    
    elements.leftHandGesture.classList.toggle('active', isLeftActive);
    elements.leftHandGesture.classList.toggle('fist', isLeftFist);
  }
  if (elements.rightHandGesture) {
    const rightGesture = state.currentGestures[1]?.name || null;
    const isRightActive = handCount > 0 && rightGesture !== null;
    const isRightFist = rightGesture === 'Closed_Fist';
    
    elements.rightHandGesture.classList.toggle('active', isRightActive);
    elements.rightHandGesture.classList.toggle('fist', isRightFist);
  }
}

// ==============================================
// RENDER LOOP
// ==============================================

// PERFORMANCE: Cache vignette gradient dimensions
let cachedVignette = null;
let cachedVignetteW = 0;
let cachedVignetteH = 0;
let cachedVignetteTheme = null;

function mainLoop(timestamp) {
  if (!state.isRunning) return;
  
  const deltaTime = timestamp - state.lastFrameTime;
  state.lastFrameTime = timestamp;
  
  state.frameCount++;
  if (timestamp - state.lastFpsTime >= 1000) {
    state.fps = state.frameCount;
    state.frameCount = 0;
    state.lastFpsTime = timestamp;
    if (elements.fpsCounter) elements.fpsCounter.textContent = toRoman(state.fps);
  }
  
  const w = elements.mainCanvas.width;
  const h = elements.mainCanvas.height;
  
  if (w <= 0 || h <= 0) {
    resizeCanvas();
    requestAnimationFrame(mainLoop);
    return;
  }
  
  // Background based on theme - clean gallery aesthetic
  mainCtx.fillStyle = state.theme === 'light' ? '#FDFBF7' : '#1C1A18';
  mainCtx.fillRect(0, 0, w, h);
  
  // PERFORMANCE: Cache vignette gradient - only recreate if dimensions or theme changed
  if (!cachedVignette || cachedVignetteW !== w || cachedVignetteH !== h || cachedVignetteTheme !== state.theme) {
    cachedVignette = mainCtx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.75);
    cachedVignette.addColorStop(0, 'transparent');
    cachedVignette.addColorStop(0.7, 'transparent');
    cachedVignette.addColorStop(1, state.theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.15)');
    cachedVignetteW = w;
    cachedVignetteH = h;
    cachedVignetteTheme = state.theme;
  }
  mainCtx.fillStyle = cachedVignette;
  mainCtx.fillRect(0, 0, w, h);
  
  if (scanningGrid) scanningGrid.update(deltaTime);
  if (state.detectionMode === 'none' && scanningGrid) scanningGrid.render(mainCtx, w, h);
  if (avatarRenderer) avatarRenderer.render(mainCtx, w, h);
  
  requestAnimationFrame(mainLoop);
}

// ==============================================
// UI HELPERS
// ==============================================

function showLoading(text) {
  const gsap = state.gsap;
  
  if (gsap && elements.loadingOverlay) {
    LoadingAnimations.show(gsap, elements.loadingOverlay, text);
  } else {
    elements.loadingOverlay?.classList.remove('hidden');
  }
  
  if (elements.loadingText) elements.loadingText.textContent = text;
}

function hideLoading() {
  const gsap = state.gsap;
  
  if (gsap && elements.loadingOverlay) {
    LoadingAnimations.hide(gsap, elements.loadingOverlay);
  } else {
    elements.loadingOverlay?.classList.add('hidden');
  }
}

function updateLoadingProgress(percent, text) {
  const gsap = state.gsap;
  
  if (gsap && elements.loadingBar) {
    LoadingAnimations.updateProgress(gsap, elements.loadingBar, percent);
  } else if (elements.loadingBar) {
    elements.loadingBar.style.width = percent + '%';
  }
  
  if (elements.loadingText && text) elements.loadingText.textContent = text;
}

// ==============================================
// CINEMA MODE
// ==============================================

let cinemaExitTimeout = null;

function initCinemaMode() {
  // Get cinema exit button
  const exitBtn = document.getElementById('cinema-exit');
  if (exitBtn) {
    exitBtn.addEventListener('click', exitCinemaMode);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!state.isRunning) return;
    
    // 'F' key to toggle cinema mode
    if (e.key === 'f' || e.key === 'F') {
      toggleCinemaMode();
    }
    
    // ESC to exit cinema mode
    if (e.key === 'Escape' && state.cinemaMode) {
      exitCinemaMode();
    }
  });
  
  // Double-click canvas to toggle
  elements.mainCanvas?.addEventListener('dblclick', () => {
    if (state.isRunning) toggleCinemaMode();
  });
  
  // Show exit button on mouse movement
  document.addEventListener('mousemove', () => {
    if (state.cinemaMode) {
      document.body.classList.add('show-exit');
      
      // Hide after inactivity
      clearTimeout(cinemaExitTimeout);
      cinemaExitTimeout = setTimeout(() => {
        document.body.classList.remove('show-exit');
      }, 2000);
    }
  });
}

function toggleCinemaMode() {
  if (state.cinemaMode) {
    exitCinemaMode();
  } else {
    enterCinemaMode();
  }
}

function enterCinemaMode() {
  state.cinemaMode = true;
  
  // Request fullscreen
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
  
  // Animate transition with GSAP if available
  const gsap = state.gsap;
  if (gsap) {
    const tl = gsap.timeline();
    
    // Hide UI elements with elegant exit
    tl.to('.app-header', { 
      y: -80, 
      opacity: 0, 
      duration: 0.5, 
      ease: 'power2.inOut' 
    }, 0);
    
    tl.to('.app-footer', { 
      y: 80, 
      opacity: 0, 
      duration: 0.5, 
      ease: 'power2.inOut' 
    }, 0);
    
    tl.to('.detection-panel', { 
      x: 100, 
      opacity: 0, 
      duration: 0.5, 
      ease: 'power2.inOut' 
    }, 0.1);
    
    tl.to('.frame-border', { 
      opacity: 0, 
      scale: 0.98, 
      duration: 0.4, 
      ease: 'power2.inOut' 
    }, 0);
    
    // Add cinema class after animation
    tl.call(() => {
      document.body.classList.add('cinema-mode');
    }, null, 0.5);
  } else {
    document.body.classList.add('cinema-mode');
  }
  
  console.log('[CORPUS] Cinema mode: ON');
}

function exitCinemaMode() {
  state.cinemaMode = false;
  
  // Exit fullscreen
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  
  // Remove cinema class first
  document.body.classList.remove('cinema-mode', 'show-exit');
  
  // Animate UI back with GSAP if available
  const gsap = state.gsap;
  if (gsap) {
    const tl = gsap.timeline();
    
    // Bring back UI elements
    tl.fromTo('.app-header', 
      { y: -80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
      0);
    
    tl.fromTo('.app-footer', 
      { y: 80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
      0);
    
    tl.fromTo('.detection-panel', 
      { x: 100, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
      0.1);
    
    tl.fromTo('.frame-border', 
      { opacity: 0, scale: 0.98 }, 
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 
      0);
  }
  
  console.log('[CORPUS] Cinema mode: OFF');
}

// Handle fullscreen change events (ESC key, etc.)
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && state.cinemaMode) {
    exitCinemaMode();
  }
});

document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement && state.cinemaMode) {
    exitCinemaMode();
  }
});

// ==============================================
// BOOTSTRAP
// ==============================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[CORPUS] Behold the form...');
  getElements();
  initTheme();
  initCanvas();
  initCinemaMode();
  initFullscreenToggle();
  
  // Initialize GSAP animations
  await initAnimations();
  
  // Camera/portal button - support both legacy and GSAP-first
  elements.enableCameraBtn?.addEventListener('click', handleEnableCamera);
  elements.portalButton?.addEventListener('click', handleEnableCamera);
  
  elements.themeToggle?.addEventListener('click', toggleTheme);
  elements.soundToggle?.addEventListener('click', toggleSound);
  elements.scaleSelect?.addEventListener('change', handleScaleChange);
  elements.helpBtn?.addEventListener('click', () => helpModal.toggle());
  
  // Setup sound visual feedback
  bodyInstrument.onSoundTrigger = handleSoundTrigger;
  
  // Initialize tutorial and help modal
  tutorialManager.init(state.gsap, checkGestureForTutorial);
  helpModal.init(state.gsap);
  
  // Tutorial restart event
  window.addEventListener('restartTutorial', () => {
    tutorialManager.restart();
  });
});

// ==============================================
// FULLSCREEN TOGGLE
// ==============================================

function initFullscreenToggle() {
  const fullscreenBtn = document.getElementById('fullscreen-toggle');
  
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }
  
  // Listen for fullscreen change events
  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);
}

function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    // Enter fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function updateFullscreenUI() {
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
  document.body.classList.toggle('fullscreen-active', !!isFullscreen);
}

// ==============================================
// MUSICAL BODY INSTRUMENT
// ==============================================

async function toggleSound() {
  // Check if Tone.js is loaded
  if (!window.Tone) {
    console.error('[CORPUS] Tone.js not loaded');
    return;
  }
  
  if (!bodyInstrument.isInitialized) {
    // First time - initialize with Tone.js
    try {
      const success = await bodyInstrument.initialize(window.Tone);
      if (!success) {
        console.error('[CORPUS] Failed to initialize sound');
        return;
      }
      console.log('[CORPUS] 🎵 Body Instrument initialized');
    } catch (e) {
      console.error('[CORPUS] Sound init error:', e);
      return;
    }
  }
  
  // Toggle enabled state
  state.soundEnabled = !state.soundEnabled;
  bodyInstrument.setEnabled(state.soundEnabled);
  console.log('[CORPUS] 🎵 Body instrument isEnabled:', bodyInstrument.isEnabled, 'isInitialized:', bodyInstrument.isInitialized);
  
  // Ensure audio context is running when enabling
  if (state.soundEnabled && window.Tone) {
    try {
      await window.Tone.start();
      if (window.Tone.context.state !== 'running') {
        await window.Tone.context.resume();
      }
      console.log('[CORPUS] 🎵 Audio context state:', window.Tone.context.state);
    } catch (e) {
      console.warn('[CORPUS] Audio context issue:', e);
    }
  }
  
  // Update UI
  updateSoundUI();
  
  // Update instruction text
  if (elements.footerInstruction) {
    if (state.soundEnabled) {
      elements.footerInstruction.textContent = '♫ Arms = melody · ✊ = drums · 🤟/👎 = change scale';
    } else {
      elements.footerInstruction.textContent = 'Click [?] for guide · 🔊 enables music · ✊ summons sparks';
    }
  }
  
  console.log('[CORPUS] 🎵 Sound', state.soundEnabled ? 'enabled' : 'disabled');
}

function updateSoundUI() {
  if (elements.soundToggle) {
    elements.soundToggle.classList.toggle('active', state.soundEnabled);
    elements.soundToggle.setAttribute('aria-pressed', state.soundEnabled);
  }
  
  if (elements.scaleSelect) {
    elements.scaleSelect.style.display = state.soundEnabled ? 'block' : 'none';
    elements.scaleSelect.value = bodyInstrument.getCurrentScale();
  }
}

function handleScaleChange(e) {
  const scale = e.target.value;
  bodyInstrument.setScale(scale);
  console.log('[CORPUS] 🎼 Scale changed to:', scale);
}

function handleSoundTrigger(type, note, volume) {
  // Visual feedback for sound events
  if (type === 'scale') {
    // Update the scale selector dropdown
    if (elements.scaleSelect) {
      elements.scaleSelect.value = note; // note contains the scale name
    }
    // Show scale name briefly
    showScaleNotification(note);
    console.log('[CORPUS] 🎼 Scale changed via gesture to:', note);
  } else if (state.gsap && (type === 'kick' || type === 'snare')) {
    // Pulse the canvas border on drums
    pulseOnDrum(type);
  }
}

function showScaleNotification(scaleName) {
  // Create temporary notification
  const notification = document.createElement('div');
  notification.className = 'scale-notification';
  notification.textContent = `♫ ${scaleName.toUpperCase()}`;
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-display);
    font-size: 24px;
    color: var(--gold-bright);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    pointer-events: none;
    z-index: 1000;
  `;
  document.body.appendChild(notification);
  
  // Animate and remove
  if (state.gsap) {
    state.gsap.fromTo(notification, 
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.3,
        onComplete: () => {
          state.gsap.to(notification, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            delay: 1,
            onComplete: () => notification.remove()
          });
        }
      }
    );
  } else {
    setTimeout(() => notification.remove(), 2000);
  }
}

function pulseOnDrum(type) {
  // Brief pulse effect on frame borders
  const borders = document.querySelectorAll('.frame-border');
  if (borders.length && state.gsap) {
    const color = type === 'kick' ? 'rgba(200, 160, 64, 0.5)' : 'rgba(232, 180, 184, 0.5)';
    borders.forEach(border => {
      state.gsap.to(border, {
        boxShadow: `0 0 20px ${color}`,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    });
  }
}

// ==============================================
// GESTURE PALETTE & TUTORIAL
// ==============================================

function updateGesturePalette(gestures) {
  // Reset all items
  const items = document.querySelectorAll('.gesture-item');
  items.forEach(item => item.classList.remove('active'));
  
  if (!gestures || gestures.length === 0) return;
  
  // Map MediaPipe gestures to palette items
  gestures.forEach(gesture => {
    if (!gesture?.name) return;
    
    switch(gesture.name) {
      case 'Closed_Fist':
        elements.gestureFistItem?.classList.add('active');
        break;
      case 'Open_Palm':
        elements.gesturePalmItem?.classList.add('active');
        break;
      case 'Pointing_Up':
        elements.gesturePointItem?.classList.add('active');
        break;
      case 'Victory':
        elements.gestureVictoryItem?.classList.add('active');
        break;
      case 'Thumb_Up':
        elements.gestureThumbItem?.classList.add('active');
        break;
    }
  });
}

// Data for tutorial gesture detection
let lastArmPositions = { left: null, right: null };
let armMovementAccum = { left: 0, right: 0 };

function checkGestureForTutorial() {
  // Build gesture data object for tutorial
  const gestureData = {
    gestures: state.currentGestures,
    rightArmMoving: false,
    leftArmMoving: false,
    mouthOpen: 0
  };
  
  // Check arm movement from avatar renderer
  if (avatarRenderer?.pose) {
    const pose = avatarRenderer.pose;
    const rightWrist = pose[16];
    const leftWrist = pose[15];
    
    // Track right arm movement
    if (rightWrist && rightWrist.visibility > 0.5) {
      if (lastArmPositions.right) {
        const dy = Math.abs(rightWrist.y - lastArmPositions.right.y);
        armMovementAccum.right += dy;
        if (armMovementAccum.right > 0.15) {
          gestureData.rightArmMoving = true;
        }
      }
      lastArmPositions.right = { y: rightWrist.y };
    }
    
    // Track left arm movement
    if (leftWrist && leftWrist.visibility > 0.5) {
      if (lastArmPositions.left) {
        const dy = Math.abs(leftWrist.y - lastArmPositions.left.y);
        armMovementAccum.left += dy;
        if (armMovementAccum.left > 0.15) {
          gestureData.leftArmMoving = true;
        }
      }
      lastArmPositions.left = { y: leftWrist.y };
    }
  }
  
  // Check face expressions
  if (avatarRenderer?.faceExpression) {
    gestureData.mouthOpen = avatarRenderer.faceExpression.mouthOpen || 0;
  }
  
  // Reset accumulators if gesture detected
  if (gestureData.rightArmMoving) armMovementAccum.right = 0;
  if (gestureData.leftArmMoving) armMovementAccum.left = 0;
  
  return gestureData;
}

function startTutorialAfterDelay() {
  // Start tutorial after a short delay to let user see themselves
  setTimeout(() => {
    if (tutorialManager.shouldShowOnStart()) {
      tutorialManager.start();
    }
  }, 2000);
}

window.addEventListener('load', resizeCanvas);
