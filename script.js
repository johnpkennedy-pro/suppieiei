/* ============================================================
   SCRIPT.JS — GSAP + Interactions + Scroll
   Suppu's Tiny Universe
   ============================================================ */

(function () {
  'use strict';

  // ---- GSAP ScrollTrigger register ----
  gsap.registerPlugin(ScrollTrigger);

  // ============================================================
  // 1. LOADER
  // ============================================================
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      loader.classList.add('fade-out');

      // Start Act 1 animation after loader fades
      setTimeout(startAct1, 900);

      // Show audio player after loader
      setTimeout(() => {
        document.getElementById('audio-player').classList.remove('hidden');
      }, 1200);
    }, 1800);
  });

  // ============================================================
  // 2. ACT 1 — ENTRANCE ANIMATION
  // ============================================================
  function startAct1() {
    const tl = gsap.timeline();

    // Yarn ball rolls in
    tl.fromTo('.yarn-ball-intro',
      { opacity: 0, scale: 0, x: '-40vw', y: '20vh' },
      { opacity: 1, scale: 1, x: 0, y: 0, duration: 1.4, ease: 'back.out(1.4)' }
    )
    .to('.yarn-ball-intro svg', {
      rotation: 720,
      x: '30vw',
      y: '-15vh',
      scale: 0.3,
      opacity: 0,
      duration: 1.6,
      ease: 'power2.inOut',
    }, '+=0.3')

    // Title reveals
    .to('#act1-title', { opacity: 1, duration: 0.1 }, '-=0.5')
    .to('.title-text-svg', {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power2.inOut',
    }, '-=0.3')
    .fromTo('.act1-subtitle',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
    '-=0.5');
  }

  // ============================================================
  // 3. SCROLL REVEAL (Intersection Observer)
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-text, .reveal-card').forEach(el => {
    revealObserver.observe(el);
  });

  // ============================================================
  // 4. TIMELINE THREAD ANIMATION (Act 3)
  // ============================================================
  ScrollTrigger.create({
    trigger: '#act3',
    start: 'top 70%',
    onEnter: () => {
      gsap.to('#timeline-thread', {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  });

  // ============================================================
  // 5. ACT 5 — HAND-HOLDING REVEAL
  // ============================================================
  ScrollTrigger.create({
    trigger: '#act5',
    start: 'top 60%',
    onEnter: () => {
      // Animate approach thread first
      gsap.to('#approach-path', {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power1.inOut',
        onComplete: () => {
          // Then reveal the photo + message
          document.getElementById('handheld-reveal').classList.add('visible');
        }
      });
    }
  });

  // ============================================================
  // 6. ACT 6 — FINALE
  // ============================================================
  ScrollTrigger.create({
    trigger: '#act6',
    start: 'top 70%',
    onEnter: () => {
      // Stars burst in
      spawnFinaleStars();

      // Handwritten text reveal
      gsap.to('.finale-text-svg', {
        strokeDashoffset: 0,
        duration: 3,
        ease: 'power2.inOut',
        delay: 0.4,
      });

      // Yarn loop pulse entrance
      gsap.fromTo('.finale-yarn-loop',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.6)', delay: 2.5 }
      );
    }
  });

  function spawnFinaleStars() {
    const container = document.getElementById('finale-stars');
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'finale-star';
      star.style.left  = Math.random() * 100 + '%';
      star.style.top   = Math.random() * 100 + '%';
      star.style.setProperty('--dur',   (1.5 + Math.random() * 3) + 's');
      star.style.setProperty('--delay', (Math.random() * 2) + 's');
      container.appendChild(star);
    }
  }

  // ============================================================
  // 7. AUDIO PLAYER
  // ============================================================
  const audio   = document.getElementById('bg-audio');
  const playBtn = document.getElementById('audio-play-btn');
  const muteBtn = document.getElementById('audio-mute-btn');

  let isPlaying = false;

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playBtn.textContent = '▶';
    } else {
      audio.play().catch(() => {});
      playBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
  });

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  });

  // ============================================================
  // 8. CHERRY BLOSSOMS
  // ============================================================
  const blossomContainer = document.getElementById('blossoms-container');
  const blossomEmojis = ['🌸', '🌸', '🌺', '✿', '❀'];

  function spawnBlossom() {
    const b = document.createElement('div');
    b.className = 'blossom';
    b.textContent = blossomEmojis[Math.floor(Math.random() * blossomEmojis.length)];
    b.style.left        = Math.random() * 100 + 'vw';
    b.style.fontSize    = (0.8 + Math.random() * 0.9) + 'rem';
    b.style.animationDuration  = (7 + Math.random() * 10) + 's';
    b.style.animationDelay     = (Math.random() * 3) + 's';
    b.style.opacity = 0.5 + Math.random() * 0.4;

    blossomContainer.appendChild(b);

    setTimeout(() => b.remove(), 20000);
  }

  // Start cherry blossom rain after loader
  setTimeout(() => {
    setInterval(spawnBlossom, 1800);
    spawnBlossom();
    spawnBlossom();
  }, 2200);

  // ============================================================
  // 9. FLOATING DOODLES
  // ============================================================
  const doodleContainer = document.getElementById('doodles-container');
  const doodleSymbols   = [
    '✦', '✧', '⋆', '☽', '✿', '❀', '❁', '◦', '⌀', '✺',
    '✻', '✸', '◈', '☆', '♪', '♬', '✩', '✦', '❋', '✤'
  ];

  function spawnDoodle() {
    const d = document.createElement('div');
    d.className = 'float-doodle';
    d.textContent = doodleSymbols[Math.floor(Math.random() * doodleSymbols.length)];

    const size = 0.8 + Math.random() * 1.4;
    d.style.fontSize    = size + 'rem';
    d.style.left        = (5 + Math.random() * 90) + 'vw';
    d.style.top         = (5 + Math.random() * 90) + 'vh';

    const duration = 8 + Math.random() * 12;
    d.style.animationDuration = duration + 's';
    d.style.animationDelay   = (Math.random() * 4) + 's';

    doodleContainer.appendChild(d);
    setTimeout(() => d.remove(), (duration + 4) * 1000);
  }

  setTimeout(() => {
    for (let i = 0; i < 12; i++) spawnDoodle();
    setInterval(spawnDoodle, 3000);
  }, 2800);

  // ============================================================
  // 10. EASTER EGG (Act 4 — the moon orb)
  // ============================================================
  const easterOrbs = document.querySelectorAll('.easter-egg');
  const eggMsg     = document.getElementById('easter-egg-msg');

  easterOrbs.forEach(orb => {
    orb.addEventListener('click', () => {
      eggMsg.classList.remove('hidden');
      requestAnimationFrame(() => {
        eggMsg.classList.add('visible');
      });
    });
  });

  // ============================================================
  // 11. CARD HOVER — 3D TILT EFFECT
  // ============================================================
  document.querySelectorAll('.memory-card, .tl-node, .dream-orb, .saree-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================================
  // 12. SECTION PARALLAX (lightweight, JS-driven)
  // ============================================================
  let lastScrollY = 0;

  function onScroll() {
    lastScrollY = window.scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Subtle quote text parallax
  function parallaxTick() {
    const quoteEl = document.querySelector('.quote-text');
    if (quoteEl) {
      const rect = quoteEl.getBoundingClientRect();
      const cy   = window.innerHeight / 2;
      const d    = (rect.top - cy) / window.innerHeight;
      quoteEl.style.transform = `translateY(${d * 18}px)`;
    }
    requestAnimationFrame(parallaxTick);
  }

  parallaxTick();

  // ============================================================
  // 13. GSAP SCROLL-DRIVEN TEXT PARALLAX (act headings)
  // ============================================================
  gsap.utils.toArray('.act-heading').forEach(el => {
    gsap.fromTo(el,
      { y: 30 },
      {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      }
    );
  });

  // ============================================================
  // 14. MEMORY GRID — staggered GSAP on scroll
  // ============================================================
  ScrollTrigger.create({
    trigger: '.memory-grid',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo('.memory-card',
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }
  });

  // ============================================================
  // 15. DREAM ORBS — wave stagger
  // ============================================================
  ScrollTrigger.create({
    trigger: '.dream-grid',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo('.dream-orb',
        { opacity: 0, y: 40, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          stagger: {
            each: 0.07,
            from: 'center',
          },
          ease: 'back.out(1.3)',
        }
      );
    }
  });

  // ============================================================
  // 16. TIMELINE — left and right nodes stagger
  // ============================================================
  ScrollTrigger.create({
    trigger: '.timeline-wrapper',
    start: 'top 70%',
    onEnter: () => {
      gsap.fromTo('.left-track .tl-node',
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.9, stagger: 0.25, ease: 'power3.out' }
      );
      gsap.fromTo('.right-track .tl-node',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.9, stagger: 0.25, ease: 'power3.out', delay: 0.1 }
      );
    }
  });

  // ============================================================
  // 17. SMOOTH SCROLL OFFSET FOR IN-PAGE ANCHORS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 18. ACT 2 MEMORY FEATURE — cinematic reveal
  // ============================================================
  ScrollTrigger.create({
    trigger: '.memory-feature',
    start: 'top 75%',
    onEnter: () => {
      gsap.fromTo('.feature-frame',
        { opacity: 0, scale: 0.88, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, stagger: 0.25, ease: 'power3.out' }
      );
      gsap.fromTo('.quote-text',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.5, ease: 'power2.out' }
      );
    }
  });

  // ============================================================
  // 19. SAREE STRIP — diagonal reveal
  // ============================================================
  ScrollTrigger.create({
    trigger: '.saree-strip',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo('.saree-card',
        { opacity: 0, y: 40, rotation: 3 },
        { opacity: 1, y: 0, rotation: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );
    }
  });

  // ============================================================
  // 20. FINALE PHOTOS — Polaroid slide-in
  // ============================================================
  ScrollTrigger.create({
    trigger: '.finale-photos',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo('.finale-photo-frame:first-child',
        { opacity: 0, x: -40, rotation: -6 },
        { opacity: 1, x: 0, rotation: -3, duration: 1.1, ease: 'back.out(1.2)', delay: 1.5 }
      );
      gsap.fromTo('.finale-photo-frame:last-child',
        { opacity: 0, x: 40, rotation: 6 },
        { opacity: 1, x: 0, rotation: 3, duration: 1.1, ease: 'back.out(1.2)', delay: 1.7 }
      );
    }
  });

})();
