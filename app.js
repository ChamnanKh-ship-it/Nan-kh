// ================================
// Litmatch Clone — App JS
// ================================

(function () {
  'use strict';

  /* ---- Nav scroll effect ---- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---- Mobile nav drawer ---- */
  var burger      = document.getElementById('burger');
  var navDrawer   = document.getElementById('navDrawer');
  var drawerClose = document.getElementById('drawerClose');
  var navOverlay  = document.getElementById('navOverlay');

  function openDrawer() {
    navDrawer.classList.add('open');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  burger      && burger.addEventListener('click', openDrawer);
  drawerClose && drawerClose.addEventListener('click', closeDrawer);
  navOverlay  && navOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.nav-drawer__link').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---- App preview tab switching ---- */
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

  /* ---- Match card connect buttons ---- */
  document.querySelectorAll('.match-card__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.closest('.match-card').querySelector('strong').textContent;
      btn.textContent = '✓ Sent';
      btn.style.background = '#22c55e';
      btn.disabled = true;
    });
  });

  /* ---- QR code mock generator ---- */
  var qrGrid = document.getElementById('qrGrid');
  if (qrGrid) {
    // Generate a pseudo-random but stable QR-like pattern
    var seed = 42;
    function rand() {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    }

    var cells = 10;
    // Corner finder patterns (top-left, top-right, bottom-left)
    var finderCells = new Set();
    // Top-left 3x3
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) finderCells.add(r + ',' + c);
    // Top-right 3x3
    for (var r = 0; r < 3; r++) for (var c = 7; c < 10; c++) finderCells.add(r + ',' + c);
    // Bottom-left 3x3
    for (var r = 7; r < 10; r++) for (var c = 0; c < 3; c++) finderCells.add(r + ',' + c);

    for (var row = 0; row < cells; row++) {
      for (var col = 0; col < cells; col++) {
        var cell = document.createElement('div');
        cell.className = 'qr-cell';
        var key = row + ',' + col;
        var dark;
        if (finderCells.has(key)) {
          dark = true;
        } else {
          dark = rand() > 0.45;
        }
        cell.style.background = dark ? '#0f172a' : '#ffffff';
        qrGrid.appendChild(cell);
      }
    }
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = document.getElementById('nav').offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Intersection Observer: fade-in on scroll ---- */
  var fadeEls = document.querySelectorAll(
    '.feature-card, .step, .review-card, .hero__text, .hero__phone'
  );

  fadeEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  /* ---- Store buttons ---- */
  document.querySelectorAll('.store-btn, .btn--primary, .btn--dark').forEach(function (btn) {
    if (btn.getAttribute('href') === '#download' || btn.closest('.download__btns')) {
      btn.addEventListener('click', function (e) {
        if (btn.getAttribute('href') === '#') {
          e.preventDefault();
          alert('Litmatch is available on the App Store and Google Play.\n\nSearch "Litmatch" to download.');
        }
      });
    }
  });

})();
