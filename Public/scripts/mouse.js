// Cursor do site: anel simples que segue o mouse com suavidade.
//   links e botões     -> o anel cresce
//   links do menu      -> o anel desliza para baixo da palavra e vira o sublinhado dela
//   fotos de Projetos  -> aparece uma seta dentro do anel (a foto abre a galeria)
// Só em dispositivos com mouse; com "reduzir movimento" o anel acompanha sem atraso.
(function () {
    const cursor = document.getElementById('custom-cursor');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!cursor || !finePointer.matches) return; // touch: mantém o cursor nativo

    document.documentElement.classList.add('has-custom-cursor');

    const arrow = document.createElement('span');
    arrow.className = 'cursor-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗'; // ↗
    cursor.appendChild(arrow);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : 0.22; // suaviza o seguimento
    let targetX = 0, targetY = 0, x = 0, y = 0, running = false;
    let snap = true; // próxima posição lida sem deslizar (primeira vez ou volta à janela)

    const INTERACTIVE = 'a, button, .clickable-object';
    const TEXT = 'input, textarea';
    const MENU_LINK = '#main-header .nav-link';
    const PHOTO = '.portfolio-open';

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

        const menuLink = e.target.closest(MENU_LINK);
        const photo = !menuLink && e.target.closest(PHOTO);

        if (menuLink) {
            // vira o sublinhado: mesma largura da palavra, logo abaixo dela
            const r = menuLink.getBoundingClientRect();
            targetX = r.left + r.width / 2;
            targetY = r.bottom + 5;
            cursor.style.width = r.width + 'px';
        } else {
            targetX = e.clientX;
            targetY = e.clientY;
            cursor.style.width = '';
        }
        cursor.classList.toggle('is-underline', !!menuLink);
        cursor.classList.toggle('is-photo', !!photo);
        const onText = !!e.target.closest(TEXT);
        cursor.classList.toggle('is-text', onText);
        cursor.classList.toggle('is-enlarged', !menuLink && !photo && !onText && !!e.target.closest(INTERACTIVE));

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
