import express from 'express';

import { isValidString, sanitizeString, sendEmail } from './utils/utils.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/mail', async (request, response) => {
    console.debug('Mail request received.');

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
});

app.listen(port, () => {
    console.log(`CRCP 6340 (1257) WebApp listening at http://localhost:${port}`);
});
