/* ========================================
   Dr. Rebecca Theodore — Portfolio Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 60);
    // Back-to-top
    backToTop.classList.toggle('visible', scrollY > 500);
    // Active nav link
    highlightNavLink();
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- ACTIVE NAV LINK ---------- */
  const sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  /* ---------- TYPING ANIMATION ---------- */
  const typingEl = document.getElementById('heroTyping');
  const phrases  = [
    'Specialized in HR & Marketing',
    '17+ Years of Academic Excellence',
    'Driving Research & Innovation',
    'Mentoring the Next Generation',
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseEnd  = 0;

  function typeLoop() {
    const current = phrases[phraseIdx];
    const speed   = deleting ? 30 : 60;

    if (!deleting && charIdx <= current.length) {
      typingEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor"></span>';
      charIdx++;
      if (charIdx > current.length) {
        // Pause before deleting
        setTimeout(() => { deleting = true; typeLoop(); }, 2000);
        return;
      }
    } else if (deleting && charIdx >= 0) {
      typingEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor"></span>';
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
        setTimeout(typeLoop, 400);
        return;
      }
    }
    setTimeout(typeLoop, speed);
  }
  // Start after hero fade-in
  setTimeout(typeLoop, 1400);

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target   = +el.getAttribute('data-target');
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const ease = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ---------- SKILL BAR ANIMATION ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(bar => skillObserver.observe(bar));

  /* ---------- TIMELINE EXPAND / COLLAPSE ---------- */
  // Exposed as global for onclick attribute
  window.toggleTimeline = function(card) {
    // Close other cards
    document.querySelectorAll('.timeline-card.expanded').forEach(c => {
      if (c !== card) c.classList.remove('expanded');
    });
    card.classList.toggle('expanded');
  };

  /* ---------- PUBLICATIONS FILTER ---------- */
  const filterBtns = document.querySelectorAll('.filter-tag');
  const pubCards   = document.querySelectorAll('.pub-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      pubCards.forEach(card => {
        const cats = card.getAttribute('data-category') || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.style.display = '';
          // Re-trigger reveal
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------- CONTACT FORM HANDLING WITH EMAILJS ---------- */
  (function() {
      // https://dashboard.emailjs.com/admin/account
      // Replace YOUR_PUBLIC_KEY with your own public key
      emailjs.init("_fLlIcmpmLbOPgUrY");
  })();

  const form = document.getElementById('contactForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Inputs
    const name    = document.getElementById('formName');
    const email   = document.getElementById('formEmail');
    const subject = document.getElementById('formSubject');
    const message = document.getElementById('formMessage');

    // Reset errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    // Basic Validation
    if (!name.value.trim()) {
      name.closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!subject.value.trim()) {
      subject.closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!message.value.trim()) {
      message.closest('.form-group').classList.add('error');
      valid = false;
    }

    if (valid) {
      // Toggle button state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      // Send form using EmailJS
      // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with yours
      emailjs.sendForm('service_v2fkqzq', 'template_5kzktwy', form)
        .then(() => {
          // Success
          document.getElementById('formSuccess').textContent = "Thank you! Your message has been sent successfully.";
          document.getElementById('formSuccess').classList.add('show');
          document.getElementById('formSuccess').style.color = "var(--success-color, #22c55e)";
          form.reset();
        })
        .catch((error) => {
          // Error
          console.error('EmailJS Error:', error);
          document.getElementById('formSuccess').textContent = "Oops! Something went wrong. Please try again later.";
          document.getElementById('formSuccess').classList.add('show');
          document.getElementById('formSuccess').style.color = "var(--error-color, #ef4444)";
        })
        .finally(() => {
          // Restore button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          // Hide message after 5s
          setTimeout(() => {
            document.getElementById('formSuccess').classList.remove('show');
          }, 5000);
        });
    }
  });

});
