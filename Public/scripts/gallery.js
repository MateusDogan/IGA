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

    function show(index) {
        current = (index + triggers.length) % triggers.length;
        const item = triggers[current].closest('.portfolio-item');
        const photo = triggers[current].querySelector('img');
        const details = item.querySelector('.portfolio-details');
        img.src = photo.currentSrc || photo.src;
        img.alt = photo.alt;
        title.textContent = item.querySelector('figcaption h3').textContent;
        meta.textContent = item.querySelector('figcaption span').textContent;
        text.innerHTML = details ? details.innerHTML : '';
    }

    triggers.forEach((trigger, i) => {
        trigger.addEventListener('click', () => {
            opener = trigger;
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

    // devolve o foco para a foto que abriu a galeria
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
});
