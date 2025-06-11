document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', (event) => {
        let isValid = true;

        // Validate Name
        const nameField = form.querySelector('md-outlined-text-field[name="name"]');
        if (!nameField.value.trim()) {
            nameField.error = true;
            isValid = false;
        } else {
            nameField.error = false;
        }

        // Validate Email
        const emailField = form.querySelector('md-outlined-text-field[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
            emailField.error = true;
            isValid = false;
        } else {
            emailField.error = false;
        }

        // Validate Phone (optional, but pattern is set)
        const phoneField = form.querySelector('md-outlined-text-field[name="phone"]');
        // Material Design text fields automatically handle pattern validity.
        // We just need to check if a value exists and if it's invalid.
        if (phoneField.value.trim() && !phoneField.checkValidity()) {
            phoneField.error = true;
        } else {
            phoneField.error = false;
        }

        // Validate Message
        const messageField = form.querySelector('md-outlined-text-field[name="message"]');
        if (!messageField.value.trim()) {
            messageField.error = true;
            isValid = false;
        } else {
            messageField.error = false;
        }

        // There's no consent checkbox in the provided HTML.
        // If you intended to add one, you'll need to include its HTML first.
        // For now, I'm removing the consent checkbox validation logic as it's not present.

        if (!isValid) {
            event.preventDefault(); // Prevent form submission if validation fails
            
            // Scroll to the first invalid field
            const firstInvalidField = form.querySelector('[error="true"]');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        } else {
            alert('Formulário enviado com sucesso!'); // Or handle actual submission
            // event.currentTarget.submit(); // Uncomment to actually submit the form
        }
    });

    // Add event listeners for input changes to clear errors for text fields
    const textFields = form.querySelectorAll('md-outlined-text-field');
    textFields.forEach(field => {
        field.addEventListener('input', () => {
            // Check if the field is currently in an error state to clear it
            if (field.error) {
                field.error = false;
            }
        });
    });
});