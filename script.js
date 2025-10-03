// script.js
// Accessible, reduced-motion-friendly handlers

function openLinkInNewTab(url) {
    try {
        window.open(url, '_blank', 'noopener');
    } catch (e) {
        // fallback
        location.href = url;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = [
        { selector: '.fa-linkedin', url: 'https://www.linkedin.com/in/kavinilavan-a-342502324/' },
        { selector: '.fa-github', url: 'https://github.com/kevin11-afk/' },
        { selector: '.fa-instagram', url: 'https://www.instagram.com/kavineyy_18' }
    ];

    socialLinks.forEach(link => {
        const icon = document.querySelector(link.selector);
        if (icon && icon.parentElement && icon.parentElement.tagName === 'A') {
            icon.parentElement.addEventListener('click', function(e) {
                // allow normal behaviour for keyboard+assistive tech
                if (e instanceof MouseEvent) {
                    e.preventDefault();
                    openLinkInNewTab(link.url);
                }
            });
        }
    });

    // Reveal sections on scroll (simple and debounced)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = Array.from(document.querySelectorAll('section'));

    function revealSections() {
        const vh = window.innerHeight;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < vh - 80) section.classList.add('visible');
            else section.classList.remove('visible');
        });
    }

    // If user prefers reduced motion, avoid any parallax/animated background updates
    if (!prefersReducedMotion) {
        // Debounced scroll handler
        let timeout;
        window.addEventListener('scroll', function() {
            revealSections();
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(revealSections, 120);
        }, { passive: true });

        // gentle animated background movement (very small) without heavy transforms
        const animatedBg = document.getElementById('animated-bg');
        if (animatedBg) {
            let lastY = window.scrollY;
            let rafScheduled = false;
            function updateBg() {
                rafScheduled = false;
                const delta = window.scrollY - lastY;
                lastY = window.scrollY;
                // small, clamped translate to avoid jank
                const offset = Math.max(Math.min(window.scrollY * 0.02, 30), -30);
                animatedBg.style.transform = `translateY(${offset}px)`;
            }
            window.addEventListener('scroll', function() {
                if (!rafScheduled) {
                    rafScheduled = true;
                    requestAnimationFrame(updateBg);
                }
            }, { passive: true });
        }
    } else {
        // User prefers reduced motion: immediately reveal sections without animation
        sections.forEach(s => s.classList.add('visible'));
    }

    // Initial reveal
    revealSections();

    // Project modal behavior
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeBtn = modal && modal.querySelector('.modal-close');

    function openModal(title, desc, opener) {
        modal.setAttribute('aria-hidden','false');
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        // store opener to return focus
        modal._opener = opener;
        // move focus into modal
        closeBtn.focus();
    }

    function closeModal() {
        modal.setAttribute('aria-hidden','true');
        if (modal._opener) modal._opener.focus();
    }

    // click handlers for project buttons
    const projectBtns = Array.from(document.querySelectorAll('.project-btn'));
    projectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openModal(btn.dataset.title, btn.dataset.desc, btn);
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(btn.dataset.title, btn.dataset.desc, btn);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    // close on overlay click
    modal.addEventListener('click', function(e){ if (e.target === modal) closeModal(); });
    // escape to close
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

    // Skills interactive strip
    const skillBtns = Array.from(document.querySelectorAll('.skill-btn'));

    // Simple toggle: set aria-pressed and add an active class; also add title for native tooltip
    skillBtns.forEach(btn => {
        btn.setAttribute('role','button');
        btn.setAttribute('tabindex','0');
        btn.setAttribute('aria-pressed','false');
        // expose description as title attribute for quick hover tooltip
        if (btn.dataset && btn.dataset.desc) btn.setAttribute('title', btn.dataset.desc);

        function activate(){
            const active = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', active ? 'false' : 'true');
            btn.classList.toggle('active', !active);
        }

        btn.addEventListener('click', activate);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
        });
    });
});

