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

import cors from 'cors';
import express from 'express';

import { rateLimit } from 'express-rate-limit';

import { DatabaseClient } from './db/database-client.mjs';
import { Projects } from './models/projects.mjs';
import { Random } from './utils/random.mjs';
import { MILLIS_PER_SECOND, SECONDS_PER_MINUTE } from './utils/constants.mjs';

export const app = express();

try {
    await DatabaseClient.init();
} catch (error) {
    console.error(error);
}

const limiter = rateLimit({
    windowMs: MILLIS_PER_SECOND * SECONDS_PER_MINUTE,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56
});

app.use(limiter);
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (request, response) => {
    const projectIds = await Projects.getAllProjectIds();
    const featuredProjectId = Random.selectRandomElement(projectIds);
    let featuredProject = undefined;

    if (featuredProjectId) {
        featuredProject = await Projects.getProjectById(featuredProjectId);
    }

    response.render('index.ejs', { featuredProject: featuredProject });
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

app.get('/projects', async (request, response) => {
    const projects = await Projects.getAllProjects();
    response.render('projects.ejs', { projects: projects, maxCols: 3 });
});

app.get('/projects/:id', async (request, response) => {
    const id = request.params.id;

    if (id) {
        let projectId = parseInt(id);
        let projectData = await Projects.getProjectById(projectId);

        if (projectData !== undefined) {
            response.render('project.ejs', {
                project: projectData
            });
        } else {
            response.status(404).render('errors/404.ejs');
        }
    } else {
        response.status(404).render('errors/404.ejs');
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).render('errors/500.ejs');
});

app.use((request, response, next) => {
    response.status(404).render('errors/404.ejs');
});
