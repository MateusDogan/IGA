(function () {
    const cursor = document.getElementById('custom-cursor');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!cursor || !finePointer.matches) return; // touch: mantém o cursor nativo

    document.documentElement.classList.add('has-custom-cursor');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : 0.22; // suaviza o seguimento
    let targetX = 0, targetY = 0, x = 0, y = 0, running = false;

    const INTERACTIVE = 'a, button, md-filled-button, md-outlined-text-field, .clickable-object, .container-profile';

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
        if (!cursor.classList.contains('is-visible')) {
            x = targetX = e.clientX; // primeira posição: sem "voar" do canto
            y = targetY = e.clientY;
            cursor.classList.add('is-visible');
        }
        targetX = e.clientX;
        targetY = e.clientY;
        if (!running) { running = true; requestAnimationFrame(frame); }

        cursor.classList.toggle('is-enlarged', !!e.target.closest(INTERACTIVE));
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    document.documentElement.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
    document.addEventListener('mousedown', () => cursor.classList.add('is-clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-clicked'));
})();
