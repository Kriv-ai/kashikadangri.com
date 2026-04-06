/* ============================================
   Kashika Dangri - Personal Website
   Main JavaScript - All interactions
   ============================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const nav = document.querySelector('.nav');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        nav.classList.toggle('nav--scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const menu = document.querySelector('.nav__menu');
  const overlay = document.querySelector('.nav__overlay');
  const menuLinks = menu ? menu.querySelectorAll('.nav__link, .nav__cta') : [];

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    if (menuLinks.length) menuLinks[0].focus();
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  function isMenuOpen() {
    return hamburger.getAttribute('aria-expanded') === 'true';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      isMenuOpen() ? closeMenu() : openMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close on nav link click
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (isMenuOpen()) closeMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
    }
  });

  // Focus trap within mobile menu
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !isMenuOpen()) return;

    var focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll reveal ---- */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---- Stats counter animation ---- */
  var counters = document.querySelectorAll('.counter');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-target'), 10);
    var duration = target < 10 ? 1000 : target < 100 ? 1500 : 2000;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var value = Math.floor(target * easeOutCubic(progress));
      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ---- Active nav link highlighting ---- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

})();
