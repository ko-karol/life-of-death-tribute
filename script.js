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
      // Gentle upward float with horizontal drift
      p.drift += p.driftSpeed;
      p.x += p.speedX + Math.sin(p.drift) * 0.3;
      p.y += p.speedY;

      // Reset particle when it goes off screen
      if (p.y < -10) {
        this.particles[index] = this.createParticle(true);
      }

      // Wrap horizontally
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

// Initialize animations
function initAnimations() {
  // Hero reveal animation
  initHeroAnimation();

  // Fade out hero on scroll
  gsap.to('.hero__content', {
    opacity: 0,
    y: -80,
    scrollTrigger: {
      trigger: '.hero',
      start: '20% top',
      end: '80% top',
      scrub: true,
    }
  });


  // Death silhouette reveal and parallax
  gsap.to('.silhouette--death-hero', {
    opacity: 1,
    y: -30,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: true,
    }
  });

  // Text blocks fade in for each scene
  const scenes = [
    '.scene--encounter',
    '.scene--waiting',
    '.scene--near',
    '.scene--embrace',
    '.scene--reflection'
  ];

  scenes.forEach((scene) => {
    const textBlock = document.querySelector(`${scene} .text-block`);
    if (!textBlock) return;

    // Main text block fade in
    gsap.to(textBlock, {
      opacity: 1,
      scrollTrigger: {
        trigger: scene,
        start: 'top center',
        end: 'center center',
        scrub: true,
      }
    });

    // Parallax effect on text
    gsap.to(textBlock, {
      y: -30,
      scrollTrigger: {
        trigger: scene,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Stagger paragraphs
    const paragraphs = textBlock.querySelectorAll('p, h2');
    paragraphs.forEach((p, index) => {
      gsap.from(p, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: scene,
          start: `top+=${index * 50} center`,
          end: `top+=${index * 50 + 100} center`,
          scrub: true,
        }
      });
    });
  });

  // Special animation for reflection text
  const reflectionTexts = document.querySelectorAll('.reflection-text');
  reflectionTexts.forEach((text, index) => {
    gsap.from(text, {
      opacity: 0,
      y: 40,
      scrollTrigger: {
        trigger: '.scene--reflection',
        start: `top+=${index * 100} center`,
        end: `top+=${index * 100 + 150} center`,
        scrub: true,
      }
    });
  });

  // Divider animation
  gsap.from('.divider', {
    scaleX: 0,
    scrollTrigger: {
      trigger: '.divider',
      start: 'top 80%',
      end: 'top 60%',
      scrub: true,
    }
  });

  // Credits fade in
  gsap.from('.credit', {
    opacity: 0,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.credit',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });

  // Ambient background movement
  document.querySelectorAll('.scene__background').forEach((bg) => {
    gsap.to(bg, {
      y: -50,
      scrollTrigger: {
        trigger: bg.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });

  // Silhouette animations
  initSilhouetteAnimations();
}

function initHeroAnimation() {
  const heroTl = gsap.timeline({ delay: 0.5 });

  heroTl
    // Title lines emerge from mist
    .to('.hero__title-line', {
      opacity: 1,
      y: 0,
      duration: 1.8,
      stagger: 0.4,
      ease: 'power3.out'
    })
    // Subtitle fades in
    .to('.hero__subtitle', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=0.8')
    // Death silhouette starts to emerge
    .to('.silhouette--death-hero', {
      opacity: 0.5,
      duration: 3,
      ease: 'power1.out'
    }, '-=1.5');
}

function initSilhouetteAnimations() {

  // Encounter - Deer and Death parallax
  gsap.from('.silhouette--deer', {
    x: -50,
    opacity: 0,
    scrollTrigger: {
      trigger: '.scene--encounter',
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
    }
  });

  gsap.from('.silhouette--death-watching', {
    x: 50,
    opacity: 0,
    scrollTrigger: {
      trigger: '.scene--encounter',
      start: 'top 60%',
      end: 'top 10%',
      scrub: true,
    }
  });

  // Waiting - Trees parallax at different speeds
  gsap.to('.silhouette--trees-left', {
    y: -80,
    scrollTrigger: {
      trigger: '.scene--waiting',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.to('.silhouette--trees-right', {
    y: -50,
    scrollTrigger: {
      trigger: '.scene--waiting',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.from('.silhouette--death-waiting', {
    opacity: 0,
    scale: 0.9,
    scrollTrigger: {
      trigger: '.scene--waiting',
      start: 'top 40%',
      end: 'center center',
      scrub: true,
    }
  });

  // Near - Deer grazing, death at edge
  gsap.to('.silhouette--deer-grazing', {
    x: 30,
    scrollTrigger: {
      trigger: '.scene--near',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.from('.silhouette--death-edge', {
    x: 100,
    scrollTrigger: {
      trigger: '.scene--near',
      start: 'top 60%',
      end: 'center center',
      scrub: true,
    }
  });

  // Leaves gentle drift
  gsap.to('.silhouette--leaves', {
    y: -100,
    x: 30,
    rotation: 5,
    scrollTrigger: {
      trigger: '.scene--near',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Embrace - figures fade in together
  gsap.from('.silhouette--embrace', {
    opacity: 0,
    scale: 0.95,
    scrollTrigger: {
      trigger: '.scene--embrace',
      start: 'top 60%',
      end: 'top 20%',
      scrub: true,
    }
  });

  // Reflection - spirit rises
  gsap.from('.silhouette--spirit', {
    y: 50,
    opacity: 0,
    scrollTrigger: {
      trigger: '.scene--reflection',
      start: 'top 60%',
      end: 'center center',
      scrub: true,
    }
  });

  gsap.to('.silhouette--spirit', {
    y: -100,
    scrollTrigger: {
      trigger: '.scene--reflection',
      start: 'center center',
      end: 'bottom top',
      scrub: true,
    }
  });
}

// Audio System
class AmbientAudio {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
    this.currentSection = 0;

    // Sound profiles for each section (frequencies and characteristics)
    this.sections = [
      { baseFreq: 55, volume: 0.12, detune: 0 },      // Opening - low, mysterious
      { baseFreq: 65, volume: 0.14, detune: 5 },      // Encounter - slightly warmer
      { baseFreq: 60, volume: 0.13, detune: -5 },     // Waiting - patient, steady
      { baseFreq: 70, volume: 0.15, detune: 10 },     // Near - subtle tension
      { baseFreq: 50, volume: 0.16, detune: 0 },      // Embrace - deep, peaceful
      { baseFreq: 80, volume: 0.10, detune: 15 },     // Reflection - ascending, fading
    ];

    this.button = document.getElementById('audioToggle');
    this.button.addEventListener('click', () => this.toggle());

    this.initScrollDetection();
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Master gain
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.audioContext.destination);

    // Create layered drone
    this.createDrone();
  }

  createDrone() {
    const config = this.sections[this.currentSection];

    // Clear existing oscillators
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.oscillators = [];

    // Base tone
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = config.baseFreq;

    // Harmonic layer
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = config.baseFreq * 1.5;
    osc2.detune.value = config.detune;

    // Sub layer
    const osc3 = this.audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = config.baseFreq * 0.5;

    // Individual gains
    const gain1 = this.audioContext.createGain();
    gain1.gain.value = 0.5;

    const gain2 = this.audioContext.createGain();
    gain2.gain.value = 0.2;

    const gain3 = this.audioContext.createGain();
    gain3.gain.value = 0.3;

    // Connect
    osc1.connect(gain1).connect(this.masterGain);
    osc2.connect(gain2).connect(this.masterGain);
    osc3.connect(gain3).connect(this.masterGain);

    // Start
    osc1.start();
    osc2.start();
    osc3.start();

    this.oscillators = [osc1, osc2, osc3];
    this.oscillatorGains = [gain1, gain2, gain3];
  }

  initScrollDetection() {
    const scenes = document.querySelectorAll('.scene');

    scenes.forEach((scene, index) => {
      ScrollTrigger.create({
        trigger: scene,
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

    // Smoothly transition frequencies and volume
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
  initAnimations();
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
