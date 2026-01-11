/**
 * CORPUS — Help Modal
 * Complete gesture and sound reference accessible anytime
 * 
 * "Knowledge is power. This modal is your guidebook."
 */

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
            <span class="help-modal-icon">📖</span>
            Guide
          </h2>
          <button class="help-modal-close" aria-label="Close help">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </header>
        
        <div class="help-modal-body">
          <div class="help-section">
            <h3 class="help-section-title">🎵 Sound Controls</h3>
            <div class="help-grid">
              <div class="help-item">
                <div class="help-item-icon">↕️</div>
                <div class="help-item-content">
                  <strong>Right Arm</strong>
                  <span>Move up/down for melody notes</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">↕️</div>
                <div class="help-item-content">
                  <strong>Left Arm</strong>
                  <span>Move up/down for bass notes</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">✊</div>
                <div class="help-item-content">
                  <strong>Left Fist</strong>
                  <span>Kick drum</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">✊</div>
                <div class="help-item-content">
                  <strong>Right Fist</strong>
                  <span>Snare drum</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">✋</div>
                <div class="help-item-content">
                  <strong>Open Palm</strong>
                  <span>Chord strum</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">🤟</div>
                <div class="help-item-content">
                  <strong>Rock Sign / Thumbs Down</strong>
                  <span>Change musical scale (🤟 or 👎)</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">☝️</div>
                <div class="help-item-content">
                  <strong>Point Up</strong>
                  <span>Sustain notes (2 sec)</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">👍</div>
                <div class="help-item-content">
                  <strong>Thumb Up</strong>
                  <span>Toggle mute</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3 class="help-section-title">🎨 Visual Effects</h3>
            <div class="help-grid">
              <div class="help-item">
                <div class="help-item-icon">✊</div>
                <div class="help-item-content">
                  <strong>Closed Fist</strong>
                  <span>Summon ethereal sparks</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">✋</div>
                <div class="help-item-content">
                  <strong>Open Palm</strong>
                  <span>Push particles away</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">☝️</div>
                <div class="help-item-content">
                  <strong>Point Up</strong>
                  <span>Attract particles</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">💨</div>
                <div class="help-item-content">
                  <strong>Fast Movement</strong>
                  <span>Create turbulence</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3 class="help-section-title">😊 Face Effects</h3>
            <div class="help-grid">
              <div class="help-item">
                <div class="help-item-icon">😮</div>
                <div class="help-item-content">
                  <strong>Mouth Open</strong>
                  <span>Filter sweep (wah effect)</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">🤨</div>
                <div class="help-item-content">
                  <strong>Eyebrows Up</strong>
                  <span>Increase reverb</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">😊</div>
                <div class="help-item-content">
                  <strong>Smile</strong>
                  <span>Add vibrato</span>
                </div>
              </div>
              <div class="help-item">
                <div class="help-item-icon">😲</div>
                <div class="help-item-content">
                  <strong>Surprise</strong>
                  <span>Particle burst</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3 class="help-section-title">🎹 Musical Scales</h3>
            <div class="help-scales">
              <span class="help-scale">Pentatonic</span>
              <span class="help-scale">Minor</span>
              <span class="help-scale">Major</span>
              <span class="help-scale">Blues</span>
              <span class="help-scale">Japanese</span>
              <span class="help-scale">Dorian</span>
            </div>
            <p class="help-scale-hint">Use 🤟 (rock sign) or 👎 (thumbs down) to cycle through scales</p>
          </div>
          
          <div class="help-section help-section-tips">
            <h3 class="help-section-title">💡 Tips</h3>
            <ul class="help-tips">
              <li>Click the 🔊 speaker icon to enable sound</li>
              <li>Movement speed controls volume — faster = louder</li>
              <li>Arm height controls pitch — higher = higher notes</li>
              <li>Combine gestures for complex performances</li>
              <li>Use fullscreen mode for the best experience</li>
            </ul>
          </div>
        </div>
        
        <footer class="help-modal-footer">
          <button class="help-modal-btn" id="help-restart-tutorial">
            🎓 Restart Tutorial
          </button>
          <button class="help-modal-btn help-modal-btn-primary" id="help-got-it">
            Got it!
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
      // Emit event for tutorial restart
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
    
    // Slide in from right
    this.modal.classList.remove('hidden');
    // Small delay to allow CSS transition
    requestAnimationFrame(() => {
      this.modal.classList.add('visible');
    });
    
    // Focus trap
    const closeBtn = this.modal.querySelector('.help-modal-close');
    closeBtn.focus();
    
    console.log('[HelpModal] Opened');
  }
  
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // Slide out to right
    this.modal.classList.remove('visible');
    
    // Wait for transition then hide
    setTimeout(() => {
      if (!this.isOpen) {
        this.modal.classList.add('hidden');
      }
    }, 350); // Match CSS transition duration
    
    // Restore focus
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
