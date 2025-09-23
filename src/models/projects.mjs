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

import { DatabaseClient } from '../utils/database-client.mjs';

export class Projects {
    static #projects = [];
    static #initPromise = null;

    static async init() {
        if (Projects.#projects) {
            return;
        }

        if (Projects.#initPromise) {
            await Projects.#initPromise;
            return;
        }

        const initPromise = Projects.#queryAllProjects();
        Projects.#initPromise = initPromise;

        try {
            await initPromise;
        } catch (error) {
            console.error('Projects initialization error: ' + error.message);
        } finally {
            if (Projects.#initPromise === initPromise) {
                Projects.#initPromise = null;
            }
        }
    }

    static getProjectIds() {
        return Projects.#projects.map(project => project.id);
    }

    static getAllProjects() {
        return Projects.#projects.map(project => Projects.#buildProject(project));
    }

    static getProjectById(projectId) {
        const project = Projects.#projects.find(project => project.id === projectId);

        if (project) {
            return Projects.#buildProject(project);
        } else {
            return undefined;
        }
    }

    static isValidProjectId(projectId) {
        return Projects.getProjectIds().includes(projectId);
    }

    static #buildProject(projectData) {
        return {
            id: projectData.id,
            project_title: projectData.project_title,
            image_url: projectData.image_url,
            project_description: projectData.project_description
        };
    }

    static async #queryAllProjects() {
        const query = 'SELECT * FROM projects';

        try {
            const [rows] = await DatabaseClient.connectionPool.execute(query);
            Projects.#projects = rows;
        } catch (error) {
            console.error(error);
        }
    }
}
