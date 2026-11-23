// URL do Web App do Google Apps Script (ver docs/google-sheets-setup.md).
// Cole aqui a URL que termina em /exec depois de publicar o script.
const GOOGLE_SCRIPT_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    if (!form) return;

    const submitButton = form.querySelector('md-filled-button');
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

    const field = (name) => form.querySelector(`md-outlined-text-field[name="${name}"]`);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setStatus = (msg, type) => {
        status.textContent = msg;
        status.dataset.type = type || '';
    };

    function validate() {
        const name = field('name');
        const email = field('email');
        const phone = field('phone');
        const message = field('message');

        name.error = !name.value.trim();
        email.error = !emailRegex.test(email.value.trim());
        const digits = phone.value.replace(/\D/g, '');
        phone.error = digits.length > 0 && (digits.length < 10 || digits.length > 11);
        message.error = !message.value.trim();

        return ![name, email, phone, message].some((f) => f.error);
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validate()) {
            const firstInvalid = form.querySelector('md-outlined-text-field[error]');
            if (firstInvalid) firstInvalid.focus();
            setStatus('Por favor, preencha os campos obrigatórios corretamente.', 'error');
            return;
        }

        if (honeypot.value) return; // provável robô: ignora em silêncio

        if (!GOOGLE_SCRIPT_URL) {
            setStatus('Formulário ainda não configurado. Tente novamente mais tarde.', 'error');
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

        submitButton.disabled = true;
        setStatus('Enviando...', 'info');

        try {
            // no-cors: o Apps Script não envia cabeçalhos CORS; a resposta é opaca,
            // mas a requisição chega e a linha é gravada na planilha.
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: data });
            setStatus('Mensagem enviada! Entraremos em contato em breve.', 'success');
            form.querySelectorAll('md-outlined-text-field').forEach((f) => { f.value = ''; });
        } catch (err) {
            console.error(err);
            setStatus('Não foi possível enviar. Verifique sua conexão e tente novamente.', 'error');
        } finally {
            submitButton.disabled = false;
        }
    });

    form.querySelectorAll('md-outlined-text-field').forEach((f) => {
        f.addEventListener('input', () => { if (f.error) f.error = false; });
    });
});
