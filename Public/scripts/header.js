document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;
    const toggle = header.querySelector('.nav-toggle');
    const root = document.documentElement;
    const desktop = window.matchMedia('(min-width: 1000px)');

    function setMenu(open) {
        header.classList.toggle('menu-open', open);
        root.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    header.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    });
    desktop.addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    // Link ativo conforme a seção visível
    const links = [...header.querySelectorAll('.nav-link')];
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const t = document.querySelector(a.getAttribute('href')); if (t) spy.observe(t); });
    const scrollThreshold = 50; // Adjust this value (px) to control sensitivity

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const isScrollingDown = currentScroll > lastScrollTop;

                // Hide header immediately on scroll down (if past a small threshold)
                if (isScrollingDown && currentScroll > 10 && !header.classList.contains('menu-open')) { // 10px buffer to prevent accidental triggers
                    header.classList.add('header-hide');
                } 
                // Show header when scrolling up
                else {
                    header.classList.remove('header-hide');
                }

                // Toggle solid background after hero (100vh)
                if (currentScroll > window.innerHeight) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }

                lastScrollTop = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
});