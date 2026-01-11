/**
 * CORPUS — Help Modal/Panel
 * Complete gesture and sound reference using Phosphor icons
 */

// ==============================================
// PHOSPHOR ICONS (Weight: Regular)
// ==============================================

const ICONS = {
  // Actions
  'book-open': '<svg viewBox="0 0 256 256"><path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z" fill="currentColor"/></svg>',
  'x': '<svg viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" fill="currentColor"/></svg>',
  'check': '<svg viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" fill="currentColor"/></svg>',
  'arrow-clockwise': '<svg viewBox="0 0 256 256"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16h28.69L191,74.34A80,80,0,1,0,128,208a8,8,0,0,0,0,16A96,96,0,1,1,202.16,50.84L224,72.69V56a8,8,0,0,1,16,0Z" fill="currentColor"/></svg>',
  
  // Sound
  'music-notes': '<svg viewBox="0 0 256 256"><path d="M212.92,25.69a8,8,0,0,0-6.86-1.45l-128,32A8,8,0,0,0,72,64V174.08A36,36,0,1,0,88,204V110.25l112-28v51.83A36,36,0,1,0,216,172V32A8,8,0,0,0,212.92,25.69ZM52,224a20,20,0,1,1,20-20A20,20,0,0,1,52,224ZM88,93.75V70.25l112-28v23.5ZM180,192a20,20,0,1,1,20-20A20,20,0,0,1,180,192Z" fill="currentColor"/></svg>',
  'speaker-high': '<svg viewBox="0 0 256 256"><path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM144,207.64,84.91,161.69A7.94,7.94,0,0,0,80,160H32V96H80a7.94,7.94,0,0,0,4.91-1.69L144,48.36ZM200,128a40,40,0,0,1-16,32,8,8,0,0,1-9.6-12.8,24,24,0,0,0,0-38.4,8,8,0,0,1,9.6-12.8A40,40,0,0,1,200,128Zm32,0a72,72,0,0,1-28.8,57.6,8,8,0,0,1-9.6-12.8,56,56,0,0,0,0-89.6,8,8,0,0,1,9.6-12.8A72,72,0,0,1,232,128Z" fill="currentColor"/></svg>',
  
  // Gestures
  'hand-fist': '<svg viewBox="0 0 256 256"><path d="M200,80H184V64a32,32,0,0,0-56-21.13A32,32,0,0,0,72,64v8a32,32,0,0,0-32,32v40a96,96,0,0,0,192,0V112A32,32,0,0,0,200,80ZM88,64a16,16,0,0,1,32,0v40a16,16,0,0,1-32,0Zm48,0a16,16,0,0,1,32,0V80H136Zm80,80a80,80,0,0,1-160,0V104a16,16,0,0,1,16-16v16a32,32,0,0,0,64,0V80h32v24a32,32,0,0,0,64,0,16,16,0,0,1,16,16v24Zm-16-24a16,16,0,0,1-32,0V96h16a16,16,0,0,1,16,16Z" fill="currentColor"/></svg>',
  'hand-palm': '<svg viewBox="0 0 256 256"><path d="M188,88a27.75,27.75,0,0,0-12,2.71V60a28,28,0,0,0-41.36-24.6A28,28,0,0,0,80,44v6.71A27.75,27.75,0,0,0,68,48,28,28,0,0,0,40,76v76a88,88,0,0,0,176,0V116A28,28,0,0,0,188,88Zm12,64a72,72,0,0,1-144,0V76a12,12,0,0,1,24,0v40a8,8,0,0,0,16,0V44a12,12,0,0,1,24,0v60a8,8,0,0,0,16,0V60a12,12,0,0,1,24,0v60a8,8,0,0,0,16,0v-4a12,12,0,0,1,24,0Z" fill="currentColor"/></svg>',
  'hand-pointing': '<svg viewBox="0 0 256 256"><path d="M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13a28,28,0,0,0-48.41,28.17l29.32,50A88,88,0,0,0,216,152V116A28,28,0,0,0,196,88Zm4,64a72,72,0,0,1-139.72,24l-29.32-50a12,12,0,0,1,20.78-12.09L68.35,141.9A8,8,0,0,0,84,136V44a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V100a12,12,0,0,1,24,0v20a8,8,0,0,0,16,0v-4a12,12,0,0,1,24,0Z" fill="currentColor"/></svg>',
  'thumbs-up': '<svg viewBox="0 0 256 256"><path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56v24a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" fill="currentColor"/></svg>',
  'thumbs-down': '<svg viewBox="0 0 256 256"><path d="M239.82,157l-12-96a24,24,0,0,0-23.82-21H52a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H95.06l37.78,75.58A8,8,0,0,0,140,240a40,40,0,0,0,40-40V184h36a24,24,0,0,0,23.82-27ZM52,144V56H88v88Zm175.94-7.94a8,8,0,0,1-7.94,7.94H152a8,8,0,0,0-8,8v48a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A8,8,0,0,1,227.94,136.06Z" fill="currentColor"/></svg>',
  'hand-waving': '<svg viewBox="0 0 256 256"><path d="M220.17,100l-18-31.18a28,28,0,0,0-38.15-10.25,28.06,28.06,0,0,0-11.16-8.26,28,28,0,0,0-38.3,10.26l-6,10.36a28,28,0,0,0-22.56,1.08,28,28,0,0,0-10.27,38.2l6,10.36-7.7,13.33A88,88,0,0,0,97,217.87a8,8,0,0,0,10.86-3A8,8,0,0,0,104.91,204a72,72,0,0,1,19.09-82.33l9.92-17.17,44.07,76.36a72,72,0,0,1-19.09,82.33,8,8,0,0,0,2.91,13.86,8,8,0,0,0,7.95-3A88,88,0,0,0,192.81,190l7.36-12.75a28,28,0,0,0,10.27-38.2,28.07,28.07,0,0,0,9.73-39ZM166,68.57a12,12,0,0,1,16.38-4.4l18,31.18a12,12,0,1,1-20.78,12L161.58,84.9A12,12,0,0,1,166,68.57ZM113.6,91.15a12,12,0,0,1,16.37-4.4l6,10.36a28.08,28.08,0,0,0,1.67,32.5l-6,10.35a28.15,28.15,0,0,0-2.72,5.17l-19.67-34.06A12,12,0,0,1,113.6,91.15Zm92.83,100.37a8,8,0,0,0-2.77,11l-7.36,12.75a72,72,0,0,1-23.8,23.8,8,8,0,0,0,8.2,13.76A88,88,0,0,0,209.75,206l7.36-12.75a8,8,0,0,0-10.68-11Z" fill="currentColor"/></svg>',
  
  // Arrows
  'arrow-up': '<svg viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z" fill="currentColor"/></svg>',
  'arrows-vertical': '<svg viewBox="0 0 256 256"><path d="M167.39,176.59a8,8,0,0,1-.22,11.32l-32,31a8,8,0,0,1-11.12,0l-32-31a8,8,0,1,1,11.12-11.54L120,192.69V63.31L103.17,79.63a8,8,0,1,1-11.12-11.54l32-31a8,8,0,0,1,11.12,0l32,31a8,8,0,1,1-11.12,11.54L136,63.31V192.69l16.83-16.32A8,8,0,0,1,167.39,176.59Z" fill="currentColor"/></svg>',
  
  // Face
  'smiley': '<svg viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48a56,56,0,0,1-93.86,0,8,8,0,1,1,13.44-8.67,40,40,0,0,0,67,0A8,8,0,1,1,174.93,156Z" fill="currentColor"/></svg>',
  'smiley-wink': '<svg viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h16A8,8,0,0,1,176,108Zm-1.07,48a56,56,0,0,1-93.86,0,8,8,0,1,1,13.44-8.67,40,40,0,0,0,67,0A8,8,0,1,1,174.93,156Z" fill="currentColor"/></svg>',
  'smiley-nervous': '<svg viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-8,56a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,164Z" fill="currentColor"/></svg>',
  'eyebrows-up': '<svg viewBox="0 0 256 256"><path d="M184,80a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H192A8,8,0,0,1,184,80ZM32,88H64a8,8,0,0,0,0-16H32a8,8,0,0,0,0,16ZM92,144a12,12,0,1,0,12,12A12,12,0,0,0,92,144Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,144Z" fill="currentColor"/></svg>',
  
  // Effects
  'sparkle': '<svg viewBox="0 0 256 256"><path d="M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19.06,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144Z" fill="currentColor"/></svg>',
  'wind': '<svg viewBox="0 0 256 256"><path d="M184,184a32,32,0,0,1-32,32c-13.7,0-26.95-8.93-31.5-21.22a8,8,0,0,1,15-5.56C137.74,195.27,145,200,152,200a16,16,0,0,0,0-32H40a8,8,0,0,1,0-16H152A32,32,0,0,1,184,184Zm-64-80a32,32,0,0,0,0-64c-13.7,0-26.95,8.93-31.5,21.22a8,8,0,0,0,15,5.56C105.74,60.73,113,56,120,56a16,16,0,0,1,0,32H24a8,8,0,0,0,0,16Zm88-32c-13.7,0-26.95,8.93-31.5,21.22a8,8,0,0,0,15,5.56C193.74,92.73,201,88,208,88a16,16,0,0,1,0,32H32a8,8,0,0,0,0,16H208a32,32,0,0,0,0-64Z" fill="currentColor"/></svg>',
  'explosion': '<svg viewBox="0 0 256 256"><path d="M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.72,10.42L96,98.31,29.11,70.67a8,8,0,0,0-10.23,11L60.7,153.3,19.29,175.86a8,8,0,0,0,5.54,14.57L93.7,176.81,71,222.7a8,8,0,0,0,12.54,9.14l60.67-50.14,35.8,47.48a8,8,0,0,0,14-6.1l-13.46-76.54,57.64-28.29a8,8,0,0,0-1.39-14.84L174.71,89.23l43.44-54.81A8,8,0,0,0,207.87,23.3Z" fill="currentColor"/></svg>',
  
  // Music
  'piano-keys': '<svg viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM80,48h24v88a8,8,0,0,1-8,8H80Zm72,96a8,8,0,0,1-8-8V48h24v88Zm56,64H48V48H64v96a8,8,0,0,0,8,8H96a24,24,0,0,0,24-24V48h16v96a24,24,0,0,0,24,24h24a8,8,0,0,0,8-8V48h16Z" fill="currentColor"/></svg>',
  
  // Tips
  'lightbulb': '<svg viewBox="0 0 256 256"><path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h24V147.31L90.34,117.66a8,8,0,0,1,11.32-11.32L128,132.69l26.34-26.35a8,8,0,0,1,11.32,11.32L136,147.31V192h24v-6a32.12,32.12,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Z" fill="currentColor"/></svg>',
  
  // Misc
  'hand-grab': '<svg viewBox="0 0 256 256"><path d="M188,80a28,28,0,0,0-12,2.71V76a28,28,0,0,0-41.36-24.6A28,28,0,0,0,80,60V68.71A28,28,0,0,0,40,92v68a88,88,0,0,0,176,0V108A28,28,0,0,0,188,80Zm12,80a72,72,0,0,1-144,0V92a12,12,0,0,1,24,0v28a8,8,0,0,0,16,0V60a12,12,0,0,1,24,0v60a8,8,0,0,0,16,0V76a12,12,0,0,1,24,0v52a8,8,0,0,0,16,0v-20a12,12,0,0,1,24,0Z" fill="currentColor"/></svg>',
};

