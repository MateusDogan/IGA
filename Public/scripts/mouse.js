// Cursor do site: anel simples que segue o mouse com suavidade.
//   links e botões     -> o anel cresce
//   links do menu e do rodapé -> o anel desliza para baixo da palavra e vira o sublinhado dela
//   "Explore o espaço" -> o anel assume a forma do ícone do mouse do botão
//   fotos de Projetos  -> aparece um "+" dentro do anel (a foto amplia na galeria)
//   pop-up aberto      -> o anel entra no <dialog> (camada superior, cobriria o anel) e continua funcionando
// Só em dispositivos com mouse; com "reduzir movimento" o anel acompanha sem atraso.
(function () {
    const cursor = document.getElementById('custom-cursor');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!cursor || !finePointer.matches) return; // touch: mantém o cursor nativo

    document.documentElement.classList.add('has-custom-cursor');

    const arrow = document.createElement('span');
    arrow.className = 'cursor-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '+'; // ampliar
    cursor.appendChild(arrow);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : 0.22; // suaviza o seguimento
    let targetX = 0, targetY = 0, x = 0, y = 0, running = false;
    let snap = true; // próxima posição lida sem deslizar (primeira vez ou volta à janela)

    const INTERACTIVE = 'a, button, .clickable-object';
    const TEXT = 'input, textarea';
    const MENU_LINK = '#main-header .nav-link, #footer .footer-col a';
    const FOOTER_LINK = '#footer .footer-col a';
    const EXPLORE = '#Explore';
    const PHOTO = '.portfolio-open';
    // partes verdes do contato: o painel (formulário + rodapé) e a coluna embaixo dos ícones
    const OLIVE = '#connect-container, #social-container-fill, #social-container-inv';

    function frame() {
        x += (targetX - x) * ease;
        y += (targetY - y) * ease;
        cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
            requestAnimationFrame(frame);
        } else {
            running = false;
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (snap) {
            x = targetX = e.clientX; // primeira posição: sem "voar" do canto
            y = targetY = e.clientY;
            snap = false;
        }
        cursor.classList.add('is-visible');

        // galeria e pop-up do formulário ficam na camada superior: o anel vai junto
        const layer = e.target.closest('dialog[open]') || document.body;
        if (cursor.parentNode !== layer) layer.appendChild(cursor);

        const menuLink = e.target.closest(MENU_LINK);
        const footerLink = !!menuLink && menuLink.matches(FOOTER_LINK);
        const explore = !menuLink && e.target.closest(EXPLORE);
        const photo = !menuLink && !explore && e.target.closest(PHOTO);

        if (menuLink) {
            // vira o sublinhado: mesma largura da palavra, logo abaixo dela
            // (no rodapé o link já tem respiro embaixo, então a linha sobe um pouco)
            const r = menuLink.getBoundingClientRect();
            targetX = r.left + r.width / 2;
            targetY = footerLink ? r.bottom - 2 : r.bottom + 5;
            cursor.style.width = r.width + 'px';
            cursor.style.height = '';
        } else if (explore) {
            // vira o botão: o anel envolve o ícone do mouse, com a mesma forma
            const icon = explore.querySelector('.scroll-mouse') || explore;
            const r = icon.getBoundingClientRect();
            targetX = r.left + r.width / 2;
            targetY = r.top + r.height / 2;
            cursor.style.width = (r.width + 12) + 'px';
            cursor.style.height = (r.height + 12) + 'px';
        } else {
            targetX = e.clientX;
            targetY = e.clientY;
            cursor.style.width = '';
            cursor.style.height = '';
        }
        cursor.classList.toggle('is-underline', !!menuLink);
        cursor.classList.toggle('is-footer', footerLink);
        cursor.classList.toggle('is-explore', !!explore);
        cursor.classList.toggle('is-photo', !!photo);
        // a aba creme dos ícones fica dentro da coluna verde: ali o anel volta ao normal
        cursor.classList.toggle('is-olive', !!e.target.closest(OLIVE) && !e.target.closest('#social-links'));
        const onText = !!e.target.closest(TEXT);
        cursor.classList.toggle('is-text', onText);
        cursor.classList.toggle('is-enlarged', !menuLink && !explore && !photo && !onText && !!e.target.closest(INTERACTIVE));

        if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });

    // saiu da janela: some e solta o clique; ao voltar, a posição é lida sem deslizar desde a saída
    document.documentElement.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-visible', 'is-clicked');
        snap = true;
    });
    document.documentElement.addEventListener('mouseenter', () => { snap = true; });
    document.addEventListener('mousedown', () => cursor.classList.add('is-clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-clicked'));
    window.addEventListener('blur', () => cursor.classList.remove('is-clicked'));
})();
