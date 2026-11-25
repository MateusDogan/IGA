// Galeria dos projetos: clicar numa foto de "Projetos" abre a imagem em tela cheia,
// com o texto do projeto ao lado, setas (botões e teclado) para passar entre os projetos e Esc para fechar.
// Usa as fotos e legendas que já estão em #Projects; nada para configurar aqui.
document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('gallery');
    const triggers = [...document.querySelectorAll('.portfolio-open')];
    if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;

    const img = dialog.querySelector('.gallery-img');
    const title = dialog.querySelector('.gallery-title');
    const meta = dialog.querySelector('.gallery-meta');
    const text = dialog.querySelector('.gallery-text');
    const closeBtn = dialog.querySelector('.gallery-close');
    let current = 0;
    let opener = null;
    let openedByKeyboard = false;

    function show(index) {
        current = (index + triggers.length) % triggers.length;
        const item = triggers[current].closest('.portfolio-item');
        const photo = triggers[current].querySelector('img');
        const details = item.querySelector('.portfolio-details');
        img.src = photo.currentSrc || photo.src;
        img.alt = photo.alt;
        title.textContent = item.querySelector('figcaption h3').textContent;
        // carimbo da legenda (tipo, local, área, ano) e número da prancha
        const stamp = item.querySelector('figcaption dl');
        meta.replaceChildren(stamp ? stamp.cloneNode(true) : '');
        meta.dataset.sheet = String(current + 1).padStart(2, '0');
        text.innerHTML = details ? details.innerHTML : '';
    }

    triggers.forEach((trigger, i) => {
        trigger.addEventListener('click', (e) => {
            opener = trigger;
            openedByKeyboard = e.detail === 0; // Enter/Espaço geram clique sem contagem de cliques
            show(i);
            dialog.showModal();
            closeBtn.focus();
        });
    });

    dialog.querySelector('.gallery-prev').addEventListener('click', () => show(current - 1));
    dialog.querySelector('.gallery-next').addEventListener('click', () => show(current + 1));
    closeBtn.addEventListener('click', () => dialog.close());

    // clique no fundo escuro fecha
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });

    // Aberta pelo teclado: o foco volta para a foto que abriu a galeria (com a moldura de foco).
    // Aberta com o mouse: o foco sai da foto, para a moldura não ficar presa depois que o mouse sai.
    dialog.addEventListener('close', () => {
        if (!opener) return;
        opener.focus({ preventScroll: true });
        if (!openedByKeyboard) opener.blur();
    });
});
