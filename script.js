/* ===================== MIRHA BEAUTY SALOON — SCRIPT ===================== */
document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Intro particles (rising sparkles) ---------- */
  const introParticles = document.getElementById('introParticles');
  if (introParticles) {
    const count = reducedMotion ? 0 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const left = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = 4 + Math.random() * 4;
      const drift = (Math.random() * 80 - 40) + 'px';
      const size = 3 + Math.random() * 5;
      p.style.left = left + '%';
      p.style.animationDelay = delay + 's';
      p.style.animationDuration = duration + 's';
      p.style.setProperty('--drift', drift);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      introParticles.appendChild(p);
    }
  }

  /* ---------- Ambient petal field on main site ---------- */
  const petalField = document.getElementById('petalField');
  if (petalField && !reducedMotion) {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 18) + 's';
      p.style.animationDuration = (12 + Math.random() * 10) + 's';
      const size = 6 + Math.random() * 8;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      petalField.appendChild(p);
    }
  }

  /* ---------- Cinematic intro sequence control ---------- */
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const skipBtn = document.getElementById('skipIntro');
  let introClosed = false;

  function closeIntro() {
    if (introClosed || !intro) return;
    introClosed = true;
    intro.classList.add('hide');
    site.classList.add('reveal-site');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (intro && intro.parentNode) intro.style.display = 'none';
    }, 1300);
  }

  if (intro) {
    document.body.style.overflow = 'hidden';
    // Auto-close once the brush + title animation has played (or immediately if reduced motion)
    const introDuration = reducedMotion ? 300 : 5200;
    setTimeout(closeIntro, introDuration);
  }
  if (skipBtn) skipBtn.addEventListener('click', closeIntro);
  if (intro) intro.addEventListener('click', (e) => { if (e.target === intro) closeIntro(); });

  /* ---------- Nav: scrolled state + mobile burger ---------- */
  const nav = document.getElementById('siteNav');
  const navLinks = document.getElementById('navLinks');
  const navBurger = document.getElementById('navBurger');

  function onScrollNav() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  if (navBurger && navLinks) {
    navBurger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navBurger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Contact form (front-end only, sends via tel/WhatsApp friendly message) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const interest = data.get('interest');
      const message = (data.get('message') || '').toString().trim();

      if (!name || !phone) {
        formNote.textContent = 'Please fill in your name and phone number.';
        formNote.style.color = '#ff9fc4';
        return;
      }

      formNote.textContent = `Thank you, ${name}! We'll call you on ${phone} about ${interest.toLowerCase()} shortly.`;
      formNote.style.color = '#ffd9e8';
      form.reset();
    });
  }

});
