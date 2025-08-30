import request from 'supertest';

import { afterAll, afterEach, jest } from '@jest/globals';

let nodemailer;
let app;

jest.unstable_mockModule('nodemailer', () => ({
    createTransport: jest.fn()
}));

beforeAll(async () => {
    app = (await import('../main/app.js')).app;
    nodemailer = await import('nodemailer');
});

afterAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
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

describe('POST /mail', () => {
    beforeEach(() => {
        process.env = { ...TEST_ENV };
        nodemailer.createTransport.mockClear();
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
        nodemailer.createTransport.mockClear();
    });

    test('POST /mail - success', async () => {
        const sendMailMock = jest.fn().mockResolvedValue('success');
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

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

    test('POST /mail - sendEmail error', async () => {
        const sendMailMock = jest.fn().mockRejectedValue(new Error('SMTP error'));
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        const response = await request(app)
            .post('/mail')
            .send({ subject: 'Test Subject', message: 'Test Body' });

        expect(response.statusCode).toBe(500);
        expect(response.text).toBe('Error sending email.');
    });
});
