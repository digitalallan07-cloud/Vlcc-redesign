// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHeroAnimations();
    }, 1800);
});
document.body.style.overflow = 'hidden';

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });
}

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }
});

// ===== Back to Top =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Hero Slider =====
const heroSlides = document.querySelectorAll('.hero-slide');
let heroIndex = 0;

function nextHeroSlide() {
    heroSlides[heroIndex].classList.remove('active');
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.add('active');
}

if (heroSlides.length > 1) {
    setInterval(nextHeroSlide, 6000);
}

// ===== Hero Animations on Load =====
function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero [data-animate]');
    heroElements.forEach((el) => {
        const delay = parseInt(el.getAttribute('data-delay') || '0');
        setTimeout(() => {
            el.classList.add('animated');
        }, delay);
    });
}

// ===== Scroll Animations =====
const animateElements = document.querySelectorAll('[data-animate]:not(.hero [data-animate])');

const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-delay') || '0');
            setTimeout(() => {
                el.classList.add('animated');
            }, delay);
            animateObserver.unobserve(el);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

animateElements.forEach(el => animateObserver.observe(el));

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            counter.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    const heroStatsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroStatsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    heroStatsObserver.observe(heroStats);
}

// ===== Testimonial Slider =====
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slides = track ? track.children.length : 0;
let current = 0;
let autoSlideInterval;

for (let i = 0; i < slides; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
}

function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        goTo((current - 1 + slides) % slides);
        resetAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
        goTo((current + 1) % slides);
        resetAutoSlide();
    });
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        if (slides > 0) goTo((current + 1) % slides);
    }, 5000);
}

startAutoSlide();

// Touch/swipe support for testimonials
if (track) {
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo((current + 1) % slides);
            else goTo((current - 1 + slides) % slides);
            resetAutoSlide();
        }
        isDragging = false;
    }, { passive: true });
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            const wrap = contactForm.parentElement;
            wrap.innerHTML = `
                <div class="form-success">
                    <h3>Thank You!</h3>
                    <p>Your consultation request has been received. Our team will contact you within 24 hours.</p>
                </div>
            `;
        }, 1500);
    });
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Parallax effect on CTA background =====
const ctaBg = document.querySelector('.cta-bg');
if (ctaBg) {
    window.addEventListener('scroll', () => {
        const rect = ctaBg.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const speed = 0.3;
            const yPos = -(rect.top * speed);
            ctaBg.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// ===== Active nav link highlight =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link && !link.classList.contains('btn')) {
            if (scrollY >= top && scrollY < top + height) {
                link.style.color = '';
                link.classList.add('nav-active');
            } else {
                link.classList.remove('nav-active');
            }
        }
    });
});
