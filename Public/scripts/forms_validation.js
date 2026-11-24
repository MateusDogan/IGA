// URL do Web App do Google Apps Script (ver docs/google-sheets-setup.md).
// Cole aqui a URL que termina em /exec depois de publicar o script.
const GOOGLE_SCRIPT_URL = '';

// Formulário com campos nativos. Cada regra marca o campo com aria-invalid,
// o que mostra a mensagem de erro dele (.field-error) via CSS.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    if (!form) return;

    const submitButton = form.querySelector('.form-submit');
    const status = document.createElement('p');
    status.id = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    submitButton.closest('.submit-button').appendChild(status);

    // Campo isca anti-spam: humanos não veem, robôs preenchem.
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0;height:0;width:0;';
    form.appendChild(honeypot);

    const field = (name) => form.elements[name];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const rules = {
        name: (v) => v.trim().length > 0,
        email: (v) => emailRegex.test(v.trim()),
        phone: (v) => { const d = v.replace(/\D/g, ''); return d.length === 0 || d.length === 10 || d.length === 11; },
        message: (v) => v.trim().length > 0,
    };

    function check(name) {
        const el = field(name);
        const ok = rules[name](el.value);
        el.setAttribute('aria-invalid', String(!ok));
        return ok;
    }

    const setStatus = (msg, type) => {
        status.textContent = msg;
        status.dataset.type = type || '';
    };

    // Ao sair de um campo já preenchido, confere; ao digitar, limpa o erro.
    Object.keys(rules).forEach((name) => {
        const el = field(name);
        el.addEventListener('blur', () => { if (el.value) check(name); });
        el.addEventListener('input', () => {
            if (el.getAttribute('aria-invalid') === 'true') check(name);
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const invalid = Object.keys(rules).filter((name) => !check(name));
        if (invalid.length) {
            field(invalid[0]).focus();
            setStatus('Confira os campos marcados.', 'error');
            return;
        }

        if (honeypot.value) return; // provável robô: ignora em silêncio

        if (!GOOGLE_SCRIPT_URL) {
            setStatus('O envio ainda não está configurado. Escreva para iga@e-mail.com enquanto isso.', 'error');
            console.error('GOOGLE_SCRIPT_URL vazio em forms_validation.js');
            return;
        }

        const data = new URLSearchParams({
            name: field('name').value.trim(),
            email: field('email').value.trim(),
            phone: field('phone').value.replace(/\D/g, ''),
            city: field('city').value.trim(),
            message: field('message').value.trim(),
        });

        const label = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando…';
        setStatus('', '');

        try {
            // no-cors: o Apps Script não envia cabeçalhos CORS; a resposta é opaca,
            // mas a requisição chega e a linha é gravada na planilha.
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: data });
            setStatus('Mensagem enviada. Respondemos em até dois dias úteis.', 'success');
            form.reset();
            form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
        } catch (err) {
            console.error(err);
            setStatus('Não foi possível enviar. Confira sua conexão e tente de novo.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = label;
        }
    });
});
