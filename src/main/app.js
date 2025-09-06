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

const express = require('express');

const { Validation, EmailClient } = require('./utils/utils.js');

const app = express();

const MAX_PROJECT_ID = 5;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.get('/', (request, response) => {
    response.render('index.ejs');
});

app.get('/acknowledgements', (request, response) => {
    response.render('acknowledgements.ejs', {
        credits: [
            {
                fontAwesomeIcon: 'fa-solid fa-server',
                introText: 'Built with',
                linkText: 'Express',
                linkURL: 'https://expressjs.com/'
            },
            {
                fontAwesomeIcon: 'fa-solid fa-envelope',
                introText: 'Built with',
                linkText: 'Nodemailer',
                linkURL: 'https://nodemailer.com/'
            },
            {
                fontAwesomeIcon: 'fa-brands fa-css',
                introText: 'Built with',
                linkText: 'Bootstrap',
                linkURL: 'https://getbootstrap.com/'
            },
            {
                fontAwesomeIcon: 'fa-solid fa-trophy',
                introText: 'Icons provided by',
                linkText: 'Font Awesome',
                linkURL: 'https://fontawesome.com/'
            }
        ]
    });
});

app.get('/contact', (request, response) => {
    response.render('contact.ejs');
});

app.get('/projects', (request, response) => {
    response.render('projects.ejs', { projects: [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }, { id: 3, name: 'Project 3' }, { id: 4, name: 'Project 4' }, { id: 5, name: 'Project 5' }] });
});

app.get('/projects/:id', (request, response) => {
    const id = request.params.id;
    let projectId;

    if (id) {
        projectId = parseInt(id);
        // TODO - replace with isValidProjectId()
        if (typeof projectId === 'number' && !isNaN(projectId) && projectId > 0 && projectId <= MAX_PROJECT_ID) {
            response.render('project.ejs', { projectId: projectId });
        } else {
            response.status(404).render('errors/404.ejs');
        }
    } else {
        response.status(404).render('errors/404.ejs');
    }
});

app.post('/mail', async (request, response) => {
    console.debug('Mail request received.');

    if (request.body) {
        const requestSubject = request.body.subject;
        const requestMessage = request.body.message;
        let subject;
        let message;

        if (Validation.isValidString(requestSubject)) {
            subject = Validation.sanitizeString(requestSubject);
        }

        if (Validation.isValidString(requestMessage)) {
            message = Validation.sanitizeString(requestMessage);
        }

        if (subject && message) {
            try {
                await EmailClient.sendEmail(subject, message);
                const successMessage = 'Email sent successfully.';
                console.debug(successMessage);
                response.send(successMessage);
            } catch (error) {
                console.error(`Error sending email: ${error}`);
                response.status(500).send('Error sending email.');
            }
        } else {
            response.status(400).send('Invalid request format.');
        }
    } else {
        response.status(400).send('Invalid request format.');
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).render('errors/500.ejs');
});

app.use((request, response, next) => {
    response.status(404).render('errors/404.ejs');
});

exports.app = app;
