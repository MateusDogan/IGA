// Equipe: em telas de toque (sem hover), tocar na foto abre a bio e tocar de
// novo fecha. Só uma fica aberta por vez. Enter/Espaço fazem o mesmo no teclado.
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('#photos-container .container-profile');
    const touch = window.matchMedia('(hover: none)');

    function toggle(card) {
        const open = !card.classList.contains('is-open');
        cards.forEach((c) => { c.classList.remove('is-open'); c.setAttribute('aria-expanded', 'false'); });
        card.classList.toggle('is-open', open);
        card.setAttribute('aria-expanded', String(open));
    }

    cards.forEach((card) => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        card.addEventListener('click', () => { if (touch.matches) toggle(card); });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(card); }
        });
    });
});
