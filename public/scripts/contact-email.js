(() => {
    'use strict';
    const FORM_TIMEOUT_MILLIS = 5000;

    const CONTACT_FORM_ID = 'contact-form';
    const FORM_RESPONSE_ID = 'form-response';

    const NAME_INPUT_ID = 'name';
    const EMAIL_INPUT_ID = 'email';
    const MESSAGE_INPUT_ID = 'message';

    const DISABLE_TOGGLE_CLASS = 'disable-toggle';
    const WAS_VALIDATED_CLASS = 'was-validated';

    function disableForm() {
        const elements = document.getElementsByClassName(DISABLE_TOGGLE_CLASS);

        Array.from(elements).forEach((element) => {
            element.disabled = true;
        });
    }

    function enableForm() {
        const elements = document.getElementsByClassName(DISABLE_TOGGLE_CLASS);

        Array.from(elements).forEach((element) => {
            element.disabled = false;
        });
    }

    function clearFormResponse() {
        const formResponse = document.getElementById(FORM_RESPONSE_ID);
        formResponse.classList.remove(...formResponse.classList);
        formResponse.innerHTML = '';
    }

    function clearFormIfSuccess(success) {
        if (success) {
            document.getElementById(CONTACT_FORM_ID).reset();
            document.getElementById(CONTACT_FORM_ID).classList.remove(WAS_VALIDATED_CLASS);
        }
    }

    async function sendContactEmail() {
        const name = document.getElementById(NAME_INPUT_ID).value;
        const email = document.getElementById(EMAIL_INPUT_ID).value;
        const messageBody = document.getElementById(MESSAGE_INPUT_ID).value;

        const message = {
            subject: `Contact Form Submission from ${name} <${email}>`,
            body: messageBody
        };

        let success = false;

        await fetch('/mail', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(message)
        })
        .then((response) => {
            const formResponse = document.getElementById(FORM_RESPONSE_ID);

            if (response.ok) {
                success = true;
                formResponse.classList.add('text-success');
                formResponse.innerHTML = 'Message sent successfully. Thank you for contacting us!';
            } else {
                formResponse.classList.add('text-danger');
                formResponse.innerHTML = 'Error sending message. Please try again later.';
            }
        })
        .then(async () => {
            await new Promise((f) => setTimeout(f, FORM_TIMEOUT_MILLIS));
        })
        .then(() => {
            clearFormIfSuccess(success);
            clearFormResponse();
            enableForm();
        });
    }

    const form = document.getElementById(CONTACT_FORM_ID);
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            disableForm();
            sendContactEmail();
        }

        form.classList.add(WAS_VALIDATED_CLASS);
    }, false);
})();
