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

    afterEach(() => {
        vi.clearAllMocks();
        process.env = ORIGINAL_ENV;
        return DatabaseClient.closeConnectionPool();
    });

    afterAll(() => {
        vi.clearAllMocks();
        vi.resetModules();
        process.env = ORIGINAL_ENV;
        return DatabaseClient.closeConnectionPool();
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
            expect(DatabaseClient.connectionPool).toBeNull();

            const mockPool = { execute: vi.fn(), end: vi.fn().mockResolvedValue(undefined) };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

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
        afterEach(async () => {
            await DatabaseClient.closeConnectionPool();
        });

        test('DatabaseClient.init() - successful initialization', async () => {
            expect(DatabaseClient.connectionPool).toBeNull();

            const mockPool = { execute: vi.fn(), end: vi.fn().mockResolvedValue(undefined) };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

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
                expect(DatabaseClient.connectionPool).toBeNull();

                const mockPool = { execute: vi.fn(), end: vi.fn().mockResolvedValue(undefined) };
                mysql.createPool = vi.fn().mockResolvedValue(mockPool);

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
                expect(DatabaseClient.connectionPool).toBeNull();

                const mockPool = { execute: vi.fn(), end: vi.fn().mockResolvedValue(undefined) };
                mysql.createPool = vi.fn().mockResolvedValue(mockPool);

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

                await expect(Promise.all([initPromise1, initPromise2])).rejects.toThrow('Connection failed');

                // Should only call createPool once
                expect(mysql.createPool).toHaveBeenCalledTimes(1);
                expect(DatabaseClient.connectionPool).toBeNull();
            });
        });
    });

    describe('closeConnectionPool()', () => {
        beforeEach(() => {
            process.env = { ...TEST_DATABASE_ENV };
            vi.clearAllMocks();
        });

        afterEach(async () => {
            process.env = ORIGINAL_ENV;
            vi.clearAllMocks();
            // Ensure cleanup even if test fails
            try {
                await DatabaseClient.closeConnectionPool();
            } catch (error) {
                // Ignore cleanup errors
            }
        });

        test('closeConnectionPool() - successfully closes pool', async () => {
            const mockPool = {
                execute: vi.fn(),
                end: vi.fn().mockResolvedValue(undefined)
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

            // Initialize first
            await DatabaseClient.init();
            expect(DatabaseClient.connectionPool).toBe(mockPool);

            // Then close
            await DatabaseClient.closeConnectionPool();

            expect(mockPool.end).toHaveBeenCalledTimes(1);
            expect(DatabaseClient.connectionPool).toBeNull();
        });

        test('closeConnectionPool() - handles pool.end() error', async () => {
            const mockPool = {
                execute: vi.fn(),
                end: vi.fn().mockRejectedValue(new Error('Close error'))
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

            // Mock console.error to verify error logging
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // Initialize first
            await DatabaseClient.init();
            expect(DatabaseClient.connectionPool).toBe(mockPool);

            // Then close - should not throw despite end() error
            await DatabaseClient.closeConnectionPool();

            expect(mockPool.end).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(new Error('Close error'));
            expect(DatabaseClient.connectionPool).toBeNull();

            consoleSpy.mockRestore();
        });

        test('closeConnectionPool() - does nothing when pool is null', async () => {
            expect(DatabaseClient.connectionPool).toBeNull();

            // Should not throw
            await DatabaseClient.closeConnectionPool();

            expect(DatabaseClient.connectionPool).toBeNull();
        });

        test('closeConnectionPool() - waits for init promise before closing', async () => {
            const mockPool = {
                execute: vi.fn(),
                end: vi.fn().mockResolvedValue(undefined)
            };
            mysql.createPool = vi.fn().mockResolvedValue(mockPool);

            // Start initialization but don't await it
            const initPromise = DatabaseClient.init();

            // Start close immediately
            const closePromise = DatabaseClient.closeConnectionPool();

            // Wait for both to complete
            await Promise.all([initPromise, closePromise]);

            expect(mockPool.end).toHaveBeenCalledTimes(1);
            expect(DatabaseClient.connectionPool).toBeNull();
        });
    });
});
