// Navbar: transparente sobre o hero. Depois dele, some ao rolar para baixo
// e volta (com fundo) ao rolar para cima.
document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('copy-year');
    if (year) year.textContent = new Date().getFullYear();

    // Link compartilhado com # (ex.: .../#Projects): abre direto na seção,
    // sem a rolagem suave, depois que as fontes e o layout assentam.
    if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) {
            window.addEventListener('load', () => {
                const html = document.documentElement;
                html.style.scrollBehavior = 'auto';
                target.scrollIntoView();
                html.style.scrollBehavior = '';
            }, { once: true });
        }
    }

    const root = document.documentElement;
    const hero = document.getElementById('Hero-Page');
    const header = document.getElementById('main-header');
    if (!hero || !header) return;

    const TOLERANCE = 8; // ignora micro-rolagens
    let lastY = window.scrollY;

    function update() {
        const y = window.scrollY;
        const pastHero = hero.getBoundingClientRect().bottom <= header.offsetHeight;
        root.classList.toggle('past-hero', pastHero);

        if (!pastHero) {
            root.classList.remove('nav-hidden');
            lastY = y;
        } else if (Math.abs(y - lastY) > TOLERANCE) {
            root.classList.toggle('nav-hidden', y > lastY);
            lastY = y;
        }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();

    // Teclado: se algo da navbar receber foco, ela reaparece
    header.addEventListener('focusin', () => root.classList.remove('nav-hidden'));

    // Seção atual: o link da navbar cuja seção cruza o meio da tela fica marcado.
    const links = [...document.querySelectorAll('#header-navigation .nav-link')];
    const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const link = links.find((a) => a.getAttribute('href') === '#' + entry.target.id);
            if (!link) return;
            if (entry.isIntersecting) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach((section) => observer.observe(section));
});
