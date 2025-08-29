import express from 'express';
import dotenv from 'dotenv';

import { sendContactEmail } from './utils/utils.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/mail', async (request, response) => {
    console.log('mail request received');

    // TODO - validate request body
    // TODO - sanitize request body
    // TODO - set proper subject and text from request body
    await sendContactEmail('Test Subject', 'This is a test email body.')
        .then(() => {
            console.log('Email sent successfully from app.js');
            response.send('Email sent successfully from app.js');
        })
        .catch((error) => {
            console.error(`Error sending email from app.js: ${error}`);
            response.status(500).send(`Error sending email from app.js: ${error}`);
        });
});

app.listen(port, () => {
    console.log(`CRCP 6340 (1257) WebApp listening at http://localhost:${port}`);
});
