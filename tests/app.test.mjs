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

import request from 'supertest';

import { app } from '../src/app.mjs';

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

        test.todo('GET / - returns 200 with mocked database');

        test.todo('GET / - returns 200 with database connection error');

        test.todo('GET / - returns 200 with empty database');
    });

    describe('GET /acknowledgements', () => {
        test('GET /acknowledgements - returns 200', async () => {
            const response = await request(app).get('/acknowledgements');
            expect(response.statusCode).toBe(200);
        });
    });

    describe('GET /projects', () => {
        test('GET /projects - returns 200', async () => {
            const response = await request(app).get('/projects');
            expect(response.statusCode).toBe(200);
        });

        test.todo('GET / - returns 200 with mocked database');

        test.todo('GET / - returns 200 with database connection error');

        test.todo('GET / - returns 200 with empty database');
    });

    describe('GET /project/:id', () => {
        // test.each([
        //     { id: '1', expectedStatus: 200 },
        //     { id: '2', expectedStatus: 200 },
        //     { id: '50000', expectedStatus: 404 },
        //     { id: 'cat', expectedStatus: 404 }
        // ])('GET /projects/$id', async ({ id, expectedStatus }) => {
        //     const response = await request(app).get(`/projects/${id}`);
        //     expect(response.statusCode).toBe(expectedStatus);
        // });

        test.todo('GET /projects/$id');
    });
});
