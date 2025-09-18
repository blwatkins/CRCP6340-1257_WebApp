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

vi.mock('nodemailer');

import nodemailer from 'nodemailer';
import request from 'supertest';

import { app } from '../src/app.mjs';

afterAll(() => {
    vi.clearAllMocks();
    vi.resetModules();
});

const ORIGINAL_ENV = process.env;

const TEST_ENV = {
    ...ORIGINAL_ENV,
    SMTP_SERVICE: 'fake',
    SMTP_REQUIRE_TLS: 'true',
    MAIL_USER: 'user@fake-website.fake',
    MAIL_PASSWORD: 'password',
    MAIL_FROM: 'from@fake-website.fake',
    MAIL_TO: 'to@fake-website.fake'
};

describe('app routing', () => {
    describe('general routes', () => {
        test('GET /nonexistent - returns 404', async () => {
            const response = await request(app).get('/nonexistent');
            expect(response.statusCode).toBe(404);
        });
    });

    describe('GET /', () => {
        test('GET / - returns 200', async () => {
            const response = await request(app).get('/');
            expect(response.statusCode).toBe(200);
        });
    });

    describe('GET /acknowledgements', () => {
        test('GET /acknowledgements - returns 200', async () => {
            const response = await request(app).get('/acknowledgements');
            expect(response.statusCode).toBe(200);
        });
    });

    describe('GET /contact', () => {
        test('GET /contact - returns 200', async () => {
            const response = await request(app).get('/contact');
            expect(response.statusCode).toBe(200);
        });
    });

    describe('GET /projects', () => {
        test('GET /projects - returns 200', async () => {
            const response = await request(app).get('/projects');
            expect(response.statusCode).toBe(200);
        });
    });

    describe('GET /project/:id', () => {
        test.each([
            { id: '1', expectedStatus: 200 },
            { id: '2', expectedStatus: 200 },
            { id: '50000', expectedStatus: 404 },
            { id: 'cat', expectedStatus: 404 }
        ])('GET /projects/$id', async ({ id, expectedStatus }) => {
            const response = await request(app).get(`/projects/${id}`);
            expect(response.statusCode).toBe(expectedStatus);
        });
    });

    describe('POST /mail', () => {
        beforeEach(() => {
            process.env = { ...TEST_ENV };
            vi.clearAllMocks();
        });

        afterEach(() => {
            process.env = ORIGINAL_ENV;
            vi.clearAllMocks();
        });

        test('POST /mail - success', async () => {
            const sendMailMock = vi.fn().mockResolvedValue('success');
            const createTransportMock = vi.fn().mockReturnValue({ sendMail: sendMailMock });
            nodemailer.createTransport = createTransportMock;

            const response = await request(app)
                .post('/mail')
                .send({ subject: 'Test Subject', message: 'Test Body' });

            expect(response.statusCode).toBe(200);
            expect(response.text).toBe('Email sent successfully.');
            expect(sendMailMock).toHaveBeenCalledWith({
                from: TEST_ENV.MAIL_FROM,
                to: TEST_ENV.MAIL_TO,
                subject: 'Test Subject',
                text: 'Test Body'
            });
        });

        test('POST /mail - invalid subject or message', async () => {
            const response = await request(app)
                .post('/mail')
                .send({ subject: '', message: '' });

            expect(response.statusCode).toBe(400);
            expect(response.text).toBe('Invalid request format.');
        });

        test('POST /mail - missing required fields', async () => {
            const response = await request(app)
                .post('/mail')
                .send({ subject: 'Test Subject' });

            expect(response.statusCode).toBe(400);
            expect(response.text).toBe('Invalid request format.');
        });

        test('POST /mail - malformed JSON', async () => {
            const response = await request(app)
                .post('/mail')
                .send('invalid json');

            expect(response.statusCode).toBe(400);
        });

        test('POST /mail - sendEmail error', async () => {
            const sendMailMock = vi.fn().mockRejectedValue(new Error('SMTP error'));
            const createTransportMock = vi.fn().mockReturnValue({ sendMail: sendMailMock });
            nodemailer.createTransport = createTransportMock;

            const response = await request(app)
                .post('/mail')
                .send({ subject: 'Test Subject', message: 'Test Body' });

            expect(response.statusCode).toBe(500);
            expect(response.text).toBe('Error sending email.');
        });
    });
});
