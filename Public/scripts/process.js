// "Do traço à entrega": abas por frente (Arquitetura, Interiores, Design gráfico).
// Clique ou setas esquerda/direita trocam a lista de etapas visível.
document.addEventListener('DOMContentLoaded', () => {
    const tabs = [...document.querySelectorAll('.process-tabs [role="tab"]')];
    if (!tabs.length) return;

    function select(tab, focus) {
        tabs.forEach((t) => {
            const on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-active', on);
        });
        if (focus) tab.focus();
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', (e) => {
            const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
            if (step) select(tabs[(i + step + tabs.length) % tabs.length], true);
        });
    });
});
