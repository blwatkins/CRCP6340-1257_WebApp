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

import mysql from 'mysql2/promise';

import { Validation } from './utils.mjs';

export class DatabaseClient {
    static #connectionPool = null;
    static #initPromise = null;

    constructor() {
        throw new Error('DatabaseClient is a static class and cannot be instantiated.');
    }

    static verifyConnectionSettings() {
        const host = process.env.MYSQL_HOST;
        const port = process.env.MYSQL_PORT;
        const user = process.env.MYSQL_USER;
        const password = process.env.MYSQL_PASSWORD;
        const database = process.env.MYSQL_DATABASE;

        return (
            Validation.isValidString(host) &&
            Validation.isValidString(port) &&
            Validation.isValidString(user) &&
            Validation.isValidString(password) &&
            Validation.isValidString(database)
        );
    }

    static async init() {
        if (DatabaseClient.#connectionPool) {
            return;
        }

        if (DatabaseClient.#initPromise) {
            await DatabaseClient.#initPromise;
            return;
        }

        if (!DatabaseClient.verifyConnectionSettings()) {
            throw new Error('Invalid database connection settings.');
        }

        const initPromise = DatabaseClient.#getConnectionPool();
        DatabaseClient.#initPromise = initPromise;

        try {
            await initPromise;
        } finally {
            if (DatabaseClient.#initPromise === initPromise) {
                DatabaseClient.#initPromise = null;
            }
        }
    }

    static async closeConnectionPool() {
        if (DatabaseClient.#initPromise) {
            await DatabaseClient.#initPromise;
        }

        const pool = DatabaseClient.#connectionPool;

        if (pool) {
            try {
                await pool.end();
            } catch (error) {
                console.error('Error closing database connection pool: ' + error.message);
            }

            if (DatabaseClient.#connectionPool === pool) {
                DatabaseClient.#connectionPool = null;
            }
        }
    }

    static async #getConnectionPool() {
        try {
            DatabaseClient.#connectionPool = await mysql.createPool({
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE
            });
        } catch (error) {
            DatabaseClient.#connectionPool = null;
            throw error;
        }
    }

    static async getAllProjects() {
        const results = await DatabaseClient.#connectionPool.execute('SELECT * FROM projects;');
        return results[0];
    }
}
