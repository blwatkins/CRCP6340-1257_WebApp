/*
 * Copyright (C) 2025 brittni watkins.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
        const message = document.getElementById(MESSAGE_INPUT_ID).value;

        const requestBody = {
            subject: `CRCP6340-1257 - Contact Form Submission from ${name} <${email}>`,
            message: message
        };

        let success = false;

        const response = await fetch('/mail', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(requestBody)
        });
        const formResponse = document.getElementById(FORM_RESPONSE_ID);

        if (response.ok) {
            success = true;
            formResponse.classList.add('text-success');
            formResponse.innerHTML = 'Message sent successfully. Thank you for contacting us!';
        } else {
            formResponse.classList.add('text-danger');
            formResponse.innerHTML = 'Error sending message. Please try again later.';
        }

        await new Promise((resolve) => {
            setTimeout(resolve, FORM_TIMEOUT_MILLIS);
        });

        clearFormIfSuccess(success);
        clearFormResponse();
        enableForm();
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
