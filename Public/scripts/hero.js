// Hero: com mais de uma foto em .hero-slides, troca a cada 6 s com fade lento
// e atualiza a legenda (data-name / data-meta). Com uma foto, não faz nada.
// Pausa com a aba escondida e respeita "reduzir movimento".
document.addEventListener('DOMContentLoaded', () => {
    const slides = [...document.querySelectorAll('.hero-slide')];
    const caption = document.querySelector('.hero-caption');
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nameEl = caption && caption.querySelector('.hero-caption-name');
    const metaEl = caption && caption.querySelector('.hero-caption-meta');
    let current = 0;

    function show(next) {
        slides[next].loading = 'eager';
        slides[current].classList.remove('is-active');
        slides[next].classList.add('is-active');
        current = next;
        if (!caption) return;
        caption.classList.add('is-changing');
        setTimeout(() => {
            nameEl.textContent = slides[next].dataset.name || '';
            metaEl.textContent = slides[next].dataset.meta || '';
            caption.classList.remove('is-changing');
        }, 600);
    }

    setInterval(() => {
        if (document.hidden) return;
        show((current + 1) % slides.length);
    }, 6000);
});
