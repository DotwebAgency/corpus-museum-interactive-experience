/**
 * CORPUS — Intro & Loading Sound System
 * AWWWARD-quality ambient sounds for the entry experience
 * History of Music: drums → strings → wind → synth → human
 */

export class IntroSoundManager {
  constructor() {
    this.initialized = false;
    this.enabled = true;
    
    // Tone.js components
    this.drone = null;
    this.reverb = null;
    this.filter = null;
    
    // Phase instruments
    this.drums = null;
    this.strings = null;
    this.wind = null;
    this.synth = null;
    
    // State
    this.currentPhase = null;
  }
  
  /**
   * Initialize Tone.js components
   */
  async initialize() {
    if (this.initialized || typeof Tone === 'undefined') return;
    
    try {
      // Shared effects
      this.reverb = new Tone.Reverb({
        decay: 4,
        wet: 0.5
      }).toDestination();
      
      this.filter = new Tone.Filter({
        type: 'lowpass',
        frequency: 2000,
        Q: 1
      }).connect(this.reverb);
      
      // Ambient drone (always playing softly)
      this.drone = new Tone.FMSynth({
        harmonicity: 1.5,
        modulationIndex: 2,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 4,
          decay: 0,
          sustain: 1,
          release: 4
        },
        modulation: { type: 'sine' },
        modulationEnvelope: {
          attack: 3,
          decay: 0,
          sustain: 1,
          release: 3
        },
        volume: -24
      }).connect(this.filter);
      
      // Drums - deep, resonant hits
      this.drums = new Tone.MembraneSynth({
        pitchDecay: 0.1,
        octaves: 4,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.8,
          sustain: 0.01,
          release: 1.4
        },
        volume: -18
      }).connect(this.reverb);
      
      // Strings - ethereal pad
      this.strings = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 1.5,
          decay: 0.5,
          sustain: 0.8,
          release: 2
        },
        volume: -20
      }).connect(this.filter);
      
      // Wind - breathy noise
      this.wind = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: {
          attack: 0.5,
          decay: 0.3,
          sustain: 0.4,
          release: 2
        },
        volume: -28
      }).connect(this.filter);
      
      // Synth - modern pad
      this.synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 2,
        modulationIndex: 3,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.5,
          decay: 0.2,
          sustain: 0.6,
          release: 1.5
        },
        volume: -18
      }).connect(this.reverb);
      
      this.initialized = true;
      console.log('[IntroSounds] Initialized');
    } catch (error) {
      console.warn('[IntroSounds] Failed to initialize:', error);
    }
  }
  
  /**
   * Start ambient drone
   */
  startDrone() {
    if (!this.initialized || !this.enabled) return;
    
    try {
      Tone.start();
      this.drone.triggerAttack('D2');
      console.log('[IntroSounds] Drone started');
    } catch (e) {
      console.warn('[IntroSounds] Drone start failed:', e);
    }
  }
  
  /**
   * Stop ambient drone
   */
  stopDrone() {
    if (!this.initialized || !this.drone) return;
    
    try {
      this.drone.triggerRelease();
    } catch (e) {
      // Ignore
    }
  }
  
  /**
   * Play loading phase sound
   * @param {string} phase - 'drums', 'strings', 'wind', 'synth', 'human'
   */
  playPhaseSound(phase) {
    if (!this.initialized || !this.enabled || this.currentPhase === phase) return;
    this.currentPhase = phase;
    
    try {
      Tone.start();
      
      switch(phase) {
        case 'drums':
          // Deep ceremonial drum hit
          this.drums.triggerAttackRelease('D1', '2n');
          setTimeout(() => this.drums.triggerAttackRelease('A1', '4n'), 300);
          break;
          
        case 'strings':
          // Ethereal chord
          this.strings.triggerAttackRelease(['D3', 'F#3', 'A3'], '2n');
          break;
          
        case 'wind':
          // Breathy sweep
          this.wind.triggerAttackRelease('8n');
          this.filter.frequency.rampTo(4000, 0.5);
          break;
          
        case 'synth':
          // Modern ascending arpeggio
          const notes = ['D4', 'F#4', 'A4', 'D5'];
          notes.forEach((note, i) => {
            setTimeout(() => {
              this.synth.triggerAttackRelease([note], '8n');
            }, i * 150);
          });
          break;
          
        case 'human':
          // Final resolution chord
          this.strings.triggerAttackRelease(['D3', 'A3', 'D4', 'F#4'], '1n');
          this.synth.triggerAttackRelease(['A4', 'D5'], '2n');
          // Fade out drone
          setTimeout(() => this.stopDrone(), 1000);
          break;
      }
      
      console.log('[IntroSounds] Playing phase:', phase);
    } catch (e) {
      console.warn('[IntroSounds] Phase sound failed:', e);
    }
  }
  
  /**
   * Play letter appearance sound (subtle chime)
   * @param {number} index - Letter index (0-5 for CORPUS)
   */
  playLetterSound(index) {
    if (!this.initialized || !this.enabled) return;
    
    try {
      Tone.start();
      
      // Pentatonic notes for pleasant sound
      const notes = ['D4', 'E4', 'G4', 'A4', 'B4', 'D5'];
      const note = notes[index % notes.length];
      
      this.synth.triggerAttackRelease([note], '16n', undefined, 0.3);
    } catch (e) {
      // Ignore
    }
  }
  
  /**
   * Play portal hover sound
   */
  playPortalHover() {
    if (!this.initialized || !this.enabled) return;
    
    try {
      Tone.start();
      this.synth.triggerAttackRelease(['A3', 'D4'], '32n', undefined, 0.2);
    } catch (e) {
      // Ignore
    }
  }
  
  /**
   * Play portal activation sound
   */
  playPortalActivate() {
    if (!this.initialized || !this.enabled) return;
    
    try {
      Tone.start();
      // Dramatic rising chord
      this.synth.triggerAttackRelease(['D3', 'A3', 'D4', 'A4'], '4n');
      this.drums.triggerAttackRelease('D2', '4n');
    } catch (e) {
      // Ignore
    }
  }
  
  /**
   * Set enabled state
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopDrone();
    }
  }
  
  /**
   * Cleanup
   */
  dispose() {
    this.stopDrone();
    
    [this.drone, this.drums, this.strings, this.wind, this.synth, this.reverb, this.filter].forEach(component => {
      try {
        component?.dispose();
      } catch (e) {
        // Ignore
      }
    });
    
    this.initialized = false;
  }
}

// Export singleton
export const introSounds = new IntroSoundManager();
