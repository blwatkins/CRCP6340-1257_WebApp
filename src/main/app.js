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

const express = require('express');

const { isValidString, sanitizeString, sendEmail } = require('./utils/utils.js');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/mail', async (request, response) => {
    console.debug('Mail request received.');

    if (request.body) {
        const requestSubject = request.body.subject;
        const requestMessage = request.body.message;
        let subject;
        let message;

        if (isValidString(requestSubject)) {
            subject = sanitizeString(requestSubject);
        }

        if (isValidString(requestMessage)) {
            message = sanitizeString(requestMessage);
        }

        if (subject && message) {
            await sendEmail(subject, message)
                .then(() => {
                    const successMessage = 'Email sent successfully.';
                    console.debug(successMessage);
                    response.send(successMessage);
                })
                .catch((error) => {
                    console.error(`Error sending email: ${error}`);
                    response.status(500).send(`Error sending email.`);
                });
        } else {
            response.status(400).send('Invalid request format.');
        }
    } else {
        response.status(400).send('Invalid request format.');
    }
});

exports.app = app;
