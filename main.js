/**
 * Tornalítica Landing Page — Interactive Logic
 * Scroll reveals, header behavior, mobile nav, animated counter
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================
  // HEADER SCROLL BEHAVIOR
  // ============================================
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on load

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const hamburger = document.getElementById('hamburger-btn');
  const navMobile = document.getElementById('nav-mobile');
  let mobileNavOpen = false;

  const toggleMobileNav = () => {
    mobileNavOpen = !mobileNavOpen;
    hamburger.classList.toggle('active', mobileNavOpen);
    navMobile.classList.toggle('open', mobileNavOpen);
    hamburger.setAttribute('aria-expanded', mobileNavOpen.toString());
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavOpen) toggleMobileNav();
    });
  });

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // COST COUNTER ANIMATION
  // ============================================
  const costCounter = document.getElementById('cost-counter');
  let counterAnimated = false;

  const animateCounter = (element, target, duration = 2000) => {
    const start = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      element.textContent = new Intl.NumberFormat('es-ES').format(current) + ' €';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
          counterAnimated = true;
          animateCounter(costCounter, 47500, 2500);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  if (costCounter) {
    counterObserver.observe(costCounter);
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ============================================
  // SUBTLE PARALLAX ON HERO
  // ============================================
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');

  const activeNavObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--color-text-primary)';
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach(section => activeNavObserver.observe(section));
});