// ==============================================
// HELP MODAL CLASS
// ==============================================

export class HelpModal {
  constructor() {
    this.modal = null;
    this.isOpen = false;
    this.gsap = null;
    this.previousFocus = null;
  }
  
  init(gsap) {
    this.gsap = gsap;
    this.createModal();
    console.log('[HelpModal] Initialized');
  }
  
  createModal() {
    this.modal = document.createElement('div');
    this.modal.id = 'help-modal';
    this.modal.className = 'help-modal hidden';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-labelledby', 'help-modal-title');
    this.modal.setAttribute('aria-modal', 'true');
    
    this.modal.innerHTML = `
      <div class="help-modal-backdrop"></div>
      <div class="help-modal-content">
        <header class="help-modal-header">
          <h2 id="help-modal-title" class="help-modal-title">
            <span class="help-modal-icon">${ICONS['book-open']}</span>
            Guide
          </h2>
          <button class="help-modal-close" aria-label="Close help">
            ${ICONS['x']}
          </button>
        </header>
        
        <div class="help-modal-body">
          <div class="help-section">
            <h3 class="help-section-title">
              <span class="help-section-icon">${ICONS['music-notes']}</span>
              Sound Controls
            </h3>
            <div class="help-grid">
              <div class="help-item">
                <div class="help-item-icon">${ICONS['arrows-vertical']}</div>
                <div class="help-item-content">
                  <strong>Right Arm</strong>
                  <span>Move up/down for melody notes</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['arrows-vertical']}</div>
                <div class="help-item-content">
                  <strong>Left Arm</strong>
                  <span>Move up/down for bass notes</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-fist']}</div>
                <div class="help-item-content">
                  <strong>Left Fist</strong>
                  <span>Kick drum</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-fist']}</div>
                <div class="help-item-content">
                  <strong>Right Fist</strong>
                  <span>Snare drum</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-palm']}</div>
                <div class="help-item-content">
                  <strong>Open Palm</strong>
                  <span>Chord strum</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-waving']}</div>
                <div class="help-item-content">
                  <strong>Rock Sign / Thumbs Down</strong>
                  <span>Change musical scale</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-pointing']}</div>
                <div class="help-item-content">
                  <strong>Point Up</strong>
                  <span>Sustain notes (2 sec)</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['thumbs-up']}</div>
                <div class="help-item-content">
                  <strong>Thumb Up</strong>
                  <span>Toggle mute</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3 class="help-section-title">
              <span class="help-section-icon">${ICONS['sparkle']}</span>
              Visual Effects
            </h3>
            <div class="help-grid">
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-fist']}</div>
                <div class="help-item-content">
                  <strong>Closed Fist</strong>
                  <span>Summon ethereal sparks</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-palm']}</div>
                <div class="help-item-content">
                  <strong>Open Palm</strong>
                  <span>Push particles away</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['hand-pointing']}</div>
                <div class="help-item-content">
                  <strong>Point Up</strong>
                  <span>Attract particles</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['wind']}</div>
                <div class="help-item-content">
                  <strong>Fast Movement</strong>
                  <span>Create turbulence</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3 class="help-section-title">
              <span class="help-section-icon">${ICONS['smiley']}</span>
              Face Effects
            </h3>
            <div class="help-grid">
              <div class="help-item">
                <div class="help-item-icon">${ICONS['smiley-nervous']}</div>
                <div class="help-item-content">
                  <strong>Mouth Open</strong>
                  <span>Filter sweep (wah effect)</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['arrow-up']}</div>
                <div class="help-item-content">
                  <strong>Eyebrows Up</strong>
                  <span>Increase reverb</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['smiley']}</div>
                <div class="help-item-content">
                  <strong>Smile</strong>
                  <span>Add vibrato</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">${ICONS['explosion']}</div>
                <div class="help-item-content">
                  <strong>Surprise</strong>
                  <span>Particle burst</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3 class="help-section-title">
              <span class="help-section-icon">${ICONS['piano-keys']}</span>
              Musical Scales
            </h3>
            <div class="help-scales">
              <span class="help-scale">Pentatonic</span>
              <span class="help-scale">Minor</span>
              <span class="help-scale">Major</span>
              <span class="help-scale">Blues</span>
              <span class="help-scale">Japanese</span>
              <span class="help-scale">Dorian</span>
            </div>
            <p class="help-scale-hint">Use rock sign or thumbs down to cycle through scales</p>
          </div>
          
          <div class="help-section help-section-tips">
            <h3 class="help-section-title">
              <span class="help-section-icon">${ICONS['lightbulb']}</span>
              Tips
            </h3>
            <ul class="help-tips">
              <li>Click the speaker icon to enable sound</li>
              <li>Movement speed controls volume — faster = louder</li>
              <li>Arm height controls pitch — higher = higher notes</li>
              <li>Combine gestures for complex performances</li>
              <li>Use fullscreen mode for the best experience</li>
            </ul>
          </div>
        </div>
        
        <footer class="help-modal-footer">
          <button class="help-modal-btn" id="help-restart-tutorial">
            ${ICONS['arrow-clockwise']}
            <span>Restart Tutorial</span>
          </button>
          <button class="help-modal-btn help-modal-btn-primary" id="help-got-it">
            ${ICONS['check']}
            <span>Got it</span>
          </button>
        </footer>
      </div>
    `;
    
    document.body.appendChild(this.modal);
    
    // Event listeners
    this.modal.querySelector('.help-modal-close').addEventListener('click', () => this.close());
    this.modal.querySelector('.help-modal-backdrop').addEventListener('click', () => this.close());
    this.modal.querySelector('#help-got-it').addEventListener('click', () => this.close());
    this.modal.querySelector('#help-restart-tutorial').addEventListener('click', () => {
      this.close();
      window.dispatchEvent(new CustomEvent('restartTutorial'));
    });
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    });
  }
  
  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.previousFocus = document.activeElement;
    
    this.modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      this.modal.classList.add('visible');
    });
    
    const closeBtn = this.modal.querySelector('.help-modal-close');
    closeBtn.focus();
    
    console.log('[HelpModal] Opened');
  }
  
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.modal.classList.remove('visible');
    
    setTimeout(() => {
      if (!this.isOpen) {
        this.modal.classList.add('hidden');
      }
    }, 350);
    
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
    
    console.log('[HelpModal] Closed');
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

export const helpModal = new HelpModal();
