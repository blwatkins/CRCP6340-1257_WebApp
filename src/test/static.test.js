const request = require('supertest');

const { app } = require('../main/app.js');

describe('static file serving', () => {
    test('GET / - serves index.html', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('GET /style/style.css - serves CSS files', async () => {
        const response = await request(app).get('/style/style.css');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toMatch(/text\/css/);
    });
});
