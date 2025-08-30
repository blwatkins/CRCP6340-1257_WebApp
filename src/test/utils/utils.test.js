import { jest } from '@jest/globals';

import { isValidString, sanitizeEmailBody, sanitizeEmailSubject, sanitizeString, sendEmail, verifyEmailSettings } from '../../main/utils/utils.js';

let nodemailer;

jest.unstable_mockModule('nodemailer', () => ({
    createTransport: jest.fn()
}));

beforeAll(async () => {
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

const REQUIRED_EMAIL_VARS = [
    ['SMTP_SERVICE'],
    ['SMTP_REQUIRE_TLS'],
    ['MAIL_USER'],
    ['MAIL_PASSWORD'],
    ['MAIL_FROM'],
    ['MAIL_TO']
];

describe('utils.js', () => {
    describe('isValidString()', () => {
        test.each([
            { input: 'value', expected: true },
            { input: '', expected: false },
            { input: '        ', expected: false },
            { input: '\n', expected: false },
            { input: '\t', expected: false },
            { input: '\n\t', expected: false },
            { input: null, expected: false },
            { input: undefined, expected: false },
            { input: 123, expected: false },
            { input: {}, expected: false },
            { input: [], expected: false },
            {
                input: () => {
                    return 'test';
                },
                expected: false
            }
        ])('isValidString($input)', ({ input, expected }) => {
            expect(isValidString(input)).toBe(expected);
        });
    });

    describe('sanitizeString()', () => {
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
            }
        ])('sanitizeString($input)', ({ input, expected }) => {
            expect(sanitizeString(input)).toBe(expected);
        });
    });

    describe('sanitizeEmailSubject()', () => {
        const MAX_SUBJECT_LENGTH = 256;

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
            { input: 'a'.repeat(MAX_SUBJECT_LENGTH), expected: 'a'.repeat(MAX_SUBJECT_LENGTH) },
            { input: 'a'.repeat(MAX_SUBJECT_LENGTH + 1), expected: 'a'.repeat(MAX_SUBJECT_LENGTH) },
            { input: 'a'.repeat(MAX_SUBJECT_LENGTH + 100), expected: 'a'.repeat(MAX_SUBJECT_LENGTH) },
            { input: 'a'.repeat(MAX_SUBJECT_LENGTH - 1), expected: 'a'.repeat(MAX_SUBJECT_LENGTH - 1) },
            { input: 'a'.repeat(MAX_SUBJECT_LENGTH + 5000), expected: 'a'.repeat(MAX_SUBJECT_LENGTH) },
            { input: '   a'.repeat(MAX_SUBJECT_LENGTH / 2), expected: ('   a'.repeat(MAX_SUBJECT_LENGTH / 2)).trim().substring(0, MAX_SUBJECT_LENGTH) },
            { input: '   a'.repeat(MAX_SUBJECT_LENGTH), expected: ('   a'.repeat(MAX_SUBJECT_LENGTH)).trim().substring(0, MAX_SUBJECT_LENGTH) },
            { input: '\n'.repeat(10) + 'body' + '\n'.repeat(10), expected: 'body' },
            { input: '\t'.repeat(10) + 'body' + '\t'.repeat(10), expected: 'body' },
            { input: 'body\nwith\nnewlines', expected: 'body\nwith\nnewlines' },
            { input: 'body\twith\ttabs', expected: 'body\twith\ttabs' },
            { input: 'body with special chars !@#$%^&*()', expected: 'body with special chars !@#$%^&*()' }
        ])('sanitizeEmailSubject() - $#', ({ input, expected }) => {
            expect(sanitizeEmailSubject(input)).toBe(expected);
        });
    });

    describe('sanitizeEmailBody()', () => {
        const MAX_BODY_LENGTH = 16384;

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
            { input: 'b'.repeat(MAX_BODY_LENGTH), expected: 'b'.repeat(MAX_BODY_LENGTH) },
            { input: 'b'.repeat(MAX_BODY_LENGTH + 1), expected: 'b'.repeat(MAX_BODY_LENGTH) },
            { input: 'b'.repeat(MAX_BODY_LENGTH + 100), expected: 'b'.repeat(MAX_BODY_LENGTH) },
            { input: 'b'.repeat(MAX_BODY_LENGTH - 1), expected: 'b'.repeat(MAX_BODY_LENGTH - 1) },
            { input: 'b'.repeat(MAX_BODY_LENGTH + 5000), expected: 'b'.repeat(MAX_BODY_LENGTH) },
            { input: '   b'.repeat(MAX_BODY_LENGTH / 2), expected: ('   b'.repeat(MAX_BODY_LENGTH / 2)).trim().substring(0, MAX_BODY_LENGTH) },
            { input: '   b'.repeat(MAX_BODY_LENGTH), expected: ('   b'.repeat(MAX_BODY_LENGTH / 2)).trim().substring(0, MAX_BODY_LENGTH) },
            { input: '\n'.repeat(10) + 'body' + '\n'.repeat(10), expected: 'body' },
            { input: '\t'.repeat(10) + 'body' + '\t'.repeat(10), expected: 'body' },
            { input: 'body\nwith\nnewlines', expected: 'body\nwith\nnewlines' },
            { input: 'body\twith\ttabs', expected: 'body\twith\ttabs' },
            { input: 'body with special chars !@#$%^&*()', expected: 'body with special chars !@#$%^&*()' }
        ])('sanitizeEmailBody() - $#', ({ input, expected }) => {
            expect(sanitizeEmailBody(input)).toBe(expected);
        });
    });

    describe('verifyEmailSettings()', () => {
        beforeEach(() => {
            process.env = { ...TEST_ENV };
        });

        afterEach(() => {
            process.env = ORIGINAL_ENV;
        });

        test('verifyEmailSettings() - all required variables set', () => {
            expect(verifyEmailSettings()).toBeTruthy();
        });

        test.each(
            REQUIRED_EMAIL_VARS
        )('verifyEmailSettings() - %s is missing', (missingVar) => {
            delete process.env[missingVar];

            expect(verifyEmailSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_EMAIL_VARS
        )('verifyEmailSettings() - %s is empty string', (missingVar) => {
            process.env[missingVar] = '';

            expect(verifyEmailSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_EMAIL_VARS
        )('verifyEmailSettings() - %s is undefined', (missingVar) => {
            process.env[missingVar] = undefined;

            expect(verifyEmailSettings()).toBeFalsy();
        });
    });

    describe('sendEmail()', () => {
        beforeEach(() => {
            process.env = { ...TEST_ENV };
            nodemailer.createTransport.mockClear();
        });

        afterEach(() => {
            process.env = ORIGINAL_ENV;
            nodemailer.createTransport.mockClear();
        });

        test('sendEmail() - sends email successfully', async () => {
            const sendMailMock = jest.fn().mockResolvedValue('success');
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

            await expect(sendEmail('Test Subject', 'Test Body')).resolves.toBeUndefined();

            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                service: TEST_ENV.SMTP_SERVICE,
                requireTLS: TEST_ENV.SMTP_REQUIRE_TLS,
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

        test('sendEmail() - email settings are missing', async () => {
            process.env.SMTP_SERVICE = '';
            await expect(sendEmail('Test Subject', 'Test Body')).rejects.toThrow('Email settings not properly configured.');
        });

        test('sendEmail() - subject is invalid', async () => {
            await expect(sendEmail('', 'Test Body')).rejects.toThrow('Email subject or body is invalid.');
        });

        test('sendEmail() - body is invalid', async () => {
            await expect(sendEmail('Test Subject', '')).rejects.toThrow('Email subject or body is invalid.');
        });

        test('sendEmail() - sendMail fails', async () => {
            const sendMailMock = jest.fn().mockRejectedValue(new Error('SMTP error'));
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

            await expect(sendEmail('Test Subject', 'Test Body')).rejects.toThrow('Email send failed: Error: SMTP error');
        });
    });
});
