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

import { Validation, EmailClient, ProjectsCollection } from '../../src/utils/utils.mjs';

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

const REQUIRED_EMAIL_VARS = [
    ['SMTP_SERVICE'],
    ['SMTP_REQUIRE_TLS'],
    ['MAIL_USER'],
    ['MAIL_PASSWORD'],
    ['MAIL_FROM'],
    ['MAIL_TO']
];

describe('utils.js', () => {
    describe('EmailClient', () => {
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
                await expect(EmailClient.sendEmail('Test Subject', 'Test Body')).rejects.toThrow('Email settings not properly configured.');
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

    describe('ProjectsCollection', () => {
        describe('ProjectsCollection.getAllProjects()', () => {
            test('ProjectsCollection.getAllProjects() - returns an array', () => {
                const projects = ProjectsCollection.getAllProjects();
                expect(projects).toBeInstanceOf(Array);
                expect(projects.length).toBeGreaterThan(0);
            });
        });

        describe('ProjectsCollection.getProjectById()', () => {
            test.each([
                {
                    id: 1,
                    expected: {
                        id: 1,
                        title: 'Project 1'
                    }
                },
                { id: 0, expected: undefined },
                { id: Number.MAX_SAFE_INTEGER, expected: undefined },
                { id: NaN, expected: undefined },
                { id: undefined, expected: undefined },
                { id: null, expected: undefined },
                { id: '', expected: undefined },
                { id: '1', expected: undefined },
                { id: 'cat', expected: undefined },
                { id: {}, expected: undefined },
                { id: [], expected: undefined },
                {
                    id: () => {
                        return 'test';
                    },
                    expected: undefined
                }
            ])('ProjectsCollection.getProjectById($id)', ({ id, expected }) => {
                const project = ProjectsCollection.getProjectById(id);
                expect(project).toEqual(expected);
            });
        });

        describe('ProjectsCollection.isValidProjectId()', () => {
            test.each([
                { id: 1, expected: true },
                { id: 0, expected: false },
                { id: Number.MAX_SAFE_INTEGER, expected: false },
                { id: NaN, expected: false },
                { id: undefined, expected: false },
                { id: null, expected: false },
                { id: '', expected: false },
                { id: '1', expected: false },
                { id: 'cat', expected: false },
                { id: {}, expected: false },
                { id: [], expected: false },
                {
                    id: () => {
                        return 'test';
                    },
                    expected: false
                }
            ])('ProjectsCollection.isValidProjectId($id)', ({ id, expected }) => {
                expect(ProjectsCollection.isValidProjectId(id)).toBe(expected);
            });
        });
    });

    describe('Validation', () => {
        describe('Validation.isValidString()', () => {
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
            ])('Validation.isValidString($input)', ({ input, expected }) => {
                expect(Validation.isValidString(input)).toBe(expected);
            });
        });

        describe('Validation.sanitizeString()', () => {
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
            ])('Validation.sanitizeString($input)', ({ input, expected }) => {
                expect(Validation.sanitizeString(input)).toBe(expected);
            });
        });
    });
});
