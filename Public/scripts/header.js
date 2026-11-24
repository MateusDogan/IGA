document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const hero = document.getElementById('Hero-Page');
    const menuBtn = document.querySelector('.rail-menu');
    const panel = document.getElementById('side-panel');
    const backdrop = document.getElementById('side-backdrop');
    const closeBtn = panel.querySelector('.panel-close');
    const photo = panel.querySelector('.panel-photo');
    const label = document.getElementById('rail-label');
    const panelLinks = [...panel.querySelectorAll('nav a')];

    // Depois do hero: some o menu do topo e entra o trilho
    new IntersectionObserver(([e]) => {
        root.classList.toggle('past-hero', !e.isIntersecting);
    }, { threshold: 0.15 }).observe(hero);

    function render(open) {
        root.classList.toggle('menu-open', open);
        backdrop.hidden = !open;
        menuBtn.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
    }
    function openMenu() { render(true); closeBtn.focus(); }
    function closeMenu(returnFocus) {
        render(false);
        if (returnFocus) menuBtn.focus({ preventScroll: true });
    }

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', () => closeMenu(true));
    backdrop.addEventListener('click', () => closeMenu(true));
    panelLinks.forEach(a => a.addEventListener('click', () => closeMenu(false)));

    document.addEventListener('keydown', (e) => {
        if (!root.classList.contains('menu-open')) return;
        if (e.key === 'Escape') { closeMenu(true); return; }
        if (e.key === 'Tab') { // prende o foco dentro do painel
            const f = [...panel.querySelectorAll('a, button')];
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // Foto do painel muda conforme o link em foco/hover
    panelLinks.forEach(a => {
        const swap = () => { photo.src = a.dataset.img; };
        a.addEventListener('mouseenter', swap);
        a.addEventListener('focus', swap);
    });

    // Seção atual no trilho e no painel
    const names = { 'Hero-Page': 'Início' };
    panelLinks.forEach(a => { names[a.getAttribute('href').slice(1)] = a.textContent; });
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            label.textContent = names[en.target.id] || '';
            panelLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(names).forEach(id => { const t = document.getElementById(id); if (t) spy.observe(t); });
});
