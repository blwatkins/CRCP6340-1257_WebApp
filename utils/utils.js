import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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

function verifyMailSettings() {
    const service = process.env.SMTP_SERVICE;
    const requireTLS = process.env.SMTP_REQUIRE_TLS;
    const user = process.env.MAIL_USER;
    const password = process.env.MAIL_PASSWORD;
    const mailFrom = process.env.MAIL_FROM;
    const mailTo = process.env.MAIL_TO;
    return service && requireTLS && user && password && mailFrom && mailTo;
}
