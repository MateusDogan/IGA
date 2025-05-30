const form = document.querySelector('form');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = [
        {
            id: 'name',
            label: 'Nome Completo',
            validator: nameIsValid
        },
        {
            id: 'email',
            label: 'E-mail',
            validator: emailIsValid
        },
        {
            id: 'phone',
            label: 'Celular',
            validator: phoneIsValid
        },
        {
            id: 'city',
            label: 'Cidade',
            validator: cityIsValid
        },
        {
            id: 'message',
            label: 'Sua Mensagem',
            validator: messageIsValid
        }
    ];

    const errorIcon = '<i class="fa-solid fa-circle-exclamation"></i>';
    let formIsValid = true;

    fields.forEach(function (field) {
        const input = document.getElementById(field.id);
        if (!input) {
            console.warn(`Input with ID '${field.id}' not found in the DOM.`);
            return;
        }

        const inputBox = input.closest('.input-box') || input.closest('.message-box');
        const inputValue = input.value.trim();

        let errorSpan = inputBox.querySelector('.error');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.classList.add('error');
            inputBox.appendChild(errorSpan);
        }

        errorSpan.innerHTML = '';
        inputBox.classList.remove('invalid');
        inputBox.classList.add('valid');

        const fieldValidator = field.validator(inputValue);

        if (!fieldValidator.isValid) {
            errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`;
            inputBox.classList.add('invalid');
            inputBox.classList.remove('valid');
            formIsValid = false;
        }
    });

    if (formIsValid) {
        alert('Formulário enviado com sucesso!');
        // form.submit(); // Uncomment to submit the form traditionally
    }
});

// --- Helper Functions ---

function isEmpty(value) {
    return value === '';
}

function nameIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O campo "Nome Completo" é obrigatório!';
        return validator;
    }

    const min = 3;
    if (value.length < min) {
        validator.isValid = false;
        validator.errorMessage = `O nome deve ter no mínimo ${min} caracteres!`;
        return validator;
    }

    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O campo deve conter apenas letras e espaços!';
    }

    return validator;
}

function emailIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O campo "E-mail" é obrigatório!';
        return validator;
    }

    const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
    if (!regex.test(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O e-mail precisa ser válido!';
        return validator;
    }

    return validator;
}

function phoneIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O campo "Telefone" é obrigatório!';
        return validator;
    }

    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!regex.test(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O número de telefone precisa estar no formato (xx) xxxxx-xxxx ou (xx) xxxx-xxxx!';
        return validator;
    }

    return validator;
}

function cityIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    // If the value is empty, it's considered valid because the field is now optional
    if (isEmpty(value)) {
        return validator;
    }

    const min = 2;
    if (value.length < min) {
        validator.isValid = false;
        validator.errorMessage = `A cidade deve ter no mínimo ${min} caracteres se preenchida!`;
        return validator;
    }

    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O campo deve conter apenas letras e espaços!';
    }

    return validator;
}

function messageIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'O campo "Sua Mensagem" é obrigatório!';
        return validator;
    }

    const min = 10;
    if (value.length < min) {
        validator.isValid = false;
        validator.errorMessage = `Sua mensagem deve ter no mínimo ${min} caracteres!`;
        return validator;
    }

    return validator;
}