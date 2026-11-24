// URL do Web App do Google Apps Script (ver docs/google-sheets-setup.md).
// Cole aqui a URL que termina em /exec depois de publicar o script.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVHNhsWGDC5REdyhxlnq84PlE4VuqJ0hFBjN3MWHZzfp6ETkkSS9xu99ItNC--dSl_mA/exec';
const CONTACT_EMAIL = 'iga@e-mail.com';

// Formulário de contato:
//   1. cada campo é conferido ao sair dele e de novo no envio (aria-invalid mostra o erro via CSS);
//   2. o envio abre "Confira antes de enviar" com o resumo;
//   3. o script do Google confere tudo de novo, grava e devolve o protocolo, mostrado no pop-up.
// As regras abaixo são as mesmas de docs/apps-script.gs. Mudou aqui, mude lá.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const dialog = document.getElementById('form-dialog');
    if (!form) return;

    const startedAt = Date.now(); // armadilha de tempo: o script recusa envio em menos de 3 s
    const submitButton = form.querySelector('.form-submit');
    const field = (name) => form.elements[name];

    // Mensagem para leitores de tela (erros de validação)
    const status = document.createElement('p');
    status.id = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    submitButton.closest('.submit-button').appendChild(status);
    const setStatus = (msg) => { status.textContent = msg; };

    // Campo isca anti-spam: humanos não veem, robôs preenchem.
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0;height:0;width:0;';
    form.appendChild(honeypot);

    // ---------- Regras ----------
    const MESSAGE_MIN = 20;
    const MESSAGE_MAX = 3000;
    const DDDS = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
        71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99]);
    const hasLink = (v) => /https?:\/\/|www\./i.test(v);
    const digits = (v) => v.replace(/\D/g, '');

    // DDD que existe; celular com 9 dígitos começando com 9, fixo com 8 começando de 2 a 5;
    // recusa número com todos os dígitos iguais ou em sequência
    function phoneOk(n) {
        if (n.length !== 10 && n.length !== 11) return false;
        if (!DDDS.has(Number(n.slice(0, 2)))) return false;
        const number = n.slice(2);
        if (number.length === 9 && number[0] !== '9') return false;
        if (number.length === 8 && !/[2-5]/.test(number[0])) return false;
        const rest = number.slice(1);
        if (/^(\d)\1+$/.test(rest)) return false;
        if ('0123456789'.includes(rest) || '9876543210'.includes(rest)) return false;
        return true;
    }

    const rules = {
        name: (v) => { v = v.trim(); return v.length <= 100 && /\p{L}.*\p{L}/u.test(v) && !hasLink(v); },
        email: (v) => { v = v.trim(); return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
        phone: (v) => { const d = digits(v); return d.length === 0 || phoneOk(d); },
        city: (v) => v.trim().length <= 100,
        message: (v) => {
            v = v.trim();
            const links = (v.match(/https?:\/\/|www\./gi) || []).length;
            return v.length >= MESSAGE_MIN && v.length <= MESSAGE_MAX && links <= 3;
        },
    };

    function check(name) {
        const el = field(name);
        const ok = rules[name](el.value);
        el.setAttribute('aria-invalid', String(!ok));
        return ok;
    }
    const markInvalid = (names) => names.forEach((name) => field(name) && field(name).setAttribute('aria-invalid', 'true'));

    // Ao sair de um campo já preenchido, confere; ao digitar, limpa o erro.
    Object.keys(rules).forEach((name) => {
        const el = field(name);
        if (!el) return;
        el.addEventListener('blur', () => { if (el.value) check(name); });
        el.addEventListener('input', () => {
            if (el.getAttribute('aria-invalid') === 'true') check(name);
        });
    });

    // ---------- Máscara do celular: (12) 99123-4567 ou (12) 3456-7890 ----------
    const phone = field('phone');
    function formatPhone(d) {
        d = d.slice(0, 11);
        if (d.length <= 2) return d.length ? `(${d}` : '';
        const ddd = d.slice(0, 2);
        const rest = d.slice(2);
        const split = rest.length > 8 ? 5 : 4; // celular: 5 + 4; fixo: 4 + 4
        if (rest.length <= split) return `(${ddd}) ${rest}`;
        return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
    }
    phone.addEventListener('input', (e) => {
        if (e.inputType && e.inputType.startsWith('delete')) return; // apagar não reformata (não "prende" no hífen)
        phone.value = formatPhone(digits(phone.value));
    });
    phone.addEventListener('blur', () => { phone.value = formatPhone(digits(phone.value)); });

    // ---------- Contador da mensagem ----------
    const message = field('message');
    message.maxLength = MESSAGE_MAX;
    const counter = document.getElementById('message-count');
    function updateCounter() {
        if (!counter) return;
        const n = message.value.trim().length;
        if (n === 0) counter.textContent = `Mínimo de ${MESSAGE_MIN} caracteres`;
        else if (n < MESSAGE_MIN) counter.textContent = `Faltam ${MESSAGE_MIN - n} caracteres`;
        else counter.textContent = `${n} / ${MESSAGE_MAX}`;
    }
    message.addEventListener('input', updateCounter);
    updateCounter();

    // ---------- Pop-up: confirmar e resultado ----------
    const canDialog = dialog && typeof dialog.showModal === 'function';
    const ui = canDialog && {
        title: dialog.querySelector('.form-dialog-title'),
        body: dialog.querySelector('.form-dialog-body'),
        primary: dialog.querySelector('.form-dialog-primary'),
        secondary: dialog.querySelector('.form-dialog-secondary'),
    };
    let onPrimary = null;
    let sending = false;

    // Monta o pop-up: título, conteúdo (nós DOM, nunca HTML vindo do usuário) e botões
    function openDialog({ title, body, primary, secondary, action }) {
        ui.title.textContent = title;
        ui.body.replaceChildren(...body);
        ui.primary.textContent = primary;
        ui.primary.disabled = false;
        ui.secondary.hidden = !secondary;
        ui.secondary.textContent = secondary || '';
        onPrimary = action;
        if (!dialog.open) dialog.showModal();
        ui.primary.focus();
    }
    const para = (text) => { const p = document.createElement('p'); p.textContent = text; return p; };

    function summary(values) {
        const dl = document.createElement('dl');
        dl.className = 'form-dialog-summary';
        [['Nome', values.name], ['E-mail', values.email], ['Celular', values.phone], ['Cidade', values.city], ['Mensagem', values.message]]
            .filter(([, v]) => v)
            .forEach(([label, v]) => {
                const dt = document.createElement('dt');
                const dd = document.createElement('dd');
                dt.textContent = label;
                dd.textContent = v;
                dl.append(dt, dd);
            });
        return dl;
    }

    if (canDialog) {
        ui.primary.addEventListener('click', () => { if (onPrimary) onPrimary(); });
        ui.secondary.addEventListener('click', () => dialog.close());
        // Esc ou clique no fundo fecham, menos durante o envio
        dialog.addEventListener('cancel', (e) => { if (sending) e.preventDefault(); });
        dialog.addEventListener('click', (e) => { if (e.target === dialog && !sending) dialog.close(); });
        dialog.addEventListener('close', () => {
            const invalid = form.querySelector('[aria-invalid="true"]');
            (invalid || submitButton).focus();
        });
    }

    // ---------- Envio ----------
    const values = () => ({
        name: field('name').value.trim(),
        email: field('email').value.trim(),
        phone: phone.value.trim(),
        city: field('city').value.trim(),
        message: message.value.trim(),
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const invalid = Object.keys(rules).filter((name) => !check(name));
        if (invalid.length) {
            field(invalid[0]).focus();
            setStatus('Confira os campos marcados.');
            return;
        }
        setStatus('');
        if (honeypot.value) return; // provável robô: ignora em silêncio

        const v = values();
        if (!canDialog) { send(v); return; } // navegador antigo: envia direto
        openDialog({
            title: 'Confira antes de enviar',
            body: [summary(v)],
            primary: 'Enviar mensagem',
            secondary: 'Corrigir',
            action: () => send(v),
        });
    });

    // Resposta do script: {ok, protocolo} ou {ok: false, erro, campos}.
    // O script antigo respondia só "ok"; continua aceito.
    async function send(v) {
        if (!GOOGLE_SCRIPT_URL) { showResult({ ok: false, erro: 'config' }); return; }
        sending = true;
        submitButton.disabled = true;
        if (canDialog) { ui.primary.disabled = true; ui.primary.textContent = 'Enviando…'; ui.secondary.hidden = true; }

        const data = new URLSearchParams({
            name: v.name, email: v.email, phone: digits(v.phone), city: v.city, message: v.message,
            website: honeypot.value, t: String(Date.now() - startedAt),
        });
        let result;
        try {
            const res = await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: data });
            const text = (await res.text()).trim();
            try { result = JSON.parse(text); } catch { result = { ok: text === 'ok', erro: 'resposta' }; }
        } catch (err) {
            console.error(err);
            result = { ok: false, erro: 'rede' };
        }
        sending = false;
        submitButton.disabled = false;
        showResult(result);
    }

    const ERRORS = {
        campos: 'Alguns campos não passaram na conferência. Corrija os campos marcados e envie de novo.',
        limite: `Recebemos várias mensagens deste e-mail na última hora. Aguarde um pouco ou escreva para ${CONTACT_EMAIL}.`,
        fechado: `O formulário está fechado no momento. Escreva para ${CONTACT_EMAIL}.`,
        ocupado: 'O envio demorou mais que o normal. Tente de novo em alguns segundos.',
        rede: 'Não foi possível enviar. Confira sua conexão e tente de novo.',
        config: `O envio ainda não está configurado. Escreva para ${CONTACT_EMAIL} enquanto isso.`,
    };

    function showResult(result) {
        if (result.ok) {
            form.reset();
            form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
            updateCounter();
            const done = result.protocolo
                ? `Seu protocolo é ${result.protocolo}. Respondemos em até dois dias úteis.`
                : 'Respondemos em até dois dias úteis.';
            if (!canDialog) { setStatus(`Mensagem enviada. ${done}`); return; }
            openDialog({ title: 'Mensagem enviada', body: [para(done)], primary: 'Fechar', action: () => dialog.close() });
            return;
        }
        if (result.erro === 'campos' && Array.isArray(result.campos)) markInvalid(result.campos);
        const text = ERRORS[result.erro] || ERRORS.rede;
        if (!canDialog) { setStatus(text); return; }
        const retry = result.erro === 'rede' || result.erro === 'ocupado';
        openDialog({
            title: 'Não foi possível enviar',
            body: [para(text)],
            primary: retry ? 'Tentar de novo' : 'Voltar ao formulário',
            secondary: retry ? 'Voltar' : '',
            action: retry ? () => send(values()) : () => dialog.close(),
        });
    }
});
