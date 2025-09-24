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

import { encode } from 'html-entities';

import { ProjectsClient } from '../db/projects-client.mjs';

export class Projects {
    static async getAllProjects() {
        try {
            const projects = await ProjectsClient.queryAllProjects();
            return projects.map(project => Projects.#buildProject(project));
        } catch (error) {
            console.error(error);
        }

        return [];
    }

    static async getProjectById(projectId) {
        try {
            const project = await ProjectsClient.queryProjectById(projectId);

            if (project) {
                return Projects.#buildProject(project);
            }
        } catch (error) {
            console.error(error);
        }

        return undefined;
    }

    static #buildProject(projectData) {
        return {
            id: projectData.id,
            title: projectData.title,
            image_url: encodeURIComponent(projectData.image_url),
            description: projectData.description
        };
    }
}
