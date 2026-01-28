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
  // Opening scene animations
  const openingTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scene--opening',
      start: 'top top',
      end: 'bottom center',
      scrub: false,
    }
  });

  openingTl
    .to('.title', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
    .to('.subtitle', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=1');

  // Fade out opening on scroll
  gsap.to('.scene--opening .scene__content', {
    opacity: 0,
    y: -50,
    scrollTrigger: {
      trigger: '.scene--opening',
      start: 'center center',
      end: 'bottom top',
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

function initSilhouetteAnimations() {
  // Opening - Death emerges from mist
  gsap.to('.silhouette--death-distant', {
    opacity: 1,
    y: -20,
    scrollTrigger: {
      trigger: '.scene--opening',
      start: 'top top',
      end: 'center top',
      scrub: true,
    }
  });

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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAnimations);

// Refresh ScrollTrigger on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});
