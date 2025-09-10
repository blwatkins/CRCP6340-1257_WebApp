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

const request = require('supertest');

const { app } = require('../src/app.cjs');

describe('static file serving from public', () => {
    test('GET /style/style.css - serves CSS files', async () => {
        const response = await request(app).get('/style/style.css');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toMatch(/text\/css/);
    });

    test('GET /scripts/splash.js - serves JavaScript files', async () => {
        const response = await request(app).get('/scripts/splash.js');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toMatch(/text\/javascript/);
    });

    test('GET /images/coming-soon-poster.png - serves image files', async () => {
        const response = await request(app).get('/images/coming-soon-poster.png');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toMatch(/image\/png/);
    });
});
