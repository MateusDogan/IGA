// URL do Web App do Google Apps Script (ver docs/google-sheets-setup.md).
// Cole aqui a URL que termina em /exec depois de publicar o script.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVHNhsWGDC5REdyhxlnq84PlE4VuqJ0hFBjN3MWHZzfp6ETkkSS9xu99ItNC--dSl_mA/exec';
const CONTACT_EMAIL = 'iga@e-mail.com';

// Formulário de contato:
//   1. cada campo é conferido ao sair dele e de novo no envio (aria-invalid mostra o erro via CSS);
//   2. o botão mostra "Enviando…" e o script do Google confere tudo de novo, grava e devolve o protocolo;
//   3. a confirmação (protocolo, prazo e resumo) aparece no lugar dos campos; um erro aparece na linha do botão.
// As regras abaixo são as mesmas de docs/apps-script.gs. Mudou aqui, mude lá.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const done = document.getElementById('form-done');
    if (!form) return;

    const startedAt = Date.now(); // armadilha de tempo: o script recusa envio em menos de 3 s
    const submitButton = form.querySelector('.form-submit');
    const field = (name) => form.elements[name];

    // Linha de erro ao lado do botão (lida por leitores de tela)
    const status = document.getElementById('form-status');
    const setStatus = (msg) => { if (status) status.textContent = msg; };

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

    // ---------- Envio ----------
    // Frente do projeto (obrigatória; mais de uma pode ser marcada)
    const tipos = [...form.querySelectorAll('input[name="tipo"]')];
    const frentes = form.querySelector('.frentes');
    const tiposMarcados = () => tipos.filter((el) => el.checked).map((el) => el.value).join(', ');
    function checkTipo() {
        const ok = !frentes || tipos.some((el) => el.checked);
        if (frentes) frentes.setAttribute('aria-invalid', String(!ok));
        return ok;
    }
    tipos.forEach((el) => el.addEventListener('change', () => {
        if (frentes.getAttribute('aria-invalid') === 'true') checkTipo();
    }));

    // "Começar um projeto de…" (Serviços): marca a etiqueta do serviço; o link leva ao formulário
    document.querySelectorAll('.cta-link[data-tipo]').forEach((link) => {
        link.addEventListener('click', () => {
            const el = tipos.find((t) => t.value === link.dataset.tipo);
            if (el) el.checked = true;
            if (frentes && frentes.getAttribute('aria-invalid') === 'true') checkTipo();
        });
    });

    const values = () => ({
        tipo: tiposMarcados(),
        name: field('name').value.trim(),
        email: field('email').value.trim(),
        phone: phone.value.trim(),
        city: field('city').value.trim(),
        message: message.value.trim(),
    });
    // ---------- Rascunho salvo no navegador ----------
    // O que a pessoa digita fica só neste navegador (localStorage), nunca vai para o servidor
    // antes do envio. Volta se ela sair e voltar; some depois do envio ou em 30 dias.
    const DRAFT_KEY = 'iga-rascunho';
    const DRAFT_DAYS = 30;
    const DRAFT_FIELDS = ['name', 'email', 'phone', 'city', 'message'];
    function saveDraft() {
        const d = { t: Date.now(), tipo: tipos.filter((el) => el.checked).map((el) => el.value) };
        DRAFT_FIELDS.forEach((name) => { d[name] = field(name).value; });
        const empty = !d.tipo.length && DRAFT_FIELDS.every((name) => !d[name].trim());
        try {
            if (empty) localStorage.removeItem(DRAFT_KEY);
            else localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
        } catch { /* navegador sem armazenamento: segue sem rascunho */ }
    }
    function clearDraft() {
        try { localStorage.removeItem(DRAFT_KEY); } catch { /* idem */ }
    }
    function restoreDraft() {
        let d = null;
        try { d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { d = null; }
        if (!d || typeof d !== 'object') return;
        if (!d.t || Date.now() - d.t > DRAFT_DAYS * 864e5) { clearDraft(); return; }
        // não sobrescreve o que o navegador já preencheu sozinho
        if (DRAFT_FIELDS.some((name) => field(name).value)) return;
        DRAFT_FIELDS.forEach((name) => { if (typeof d[name] === 'string') field(name).value = d[name]; });
        if (Array.isArray(d.tipo)) tipos.forEach((el) => { el.checked = d.tipo.includes(el.value); });
        updateCounter();
        setStatus('Recuperamos o rascunho da sua mensagem.');
    }
    let draftTimer = 0;
    form.addEventListener('input', () => { clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 400); });
    form.addEventListener('change', saveDraft);
    restoreDraft();

    const label = submitButton.textContent;
    let sending = false;
    let correcting = ''; // protocolo da mensagem que está sendo editada

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (sending) return;
        const invalid = Object.keys(rules).filter((name) => !check(name));
        const tipoOk = checkTipo();
        if (invalid.length || !tipoOk) {
            (invalid.length ? field(invalid[0]) : tipos[0]).focus();
            setStatus('Confira os campos marcados.');
            return;
        }
        if (honeypot.value) return; // provável robô: ignora em silêncio
        if (!GOOGLE_SCRIPT_URL) { setStatus(ERRORS.config); return; }

        const v = values();
        sending = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando…';
        setStatus('');

        // Resposta do script: {ok, protocolo} ou {ok: false, erro, campos}.
        // O script antigo respondia só "ok"; continua aceito.
        let result;
        try {
            const data = new URLSearchParams({
                name: v.name, email: v.email, phone: digits(v.phone), city: v.city, message: v.message, tipo: v.tipo,
                website: honeypot.value, t: String(Date.now() - startedAt),
            });
            if (correcting) data.set('corrige', correcting); // o escritório vê que substitui a anterior
            const res = await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: data });
            const text = (await res.text()).trim();
            try { result = JSON.parse(text); } catch { result = { ok: text === 'ok' }; }
        } catch (err) {
            console.error(err);
            result = { ok: false, erro: 'rede' };
        }
        sending = false;
        submitButton.disabled = false;
        submitButton.textContent = correcting ? 'Enviar correção' : label;

        if (result.ok) { clearDraft(); showDone(v, result.protocolo); }
        else showError(result);
    });

    const ERRORS = {
        campos: 'Alguns campos não passaram na conferência. Corrija os campos marcados e envie de novo.',
        limite: `Recebemos várias mensagens deste e-mail na última hora. Aguarde um pouco ou escreva para ${CONTACT_EMAIL}.`,
        fechado: `O formulário está fechado no momento. Escreva para ${CONTACT_EMAIL}.`,
        ocupado: 'O envio demorou mais que o normal. Tente de novo em alguns segundos.',
        rede: 'Não foi possível enviar. Confira sua conexão e tente de novo.',
        config: `O envio ainda não está configurado. Escreva para ${CONTACT_EMAIL} enquanto isso.`,
    };

    function showError(result) {
        if (result.erro === 'campos' && Array.isArray(result.campos)) {
            result.campos.forEach((name) => {
                if (name === 'tipo') { if (frentes) frentes.setAttribute('aria-invalid', 'true'); }
                else if (field(name)) field(name).setAttribute('aria-invalid', 'true');
            });
            const first = form.querySelector('[aria-invalid="true"]');
            if (first) first.focus();
        }
        setStatus(ERRORS[result.erro] || ERRORS.rede);
    }

    // ---------- Confirmação no lugar dos campos ----------
    function showDone(v, protocolo) {
        if (!done) { form.reset(); setStatus('Mensagem enviada. Respondemos em até dois dias úteis.'); return; }
        done.querySelector('.form-done-text').textContent = protocolo
            ? `Seu protocolo é ${protocolo}. Respondemos em até dois dias úteis.`
            : 'Respondemos em até dois dias úteis.';
        const summary = done.querySelector('.form-done-summary');
        summary.replaceChildren();
        [['Tipo', v.tipo], ['Nome', v.name], ['E-mail', v.email], ['Celular', v.phone], ['Cidade', v.city], ['Mensagem', v.message]]
            .filter(([, value]) => value)
            .forEach(([term, value]) => {
                const dt = document.createElement('dt');
                const dd = document.createElement('dd');
                dt.textContent = term;
                dd.textContent = value;
                summary.append(dt, dd);
            });
        // Os campos ficam preenchidos (escondidos) para o "Editar mensagem"
        lastProtocol = protocolo || '';
        correcting = '';
        submitButton.textContent = label;
        form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
        form.hidden = true;
        done.hidden = false;
        done.querySelector('h3').focus(); // leitores de tela anunciam a confirmação
    }
    let lastProtocol = '';

    function backToForm() {
        done.hidden = true;
        form.hidden = false;
        updateCounter();
    }

    if (done) {
        // Editar: volta com tudo escrito; o reenvio vai como correção da mensagem anterior
        done.querySelector('.form-done-edit').addEventListener('click', () => {
            correcting = lastProtocol;
            submitButton.textContent = 'Enviar correção';
            backToForm();
            setStatus(lastProtocol
                ? `Editando a mensagem ${lastProtocol}. Ao enviar, ela chega ao escritório como correção.`
                : 'Editando a mensagem. Ao enviar, ela chega ao escritório como correção.');
            message.focus();
        });
        // Outra mensagem: formulário vazio
        done.querySelector('.form-done-again').addEventListener('click', () => {
            form.reset();
            clearDraft();
            correcting = '';
            submitButton.textContent = label;
            setStatus('');
            backToForm();
            field('name').focus();
        });
    }
});
