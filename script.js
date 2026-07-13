document.addEventListener('DOMContentLoaded', () => {

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- VIDEO INTRO ---------- */
  const intro = document.getElementById('intro');
  const introVideo = document.getElementById('introVideo');
  const skipBtn = document.getElementById('skipIntro');
  document.body.style.overflow = 'hidden';

  let introClosed = false;
  const closeIntro = () => {
    if (introClosed) return;
    introClosed = true;
    intro.classList.add('curtains-open');
    setTimeout(() => {
      intro.classList.add('hide');
      document.body.style.overflow = 'auto';
      setTimeout(() => intro.remove(), 700);
    }, 1000);
  };

  if (reduceMotion) {
    setTimeout(closeIntro, 300);
  } else {
    // close once the video finishes
    introVideo.addEventListener('ended', closeIntro);
    // fallback in case video fails to load or autoplay is blocked
    introVideo.addEventListener('error', () => setTimeout(closeIntro, 300));
    setTimeout(closeIntro, 11000); // hard safety fallback
    introVideo.play().catch(() => setTimeout(closeIntro, 600));
  }
  skipBtn.addEventListener('click', closeIntro);

  /* ---------- INTRO SPARKLES ---------- */
  const sparkContainer = document.getElementById('introSparkles');
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const size = 2 + Math.random() * 3;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.animationDuration = `${1.6 + Math.random() * 2.4}s`;
    s.style.animationDelay = `${Math.random() * 3}s`;
    sparkContainer.appendChild(s);
  }

  /* ---------- PETALS ---------- */
  const petalContainer = document.getElementById('petals');
  const PETAL_COUNT = 22;
  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'petal' + (Math.random() > 0.7 ? ' gold' : '');
    const size = 6 + Math.random() * 10;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
    p.style.animationDuration = `${9 + Math.random() * 10}s`;
    p.style.animationDelay = `${Math.random() * 12}s`;
    petalContainer.appendChild(p);
  }

  /* ---------- CURSOR GLOW ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.classList.add('active');
    });
    window.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.fx-rise');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  /* ---------- COUNT UP STAT ---------- */
  const statEl = document.querySelector('[data-count]');
  if (statEl) {
    const target = parseInt(statEl.dataset.count, 10);
    let started = false;
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          let current = 0;
          const step = Math.max(1, Math.round(target / 40));
          const tick = () => {
            current += step;
            if (current >= target) { statEl.textContent = target; return; }
            statEl.textContent = current;
            requestAnimationFrame(tick);
          };
          tick();
        }
      });
    }, { threshold: 0.4 });
    statObserver.observe(statEl);
  }

  /* ---------- TILT CARDS ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (track && dotsWrap) {
    const slides = track.children.length;
    let index = 0;
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.querySelectorAll('button');
    function goTo(i) {
      index = i;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }
    let autoTimer = setInterval(() => goTo((index + 1) % slides), 5000);
    dotsWrap.addEventListener('click', () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo((index + 1) % slides), 5000);
    });
  }
});
