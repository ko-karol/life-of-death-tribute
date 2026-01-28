// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Ambient Particles
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(startFromBottom = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: startFromBottom ? this.canvas.height + 10 : Math.random() * this.canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.3 + 0.1,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.005 + 0.002
    };
  }

  update() {
    this.particles.forEach((p, index) => {
      p.drift += p.driftSpeed;
      p.x += p.speedX + Math.sin(p.drift) * 0.3;
      p.y += p.speedY;

      if (p.y < -10) {
        this.particles[index] = this.createParticle(true);
      }

      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(200, 190, 175, ${p.opacity})`;
      this.ctx.fill();
    });
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles
const particleCanvas = document.getElementById('particles');
if (particleCanvas) {
  new ParticleSystem(particleCanvas);
}

// Panel Controller
class PanelController {
  constructor() {
    this.stage = document.querySelector('.stage');
    this.panels = document.querySelectorAll('.panel');
    this.scrollHint = document.querySelector('.scroll-hint');
    this.currentSection = -1; // Start at -1 so first setActiveSection(0) runs

    // Set initial state
    this.setActiveSection(0);
    this.initScrollTriggers();
  }

  initScrollTriggers() {
    const sections = document.querySelectorAll('.scroll-track__section');

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.setActiveSection(index),
        onEnterBack: () => this.setActiveSection(index),
      });
    });
  }

  setActiveSection(index) {
    if (index === this.currentSection) return;

    this.currentSection = index;

    // Update stage background
    this.stage.setAttribute('data-active-section', index);

    // Switch panels
    this.panels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add('is-active');
      } else {
        panel.classList.remove('is-active');
      }
    });

    // Hide scroll hint after first section
    if (index > 0) {
      this.scrollHint.classList.add('is-hidden');
    } else {
      this.scrollHint.classList.remove('is-hidden');
    }
  }
}

// Audio System
class AmbientAudio {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
    this.currentSection = 0;

    this.sections = [
      { baseFreq: 55, volume: 0.12, detune: 0 },
      { baseFreq: 65, volume: 0.14, detune: 5 },
      { baseFreq: 60, volume: 0.13, detune: -5 },
      { baseFreq: 70, volume: 0.15, detune: 10 },
      { baseFreq: 50, volume: 0.16, detune: 0 },
      { baseFreq: 80, volume: 0.10, detune: 15 },
    ];

    this.button = document.getElementById('audioToggle');
    this.button.addEventListener('click', () => this.toggle());

    this.initScrollDetection();
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.audioContext.destination);

    this.createDrone();
  }

  createDrone() {
    const config = this.sections[this.currentSection];

    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.oscillators = [];

    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = config.baseFreq;

    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = config.baseFreq * 1.5;
    osc2.detune.value = config.detune;

    const osc3 = this.audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = config.baseFreq * 0.5;

    const gain1 = this.audioContext.createGain();
    gain1.gain.value = 0.5;

    const gain2 = this.audioContext.createGain();
    gain2.gain.value = 0.2;

    const gain3 = this.audioContext.createGain();
    gain3.gain.value = 0.3;

    osc1.connect(gain1).connect(this.masterGain);
    osc2.connect(gain2).connect(this.masterGain);
    osc3.connect(gain3).connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();

    this.oscillators = [osc1, osc2, osc3];
    this.oscillatorGains = [gain1, gain2, gain3];
  }

  initScrollDetection() {
    const sections = document.querySelectorAll('.scroll-track__section');

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.transitionTo(index),
        onEnterBack: () => this.transitionTo(index),
      });
    });
  }

  transitionTo(sectionIndex) {
    if (!this.audioContext || !this.isPlaying) return;
    if (sectionIndex === this.currentSection) return;

    this.currentSection = sectionIndex;
    const config = this.sections[sectionIndex];
    const time = this.audioContext.currentTime;

    if (this.oscillators.length >= 3) {
      this.oscillators[0].frequency.linearRampToValueAtTime(config.baseFreq, time + 2);
      this.oscillators[1].frequency.linearRampToValueAtTime(config.baseFreq * 1.5, time + 2);
      this.oscillators[1].detune.linearRampToValueAtTime(config.detune, time + 2);
      this.oscillators[2].frequency.linearRampToValueAtTime(config.baseFreq * 0.5, time + 2);
    }

    this.masterGain.gain.linearRampToValueAtTime(config.volume, time + 1.5);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    if (!this.audioContext) {
      this.initAudioContext();
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.createDrone();

    const config = this.sections[this.currentSection];
    this.masterGain.gain.linearRampToValueAtTime(config.volume, this.audioContext.currentTime + 2);

    this.isPlaying = true;
    this.button.classList.add('is-playing');
  }

  stop() {
    if (!this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      this.oscillators = [];
    }, 1100);

    this.isPlaying = false;
    this.button.classList.remove('is-playing');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PanelController();
  new AmbientAudio();
});

// Refresh ScrollTrigger on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});
