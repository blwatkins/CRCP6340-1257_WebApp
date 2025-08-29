import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import { encode } from 'html-entities';

dotenv.config();

export async function sendContactEmail(subject, text) {
    if (verifyMailSettings()) {
        const transport = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            requireTLS: process.env.SMTP_REQUIRE_TLS,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        // TODO - validate subject and text parameters (empty, too long)
        // TODO - sanitize subject and text parameters if necessary
        const message = {
            from: process.env.MAIL_FROM,
            to: process.env.MAIL_TO,
            subject: subject,
            text: text
        };

        await transport.sendMail(message)
            .then(() => {
                console.log('Email send successfully');
            })
            .catch((error) => {
                throw new Error(`Error sending email: ${error}`);
            });
    } else {
        throw new Error('Mail settings are not properly configured.');
    }
}

export function isValidString(input) {
    const validType = typeof input === 'string';
    let validContent = false;

    if (validType) {
        validContent = input.trim().length > 0;
    }

    return validType && validContent;
}

export function sanitizeString(input) {
    if (isValidString(input)) {
        const trimmed = input.trim();
        const htmlEncoded = encode(trimmed);
        return htmlEncoded;
    } else {
        return undefined;
    }
}

function verifyMailSettings() {
    const service = process.env.SMTP_SERVICE;
    const requireTLS = process.env.SMTP_REQUIRE_TLS;
    const user = process.env.MAIL_USER;
    const password = process.env.MAIL_PASSWORD;
    const mailFrom = process.env.MAIL_FROM;
    const mailTo = process.env.MAIL_TO;
    return service && requireTLS && user && password && mailFrom && mailTo;
}
