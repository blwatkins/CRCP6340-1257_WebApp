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

vi.mock('mysql2/promise');

import mysql from 'mysql2/promise';

import { DatabaseClient } from '../../src/db/database-client.mjs';

import { ORIGINAL_ENV, TEST_ENV, REQUIRED_DATABASE_VARS } from '../test_utils/env.mjs';

describe('DatabaseClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...TEST_ENV };
    });

    afterEach(async () => {
        vi.clearAllMocks();
        process.env = ORIGINAL_ENV;
        await DatabaseClient.closeConnectionPool();
    });

    afterAll(async () => {
        vi.clearAllMocks();
        vi.resetModules();
        process.env = ORIGINAL_ENV;
        await DatabaseClient.closeConnectionPool();
    });

    describe('DatabaseClient constructor', () => {
        test('new DatabaseClient()', () => {
            expect(() => new DatabaseClient()).toThrow('DatabaseClient is a static class and cannot be instantiated.');
        });
    });

    describe('DatabaseClient.connectionPool', () => {
        test('DatabaseClient.connectionPool - default value', () => {
            expect(DatabaseClient.connectionPool).toBeNull();
        });

        test('DatabaseClient.connectionPool - after initialization', async () => {
            const mockPool = {
                execute: vi.fn(),
                end: vi.fn().mockResolvedValue(undefined)
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

            expect(DatabaseClient.connectionPool).toBeNull();

            await DatabaseClient.init();

            expect(DatabaseClient.connectionPool).toBe(mockPool);
        });
    });

    describe('DatabaseClient.verifyConnectionSettings()', () => {
        test('DatabaseClient.verifyConnectionSettings() - all required variables set', () => {
            expect(DatabaseClient.verifyConnectionSettings()).toBeTruthy();
        });

        test.each(
            REQUIRED_DATABASE_VARS
        )('DatabaseClient.verifyConnectionSettings() - %s is missing', (missingVar) => {
            delete process.env[missingVar];

            expect(DatabaseClient.verifyConnectionSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_DATABASE_VARS
        )('DatabaseClient.verifyConnectionSettings() - %s is empty string', (missingVar) => {
            process.env[missingVar] = '';

            expect(DatabaseClient.verifyConnectionSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_DATABASE_VARS
        )('DatabaseClient.verifyConnectionSettings() - %s is undefined', (missingVar) => {
            process.env[missingVar] = undefined;

            expect(DatabaseClient.verifyConnectionSettings()).toBeFalsy();
        });

        test.each(
            REQUIRED_DATABASE_VARS
        )('DatabaseClient.verifyConnectionSettings() - %s is whitespace only', (missingVar) => {
            process.env[missingVar] = '   ';

            expect(DatabaseClient.verifyConnectionSettings()).toBeFalsy();
        });
    });

    describe('DatabaseClient.init()', () => {
        test('DatabaseClient.init() - successful initialization', async () => {
            const mockPool = {
                execute: vi.fn(),
                end: vi.fn().mockResolvedValue(undefined)
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

            expect(DatabaseClient.connectionPool).toBeNull();

            await DatabaseClient.init();

            expect(mysql.createPool).toHaveBeenCalledWith({
                host: TEST_ENV.MYSQL_HOST,
                port: TEST_ENV.MYSQL_PORT,
                user: TEST_ENV.MYSQL_USER,
                password: TEST_ENV.MYSQL_PASSWORD,
                database: TEST_ENV.MYSQL_DATABASE
            });

            expect(DatabaseClient.connectionPool).toBe(mockPool);
        });

        test.each(
            REQUIRED_DATABASE_VARS
        )('DatabaseClient.init() - invalid connection settings for %s', async (missingVar) => {
            const mockPool = {
                execute: vi.fn(),
                end: vi.fn().mockResolvedValue(undefined)
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

            expect(DatabaseClient.connectionPool).toBeNull();

            process.env[missingVar] = undefined;

            await expect(DatabaseClient.init()).rejects.toThrow('Invalid database connection settings.');

            expect(DatabaseClient.connectionPool).toBeNull();
        });

        test('DatabaseClient.init() - mysql.createPool error', async () => {
            expect(DatabaseClient.connectionPool).toBeNull();

            const mockErrorMessage = 'Connection failed';
            const mockError = new Error(mockErrorMessage);
            mysql.createPool = vi.fn().mockRejectedValue(mockError);

            await expect(DatabaseClient.init()).rejects.toThrow(mockErrorMessage);

            expect(DatabaseClient.connectionPool).toBeNull();
        });

        describe('DatabaseClient.init() - asynchronous execution', () => {
            test('DatabaseClient.init() - connection pool is only created once', async () => {
                const mockPool = {
                    execute: vi.fn(),
                    end: vi.fn().mockResolvedValue(undefined)
                };
                mysql.createPool = vi.fn().mockResolvedValue(mockPool);

                expect(DatabaseClient.connectionPool).toBeNull();

                // First initialization
                await DatabaseClient.init();

                expect(mysql.createPool).toHaveBeenCalledTimes(1);
                expect(DatabaseClient.connectionPool).toBe(mockPool);

                // Reset the mock to verify it's not called again
                mysql.createPool.mockClear();

                // Second initialization should not call createPool
                await DatabaseClient.init();

                expect(mysql.createPool).not.toHaveBeenCalled();
                expect(DatabaseClient.connectionPool).toBe(mockPool);
            });

            test('DatabaseClient.init() - concurrent execution', async () => {
                const mockPool = {
                    execute: vi.fn(),
                    end: vi.fn().mockResolvedValue(undefined)
                };
                mysql.createPool = vi.fn().mockResolvedValue(mockPool);

                expect(DatabaseClient.connectionPool).toBeNull();

                // Start two initializations simultaneously
                const initPromise1 = DatabaseClient.init();
                const initPromise2 = DatabaseClient.init();

                await Promise.all([initPromise1, initPromise2]);

                // Should only call createPool once
                expect(mysql.createPool).toHaveBeenCalledTimes(1);
                expect(DatabaseClient.connectionPool).toBe(mockPool);
            });

            test('DatabaseClient.init() - concurrent execution with error', async () => {
                expect(DatabaseClient.connectionPool).toBeNull();

                const mockErrorMessage = 'Connection failed';
                const mockError = new Error(mockErrorMessage);
                mysql.createPool = vi.fn().mockRejectedValue(mockError);

                // Start two initializations simultaneously
                const initPromise1 = DatabaseClient.init();
                const initPromise2 = DatabaseClient.init();

                await expect(Promise.all([initPromise1, initPromise2])).rejects.toThrow(mockErrorMessage);

                // Should only call createPool once
                expect(mysql.createPool).toHaveBeenCalledTimes(1);
                expect(DatabaseClient.connectionPool).toBeNull();
            });
        });
    });

    describe('DatabaseClient.closeConnectionPool()', () => {
        test('DatabaseClient.closeConnectionPool()', async () => {
            const mockPool = {
                execute: vi.fn(),
                end: vi.fn().mockResolvedValue(undefined)
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

            expect(DatabaseClient.connectionPool).toBeNull();

            await DatabaseClient.init();

            expect(DatabaseClient.connectionPool).toBe(mockPool);

            await DatabaseClient.closeConnectionPool();

            expect(DatabaseClient.connectionPool).toBeNull();
        });

        test('DatabaseClient.closeConnectionPool() - mysql.pool.end() error', async () => {
            const errorMessage = 'Close error';
            const mockErrorPool = {
                execute: vi.fn(),
                end: vi.fn().mockRejectedValue(new Error(errorMessage))
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockErrorPool);

            await DatabaseClient.init();

            expect(DatabaseClient.connectionPool).toBe(mockErrorPool);

            await expect(DatabaseClient.closeConnectionPool()).rejects.toThrow(errorMessage);

            expect(mockErrorPool.end).toHaveBeenCalledTimes(1);
            expect(DatabaseClient.connectionPool).toBeNull();
        });

        test('DatabaseClient.closeConnectionPool() - null connection pool', async () => {
            expect(DatabaseClient.connectionPool).toBeNull();

            await DatabaseClient.closeConnectionPool();

            expect(DatabaseClient.connectionPool).toBeNull();
        });

        describe('DatabaseClient.closeConnectionPool() - asynchronous execution', () => {
            test('DatabaseClient.closeConnectionPool() - waits for init promise before closing', async () => {
                const mockPool = {
                    execute: vi.fn(),
                    end: vi.fn().mockResolvedValue(undefined)
                };
                mysql.createPool = vi.fn().mockResolvedValue(mockPool);

                expect(DatabaseClient.connectionPool).toBeNull();

                const initPromise = DatabaseClient.init();
                const closePromise = DatabaseClient.closeConnectionPool();

                // Wait for both to complete
                await Promise.all([initPromise, closePromise]);

                expect(mockPool.end).toHaveBeenCalledTimes(1);
                expect(DatabaseClient.connectionPool).toBeNull();
            });

            test('DatabaseClient.closeConnectionPool() - concurrent execution', async () => {
                const mockPool = {
                    execute: vi.fn(),
                    end: vi.fn().mockResolvedValue(undefined)
                };
                mysql.createPool = vi.fn().mockResolvedValue(mockPool);

                expect(DatabaseClient.connectionPool).toBeNull();

                await DatabaseClient.init();

                expect(DatabaseClient.connectionPool).toBe(mockPool);

                // Start two closes simultaneously
                const closePromise1 = DatabaseClient.closeConnectionPool();
                const closePromise2 = DatabaseClient.closeConnectionPool();

                await Promise.all([closePromise1, closePromise2]);

                // Should only call end once
                expect(mockPool.end).toHaveBeenCalledTimes(1);
                expect(DatabaseClient.connectionPool).toBeNull();
            });

            test('DatabaseClient.closeConnectionPool() - concurrent execution with error', async () => {
                const mockErrorMessage = 'Close error';
                const mockErrorPool = {
                    execute: vi.fn(),
                    end: vi.fn().mockRejectedValue(new Error(mockErrorMessage))
                };
                mysql.createPool = vi.fn().mockResolvedValue(mockErrorPool);

                expect(DatabaseClient.connectionPool).toBeNull();

                await DatabaseClient.init();

                expect(DatabaseClient.connectionPool).toBe(mockErrorPool);

                // Start two closes simultaneously
                const closePromise1 = DatabaseClient.closeConnectionPool();
                const closePromise2 = DatabaseClient.closeConnectionPool();

                await expect(Promise.all([closePromise1, closePromise2])).rejects.toThrow(mockErrorMessage);

                // Should only call end once
                expect(mockErrorPool.end).toHaveBeenCalledTimes(1);
                expect(DatabaseClient.connectionPool).toBeNull();
            });
        });
    });
});
