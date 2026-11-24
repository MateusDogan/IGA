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

        // linha de progresso: 0 no topo, 1 no fim da página
        const max = document.documentElement.scrollHeight - window.innerHeight;
        header.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);

        if (root.classList.contains('menu-open')) return; // menu aberto: a barra fica visível
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

    // Celular/tablet: botão "Menu" abre as seções em tela cheia.
    // Fecha com o mesmo botão, com Esc ou ao escolher uma seção.
    const toggle = header.querySelector('.menu-toggle');
    const nav = document.getElementById('header-navigation');
    if (toggle && nav) {
        const mobile = window.matchMedia('(max-width: 999px)');
        const setMenu = (open, moveFocus = true) => {
            root.classList.toggle('menu-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.textContent = open ? 'Fechar' : 'Menu';
            document.body.style.overflow = open ? 'hidden' : '';
            if (open) {
                root.classList.remove('nav-hidden');
                if (moveFocus) nav.querySelector('a').focus();
            } else if (moveFocus) {
                toggle.focus();
            }
        };
        toggle.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
        nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false, false); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false);
        });
        // voltou para o desktop com o menu aberto: fecha sem mexer no foco
        mobile.addEventListener('change', () => { if (!mobile.matches) setMenu(false, false); });
    }

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
