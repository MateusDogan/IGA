// Revelação ao rolar: itens com a classe .reveal aparecem suavemente, uma única vez,
// quando entram na tela. Sem JS, ou com "reduzir movimento", ficam sempre visíveis.
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.reveal');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!items.length || reduce || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' }); // threshold 0: itens altos também aparecem em telas baixas

    items.forEach((el) => observer.observe(el));
});
