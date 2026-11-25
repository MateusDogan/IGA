// Hero: com mais de uma foto em .hero-slides, troca a cada 8 s com fade lento
// e atualiza a legenda (data-name / data-meta). Com uma foto, não faz nada.
// Clicar na foto vai para a próxima e reinicia a contagem de 8 s.
// Pausa com a aba escondida e, com "reduzir movimento", não troca sozinha
// (o clique continua funcionando, porque ele é ação da pessoa).
document.addEventListener('DOMContentLoaded', () => {
    const slides = [...document.querySelectorAll('.hero-slide')];
    const caption = document.querySelector('.hero-caption');
    if (slides.length < 2) return;

    const container = slides[0].parentElement;
    const nameEl = caption && caption.querySelector('.hero-caption-name');
    const metaEl = caption && caption.querySelector('.hero-caption-meta');
    const autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let timer = null;

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

    function restartTimer() {
        clearInterval(timer);
        if (!autoplay) return;
        timer = setInterval(() => {
            if (document.hidden) return;
            show((current + 1) % slides.length);
        }, 8000);
    }

    container.addEventListener('click', () => {
        show((current + 1) % slides.length);
        restartTimer();
    });

    restartTimer();
});
