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

import { EmailClient } from '../../src/utils/email-client.mjs';

import { ORIGINAL_ENV, TEST_ENV, REQUIRED_EMAIL_VARS } from '../test_utils/env.mjs';

// TODO - follow patterns established in DatabaseClient unit tests.

describe('EmailClient', () => {
    afterAll(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    test.todo('EmailClient constructor');

    describe('EmailClient.sanitizeEmailSubject()', () => {
        test.each([
            { input: 'value', expected: 'value' },
            { input: '    value', expected: 'value' },
            { input: 'value    ', expected: 'value' },
            { input: '    value    ', expected: 'value' },
            { input: '\nvalue\n', expected: 'value' },
            { input: '\tvalue\t', expected: 'value' },
            { input: ' \n \tvalue \n \t', expected: 'value' },
            { input: 'other value', expected: 'other value' },
            { input: '    other    value    ', expected: 'other    value' },
            { input: '', expected: undefined },
            { input: '        ', expected: undefined },
            { input: '\n', expected: undefined },
            { input: '\t', expected: undefined },
            { input: '\n\t', expected: undefined },
            { input: '   \n\t   ', expected: undefined },
            { input: null, expected: undefined },
            { input: undefined, expected: undefined },
            { input: 123, expected: undefined },
            { input: {}, expected: undefined },
            { input: [], expected: undefined },
            {
                input: () => {
                    return 'test';
                },
                expected: undefined
            },
            { input: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH), expected: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH) },
            { input: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH + 1), expected: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH) },
            { input: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH + 100), expected: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH) },
            { input: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH - 1), expected: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH - 1) },
            { input: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH + 5000), expected: 'a'.repeat(EmailClient.MAX_SUBJECT_LENGTH) },
            { input: '   a'.repeat(EmailClient.MAX_SUBJECT_LENGTH / 2), expected: ('   a'.repeat(EmailClient.MAX_SUBJECT_LENGTH / 2)).trim().substring(0, EmailClient.MAX_SUBJECT_LENGTH) },
            { input: '   a'.repeat(EmailClient.MAX_SUBJECT_LENGTH), expected: ('   a'.repeat(EmailClient.MAX_SUBJECT_LENGTH)).trim().substring(0, EmailClient.MAX_SUBJECT_LENGTH) },
            { input: '\n'.repeat(10) + 'body' + '\n'.repeat(10), expected: 'body' },
            { input: '\t'.repeat(10) + 'body' + '\t'.repeat(10), expected: 'body' },
            { input: 'body\nwith\nnewlines', expected: 'body\nwith\nnewlines' },
            { input: 'body\twith\ttabs', expected: 'body\twith\ttabs' },
            { input: 'body with special chars !@#$%^&*()', expected: 'body with special chars !@#$%^&*()' }
        ])('EmailClient.sanitizeEmailSubject() - %#', ({ input, expected }) => {
            expect(EmailClient.sanitizeEmailSubject(input)).toBe(expected);
        });
    });

    describe('EmailClient.sanitizeEmailBody()', () => {
        test.each([
            { input: 'value', expected: 'value' },
            { input: '    value', expected: 'value' },
            { input: 'value    ', expected: 'value' },
            { input: '    value    ', expected: 'value' },
            { input: '\nvalue\n', expected: 'value' },
            { input: '\tvalue\t', expected: 'value' },
            { input: ' \n \tvalue \n \t', expected: 'value' },
            { input: 'other value', expected: 'other value' },
            { input: '    other    value    ', expected: 'other    value' },
            { input: '', expected: undefined },
            { input: '        ', expected: undefined },
            { input: '\n', expected: undefined },
            { input: '\t', expected: undefined },
            { input: '\n\t', expected: undefined },
            { input: '   \n\t   ', expected: undefined },
            { input: null, expected: undefined },
            { input: undefined, expected: undefined },
            { input: 123, expected: undefined },
            { input: {}, expected: undefined },
            { input: [], expected: undefined },
            {
                input: () => {
                    return 'test';
                },
                expected: undefined
            },
            { input: 'b'.repeat(EmailClient.MAX_BODY_LENGTH), expected: 'b'.repeat(EmailClient.MAX_BODY_LENGTH) },
            { input: 'b'.repeat(EmailClient.MAX_BODY_LENGTH + 1), expected: 'b'.repeat(EmailClient.MAX_BODY_LENGTH) },
            { input: 'b'.repeat(EmailClient.MAX_BODY_LENGTH + 100), expected: 'b'.repeat(EmailClient.MAX_BODY_LENGTH) },
            { input: 'b'.repeat(EmailClient.MAX_BODY_LENGTH - 1), expected: 'b'.repeat(EmailClient.MAX_BODY_LENGTH - 1) },
            { input: 'b'.repeat(EmailClient.MAX_BODY_LENGTH + 5000), expected: 'b'.repeat(EmailClient.MAX_BODY_LENGTH) },
            { input: '   b'.repeat(EmailClient.MAX_BODY_LENGTH / 2), expected: ('   b'.repeat(EmailClient.MAX_BODY_LENGTH / 2)).trim().substring(0, EmailClient.MAX_BODY_LENGTH) },
            { input: '   b'.repeat(EmailClient.MAX_BODY_LENGTH), expected: ('   b'.repeat(EmailClient.MAX_BODY_LENGTH)).trim().substring(0, EmailClient.MAX_BODY_LENGTH) },
            { input: '\n'.repeat(10) + 'body' + '\n'.repeat(10), expected: 'body' },
            { input: '\t'.repeat(10) + 'body' + '\t'.repeat(10), expected: 'body' },
            { input: 'body\nwith\nnewlines', expected: 'body\nwith\nnewlines' },
            { input: 'body\twith\ttabs', expected: 'body\twith\ttabs' },
            { input: 'body with special chars !@#$%^&*()', expected: 'body with special chars !@#$%^&*()' }
        ])('EmailClient.sanitizeEmailBody() - %#', ({ input, expected }) => {
            expect(EmailClient.sanitizeEmailBody(input)).toBe(expected);
        });
    });

    describe('EmailClient.verifyEmailSettings()', () => {
        beforeEach(() => {
            process.env = { ...TEST_ENV };
        });

        afterEach(() => {
            process.env = ORIGINAL_ENV;
        });

        test('EmailClient.verifyEmailSettings() - all required variables set', () => {
            expect(EmailClient.verifyEmailSettings()).toBeTruthy();
        });

        test.each(
            REQUIRED_EMAIL_VARS
        )('EmailClient.verifyEmailSettings() - %s is missing', (missingVar) => {
            delete process.env[missingVar];

            expect(EmailClient.verifyEmailSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_EMAIL_VARS
        )('EmailClient.verifyEmailSettings() - %s is empty string', (missingVar) => {
            process.env[missingVar] = '';

            expect(EmailClient.verifyEmailSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_EMAIL_VARS
        )('EmailClient.verifyEmailSettings() - %s is undefined', (missingVar) => {
            process.env[missingVar] = undefined;

            expect(EmailClient.verifyEmailSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_EMAIL_VARS
        )('EmailClient.verifyEmailSettings() - %s is whitespace only', (missingVar) => {
            process.env[missingVar] = '   ';

            expect(EmailClient.verifyEmailSettings()).toBeFalsy();
        });
    });

    describe('EmailClient.sendEmail()', () => {
        beforeEach(() => {
            process.env = { ...TEST_ENV };
            vi.clearAllMocks();
        });

        afterEach(() => {
            process.env = ORIGINAL_ENV;
            vi.clearAllMocks();
        });

        test('EmailClient.sendEmail() - sends email successfully', async () => {
            const sendMailMock = vi.fn().mockResolvedValue('success');
            const createTransportMock = vi.fn().mockReturnValue({ sendMail: sendMailMock });
            nodemailer.createTransport = createTransportMock;

            await expect(EmailClient.sendEmail('Test Subject', 'Test Body')).resolves.toBeUndefined();

            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                service: TEST_ENV.SMTP_SERVICE,
                requireTLS: TEST_ENV.SMTP_REQUIRE_TLS === 'true',
                auth: {
                    user: TEST_ENV.MAIL_USER,
                    pass: TEST_ENV.MAIL_PASSWORD
                }
            });

            expect(sendMailMock).toHaveBeenCalledWith({
                from: TEST_ENV.MAIL_FROM,
                to: TEST_ENV.MAIL_TO,
                subject: 'Test Subject',
                text: 'Test Body'
            });
        });

        test('EmailClient.sendEmail() - email settings are missing', async () => {
            process.env.SMTP_SERVICE = '';
            await expect(EmailClient.sendEmail('Test Subject', 'Test Body')).rejects.toThrow('Invalid email configuration settings.');
        });

        test('EmailClient.sendEmail() - subject is invalid', async () => {
            await expect(EmailClient.sendEmail('', 'Test Body')).rejects.toThrow('Email subject or body is invalid.');
        });

        test('EmailClient.sendEmail() - body is invalid', async () => {
            await expect(EmailClient.sendEmail('Test Subject', '')).rejects.toThrow('Email subject or body is invalid.');
        });

        test('EmailClient.sendEmail() - sendMail fails', async () => {
            const sendMailMock = vi.fn().mockRejectedValue(new Error('SMTP error'));
            const createTransportMock = vi.fn().mockReturnValue({ sendMail: sendMailMock });
            nodemailer.createTransport = createTransportMock;

            await expect(EmailClient.sendEmail('Test Subject', 'Test Body')).rejects.toThrow('Email send failed: Error: SMTP error');
        });
    });
});
