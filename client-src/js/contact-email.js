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

export class ContactForm {
    constructor() {
        this.FORM_TIMEOUT_MILLIS = 5000;
        this.CONTACT_FORM_ID = 'contact-form';
        this.FORM_RESPONSE_ID = 'form-response';
        this.NAME_INPUT_ID = 'name';
        this.EMAIL_INPUT_ID = 'email';
        this.SUBJECT_INPUT_ID = 'subject';
        this.MESSAGE_INPUT_ID = 'message';
        this.SUBMIT_INPUT_ID = 'submit';
        this.WAS_VALIDATED_CLASS = 'was-validated';
        this.INVALID_FEEDBACK_NAME_ID = 'invalid-feedback-name';
        this.INVALID_FEEDBACK_MESSAGE_ID = 'invalid-feedback-message';
        this.MAIL_API_ENDPOINT = '/mail';

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupForm());
        } else {
            this.setupForm();
        }
    }

    setupForm() {
        const form = document.getElementById(this.CONTACT_FORM_ID);

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (form.checkValidity() && this.checkCustomFormValidity()) {
                    this.disableForm();
                    await this.sendContactEmail();
                }

                form.classList.add(this.WAS_VALIDATED_CLASS);
            }, false);

            form.addEventListener('input', () => {
                form.classList.remove(this.WAS_VALIDATED_CLASS);
                form.checkValidity();
                this.checkCustomFormValidity();
                form.classList.add(this.WAS_VALIDATED_CLASS);
            });
        }
    }

    checkCustomFormValidity() {
        const nameInput = document.getElementById(this.NAME_INPUT_ID);
        const messageInput = document.getElementById(this.MESSAGE_INPUT_ID);
        const nameInvalidFeedback = document.getElementById(this.INVALID_FEEDBACK_NAME_ID);
        const messageInvalidFeedback = document.getElementById(this.INVALID_FEEDBACK_MESSAGE_ID);

        const nameTrimmed = nameInput.value.trim();
        const messageTrimmed = messageInput.value.trim();

        let isNameValid = nameTrimmed.length > 0;
        let isMessageValid = messageTrimmed.length > 0;

        if (nameInvalidFeedback) {
            nameInvalidFeedback.style.display = isNameValid ? 'none' : 'block';
        }

        if (messageInvalidFeedback) {
            messageInvalidFeedback.style.display = isMessageValid ? 'none' : 'block';
        }

        return isNameValid && isMessageValid;
    }

    disableForm() {
        const inputs = [
            this.NAME_INPUT_ID,
            this.EMAIL_INPUT_ID,
            this.SUBJECT_INPUT_ID,
            this.MESSAGE_INPUT_ID,
            this.SUBMIT_INPUT_ID
        ];

        inputs.forEach((id) => {
            const element = document.getElementById(id);
            if (element) element.disabled = true;
        });
    }

    enableForm() {
        const inputs = [
            this.NAME_INPUT_ID,
            this.EMAIL_INPUT_ID,
            this.SUBJECT_INPUT_ID,
            this.MESSAGE_INPUT_ID,
            this.SUBMIT_INPUT_ID
        ];

        inputs.forEach((id) => {
            const element = document.getElementById(id);
            if (element) element.disabled = false;
        });
    }

    displaySuccessMessage() {
        const formResponse = document.getElementById(this.FORM_RESPONSE_ID);

        if (formResponse) {
            formResponse.innerHTML = '<div class="alert alert-success" role="alert">Thank you for contacting me! I will get back to you soon.</div>';

            setTimeout(() => {
                formResponse.innerHTML = '';
            }, this.FORM_TIMEOUT_MILLIS);
        }
    }

    displayErrorMessage() {
        const formResponse = document.getElementById(this.FORM_RESPONSE_ID);

        if (formResponse) {
            formResponse.innerHTML = '<div class="alert alert-danger" role="alert">Sorry, there was an error sending your message. Please try again later.</div>';

            setTimeout(() => {
                formResponse.innerHTML = '';
            }, this.FORM_TIMEOUT_MILLIS);
        }
    }

    clearForm() {
        const inputs = [this.NAME_INPUT_ID, this.EMAIL_INPUT_ID, this.SUBJECT_INPUT_ID, this.MESSAGE_INPUT_ID];

        inputs.forEach((id) => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });

        const form = document.getElementById(this.CONTACT_FORM_ID);
        if (form) {
            form.classList.remove(this.WAS_VALIDATED_CLASS);
        }
    }

    async sendContactEmail() {
        const nameInput = document.getElementById(this.NAME_INPUT_ID);
        const emailInput = document.getElementById(this.EMAIL_INPUT_ID);
        const subjectInput = document.getElementById(this.SUBJECT_INPUT_ID);
        const messageInput = document.getElementById(this.MESSAGE_INPUT_ID);

        const requestBody = {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        };

        try {
            const response = await fetch(this.MAIL_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const responseBody = await response.json();

            if (response.ok && responseBody.success) {
                this.displaySuccessMessage();
                this.clearForm();
            } else {
                this.displayErrorMessage();
            }
        } catch (error) {
            console.error(error);
            this.displayErrorMessage();
        } finally {
            this.enableForm();
        }
    }
}
