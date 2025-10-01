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

import { Validation } from '../../src/utils/validation.mjs';

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

    describe('Validation.isValidNumber()', () => {
        test.todo('Validation.isValidNumber()');
    });
});
