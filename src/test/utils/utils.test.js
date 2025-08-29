import { isValidString, sanitizeEmailBody, sanitizeEmailSubject, sanitizeString, verifyEmailSettings } from '../../main/utils/utils.js';

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
        const ORIGINAL_ENV = process.env;
        const REQUIRED_VARS = [
            ['SMTP_SERVICE'],
            ['SMTP_REQUIRE_TLS'],
            ['MAIL_USER'],
            ['MAIL_PASSWORD'],
            ['MAIL_FROM'],
            ['MAIL_TO']
        ];

        beforeEach(() => {
            process.env = { ...ORIGINAL_ENV };
        });

        afterAll(() => {
            process.env = ORIGINAL_ENV;
        });

        test('verifyEmailSettings() - all required variables set', () => {
            process.env.SMTP_SERVICE = 'gmail';
            process.env.SMTP_REQUIRE_TLS = 'true';
            process.env.MAIL_USER = 'user@example.com';
            process.env.MAIL_PASSWORD = 'password';
            process.env.MAIL_FROM = 'from@example.com';
            process.env.MAIL_TO = 'to@example.com';

            expect(verifyEmailSettings()).toBeTruthy();
        });

        test.each(
            REQUIRED_VARS
        )('verifyEmailSettings() - %s is missing', (missingVar) => {
            process.env.SMTP_SERVICE = 'gmail';
            process.env.SMTP_REQUIRE_TLS = 'true';
            process.env.MAIL_USER = 'user@example.com';
            process.env.MAIL_PASSWORD = 'password';
            process.env.MAIL_FROM = 'from@example.com';
            process.env.MAIL_TO = 'to@example.com';
            delete process.env[missingVar];

            expect(verifyEmailSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_VARS
        )('verifyEmailSettings() - %s is empty string', (missingVar) => {
            process.env.SMTP_SERVICE = 'gmail';
            process.env.SMTP_REQUIRE_TLS = 'true';
            process.env.MAIL_USER = 'user@example.com';
            process.env.MAIL_PASSWORD = 'password';
            process.env.MAIL_FROM = 'from@example.com';
            process.env.MAIL_TO = 'to@example.com';
            process.env[missingVar] = '';

            expect(verifyEmailSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_VARS
        )('verifyEmailSettings() - %s is undefined', (missingVar) => {
            process.env.SMTP_SERVICE = 'gmail';
            process.env.SMTP_REQUIRE_TLS = 'true';
            process.env.MAIL_USER = 'user@example.com';
            process.env.MAIL_PASSWORD = 'password';
            process.env.MAIL_FROM = 'from@example.com';
            process.env.MAIL_TO = 'to@example.com';
            process.env[missingVar] = undefined;

            expect(verifyEmailSettings()).toBeFalsy();
        });
    });
});
