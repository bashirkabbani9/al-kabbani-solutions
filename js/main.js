// ===========================
// 1. Scroll Reveal Animation
// ===========================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach((el) => revealObserver.observe(el));

// ===========================
// 2. Mobile Navigation Toggle
// ===========================
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = navMenu.querySelectorAll('.nav__link, .nav__cta');

navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// ===========================
// 3. Header Scroll State
// ===========================
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
}, { passive: true });

// ===========================
// 4. Contact Form Handling
// ===========================
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if Formspree ID is set
        const action = form.getAttribute('action');
        if (action.includes('YOUR_FORM_ID')) {
            formStatus.textContent = 'Form is not configured yet. Please set up a Formspree form ID.';
            formStatus.className = 'contact-form__status is-error';
            return;
        }

        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'contact-form__status';

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                formStatus.className = 'contact-form__status is-success';
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch {
            formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
            formStatus.className = 'contact-form__status is-error';
        } finally {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
        }
    });
}
