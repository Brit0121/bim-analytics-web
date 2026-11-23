/**
 * ============================================================================
 * BIM ANALYTICS - MAIN CLIENT SCRIPT
 * Centralized Configuration & Interactive Behaviors
 * ============================================================================
 */

// OFFICIAL CONFIRMED SITE CONFIGURATION
const SITE_CONFIG = {
  email: "consulting@bim-analytics.io",
  domain: "https://bim-analytics.io",
  whatsapp: "https://wa.me/51993463118?text=Hola%20BIM%20Analytics%2C%20deseo%20solicitar%20informaci%C3%B3n.", // Official confirmed WhatsApp link with precargado message
  phone: "",    // TODO: Add official phone number when confirmed
  address: ""   // TODO: Add official institutional address when confirmed
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initBackToTop();
  initContactForm();
  initCourseFilters();
  initScrollAnimations();
  applyDynamicConfig();
});

/**
 * Handle dynamic configuration state for unconfirmed data
 * (WhatsApp, Phone, Exact Address)
 */
function applyDynamicConfig() {
  // If WhatsApp number or link is confirmed in SITE_CONFIG, update all wa.me links
  if (SITE_CONFIG.whatsapp && SITE_CONFIG.whatsapp.trim() !== '') {
    const targetUrl = SITE_CONFIG.whatsapp.startsWith('http')
      ? SITE_CONFIG.whatsapp
      : `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, '')}`;
    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
      el.href = targetUrl;
    });
  }

  // If WhatsApp is empty, ensure components marked with data-config are safely hidden
  const whatsappElements = document.querySelectorAll('[data-config="whatsapp"]');
  whatsappElements.forEach(el => {
    if (!SITE_CONFIG.whatsapp || SITE_CONFIG.whatsapp.trim() === '') {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    } else {
      const targetUrl = SITE_CONFIG.whatsapp.startsWith('http')
        ? SITE_CONFIG.whatsapp
        : `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, '')}`;
      if (el.tagName === 'A') {
        el.href = targetUrl;
      } else {
        const link = el.querySelector('a');
        if (link) link.href = targetUrl;
      }
      el.style.display = '';
      el.removeAttribute('aria-hidden');
    }
  });

  // If Phone is empty, safely hide phone-specific callouts
  const phoneElements = document.querySelectorAll('[data-config="phone"]');
  phoneElements.forEach(el => {
    if (!SITE_CONFIG.phone || SITE_CONFIG.phone.trim() === '') {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.href = `tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`;
    }
  });

  // If Address is empty, safely handle the map container
  const addressElements = document.querySelectorAll('[data-config="address"]');
  addressElements.forEach(el => {
    if (!SITE_CONFIG.address || SITE_CONFIG.address.trim() === '') {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    }
  });
}

/**
 * Sticky Header Scroll Behavior
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Fullscreen Accessible Mobile Menu
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.mobile-nav-panel');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !panel) return;

  let savedScrollY = 0;

  const openMenu = () => {
    savedScrollY = window.scrollY;
    panel.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeMenu = () => {
    panel.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Capacitaciones Filter Tabs
 */
function initCourseFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const courses = document.querySelectorAll('.course-card');

  if (!pills.length || !courses.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      courses.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'todas' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/**
 * Contact Form Validation & Mailto Fallback
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusBox = document.getElementById('formStatus');

  if (!form) return;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Nombre
    const nameInput = document.getElementById('nombre');
    const nameError = document.getElementById('nombreError');
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('is-invalid');
      if (nameError) nameError.style.display = 'block';
      isValid = false;
    } else {
      nameInput.classList.remove('is-invalid');
      if (nameError) nameError.style.display = 'none';
    }

    // Empresa
    const empresaInput = document.getElementById('empresa');
    const empresaError = document.getElementById('empresaError');
    if (!empresaInput.value.trim()) {
      empresaInput.classList.add('is-invalid');
      if (empresaError) empresaError.style.display = 'block';
      isValid = false;
    } else {
      empresaInput.classList.remove('is-invalid');
      if (empresaError) empresaError.style.display = 'none';
    }

    // Correo
    const emailInput = document.getElementById('correo');
    const emailError = document.getElementById('correoError');
    if (!validateEmail(emailInput.value.trim())) {
      emailInput.classList.add('is-invalid');
      if (emailError) emailError.style.display = 'block';
      isValid = false;
    } else {
      emailInput.classList.remove('is-invalid');
      if (emailError) emailError.style.display = 'none';
    }

    // Teléfono
    const phoneInput = document.getElementById('telefono');
    const phoneError = document.getElementById('telefonoError');
    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 6) {
      phoneInput.classList.add('is-invalid');
      if (phoneError) phoneError.style.display = 'block';
      isValid = false;
    } else {
      phoneInput.classList.remove('is-invalid');
      if (phoneError) phoneError.style.display = 'none';
    }

    // Tipo de consulta
    const consultaInput = document.getElementById('tipoConsulta');
    const consultaError = document.getElementById('tipoConsultaError');
    if (!consultaInput.value) {
      consultaInput.classList.add('is-invalid');
      if (consultaError) consultaError.style.display = 'block';
      isValid = false;
    } else {
      consultaInput.classList.remove('is-invalid');
      if (consultaError) consultaError.style.display = 'none';
    }

    // Mensaje
    const msgInput = document.getElementById('mensaje');
    const msgError = document.getElementById('mensajeError');
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      msgInput.classList.add('is-invalid');
      if (msgError) msgError.style.display = 'block';
      isValid = false;
    } else {
      msgInput.classList.remove('is-invalid');
      if (msgError) msgError.style.display = 'none';
    }

    // Privacidad
    const privacyCheck = document.getElementById('privacidadCheck');
    const privacyError = document.getElementById('privacidadError');
    if (!privacyCheck.checked) {
      if (privacyError) privacyError.style.display = 'block';
      isValid = false;
    } else {
      if (privacyError) privacyError.style.display = 'none';
    }

    if (!isValid) {
      if (statusBox) {
        statusBox.className = 'form-status error';
        statusBox.innerHTML = 'Por favor, completa correctamente todos los campos obligatorios.';
      }
      return;
    }

    // Honest handling for static hosting: compose mailto action
    const subject = encodeURIComponent(`Consulta BIM: ${consultaInput.value} - ${empresaInput.value.trim()}`);
    const body = encodeURIComponent(
      `Nombre: ${nameInput.value.trim()}\n` +
      `Empresa: ${empresaInput.value.trim()}\n` +
      `Correo: ${emailInput.value.trim()}\n` +
      `Teléfono: ${phoneInput.value.trim()}\n` +
      `Tipo de Consulta: ${consultaInput.value}\n\n` +
      `Mensaje:\n${msgInput.value.trim()}\n`
    );

    const mailtoUrl = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;

    if (statusBox) {
      statusBox.className = 'form-status info';
      statusBox.innerHTML = `
        <strong>Consulta preparada para envío:</strong><br>
        Al no requerir registro en servidores externos, tu cliente de correo se abrirá con los datos redactados directamente para <strong>${SITE_CONFIG.email}</strong>.<br>
        <div style="margin-top: 10px;">
          <a href="${mailtoUrl}" class="btn btn-primary" style="display:inline-flex; padding: 8px 16px; font-size: 0.88rem;">Abrir cliente de correo ahora</a>
        </div>
      `;
    }

    // Trigger mailto link
    window.location.href = mailtoUrl;
  });
}

/**
 * Progressive Enhancement: Scroll Animations with IntersectionObserver
 */
function initScrollAnimations() {
  // If reduced motion is preferred, bail out immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    return;
  }

  document.documentElement.classList.add('js-observer-ready');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  const targets = document.querySelectorAll('.animate-fade-up');
  targets.forEach(t => observer.observe(t));
}

/**
 * Back to Top Floating Button Behavior
 * Displays smoothly when scroll > 300px, hidden near top
 * Supports prefers-reduced-motion
 */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}

/**
 * ============================================================================
 * VIEWPORT OVERFLOW AUDITOR
 * Verifies clientWidth vs scrollWidth and detects any element crossing boundary
 * ============================================================================
 */
window.__RUN_VIEWPORT_AUDIT__ = function() {
  const innerW = window.innerWidth;
  const cw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;

  const overflowing = [...document.querySelectorAll('*')]
    .filter(el => {
      if (el.id === 'audit-result-box' || el.closest('#mobileNavPanel:not(.open)')) return false;
      const r = el.getBoundingClientRect();
      return r.right > innerW + 1.5 || r.left < -1.5;
    })
    .map(el => ({
      tag: el.tagName,
      cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 40) : '',
      id: el.id || '',
      left: Math.round(el.getBoundingClientRect().left),
      right: Math.round(el.getBoundingClientRect().right),
      w: Math.round(el.getBoundingClientRect().width)
    }));

  return {
    viewport: innerW,
    clientWidth: cw,
    scrollWidth: sw,
    overflowDiff: sw - cw,
    overflowCount: overflowing.length,
    elements: overflowing
  };
};

function runAndInjectAudit() {
  const result = window.__RUN_VIEWPORT_AUDIT__();
  let div = document.getElementById('audit-result-box');
  if (!div) {
    div = document.createElement('div');
    div.id = 'audit-result-box';
    div.style.display = 'none';
    div.style.position = 'fixed';
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    div.style.width = '0px';
    div.style.height = '0px';
    div.style.overflow = 'hidden';
    document.body.appendChild(div);
  }
  div.innerText = 'AUDIT_OUTPUT_JSON:' + JSON.stringify(result);
}

if (document.readyState === 'complete') {
  runAndInjectAudit();
} else {
  window.addEventListener('load', runAndInjectAudit);
}
