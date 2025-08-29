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

import nodemailer from 'nodemailer';

function verifyEmailSettings() {
    const service = process.env.SMTP_SERVICE;
    const requireTLS = process.env.SMTP_REQUIRE_TLS;
    const user = process.env.MAIL_USER;
    const password = process.env.MAIL_PASSWORD;
    const mailFrom = process.env.MAIL_FROM;
    const mailTo = process.env.MAIL_TO;
    return service && requireTLS && user && password && mailFrom && mailTo;
}

function sanitizeEmailSubject(subject) {
    const MAX_SUBJECT_LENGTH = 256;

    if (isValidString(subject)) {
        let sanitized = sanitizeString(subject);

        if (sanitized && sanitized.length > MAX_SUBJECT_LENGTH) {
            sanitized = sanitized.substring(0, MAX_SUBJECT_LENGTH);
        }

        return sanitized;
    } else {
        return undefined;
    }
}

function sanitizeEmailBody(body) {
    const MAX_BODY_LENGTH = 16384;

    if (isValidString(body)) {
        let sanitized = sanitizeString(body);

        if (sanitized && sanitized.length > MAX_BODY_LENGTH) {
            sanitized = sanitized.substring(0, MAX_BODY_LENGTH);
        }

        return sanitized;
    } else {
        return undefined;
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
        return trimmed;
    } else {
        return undefined;
    }
}

/**
 * Sends an email from the configured email address to the configured recipient.
 * SMTP settings must be configured in the .env file.
 * From address and to address must also be configured in the .env file.
 *
 * @param {*} subject - The subject of the email
 * @param {*} body - The body of the email
 */
export async function sendEmail(subject, body) {
    if (!verifyEmailSettings()) {
        throw new Error('Email settings not properly configured.');
    }

    const transport = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        requireTLS: process.env.SMTP_REQUIRE_TLS,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const messageSubject = sanitizeEmailSubject(subject);
    const messageText = sanitizeEmailBody(body);

    if (!messageSubject || !messageText) {
        throw new Error('Email subject or body is invalid.');
    }

    const message = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: messageSubject,
        text: messageText
    };

    await transport.sendMail(message)
        .catch((error) => {
            throw new Error(`Email send failed: ${error}`);
        });
}
