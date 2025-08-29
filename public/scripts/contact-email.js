(() => {
    'use strict';
    const FORM_TIMEOUT_MILLIS = 5000;

    function disableForm() {
        const elements = document.getElementsByClassName('disable-toggle');

        Array.from(elements).forEach((element) => {
            element.disabled = true;
        });
    }

    function enableForm() {
        const elements = document.getElementsByClassName('disable-toggle');

        Array.from(elements).forEach((element) => {
            element.disabled = false;
        });
    }

    function clearFormResponse() {
        const formResponse = document.getElementById('form-response');
        formResponse.classList.remove(...formResponse.classList);
        formResponse.innerHTML = '';
    }

    async function sendContactEmail() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const messageBody = document.getElementById('message').value;

        const message = {
            subject: `Contact Form Submission from ${name} <${email}>`,
            body: messageBody
        };

        console.log(message);

        // TODO - handle response and display success or error message to user
        // TODO - clear form fields on success
        await fetch('/mail', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(message)
        })
        .then((response) => {
            console.log(response);
        })
        .then(async () => {
            await new Promise((f) => setTimeout(f, FORM_TIMEOUT_MILLIS));
        })
        .then(() => {
            clearFormResponse();
            enableForm();
        });
    }

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            disableForm();
            sendContactEmail();
        }

        form.classList.add('was-validated');
    }, false);
})();
