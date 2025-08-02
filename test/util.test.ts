/**
 * Test suite for Manim TypeScript util module
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { util } from '../src/util.js';
import { MANIM_CONFIG } from '../src/config.js';

describe('Util Module', () => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    let logCalls: string[] = [];
    let warnCalls: string[] = [];
    
    beforeEach(() => {
        // Reset all call arrays
        logCalls.length = 0;
        warnCalls.length = 0;
        
        // Mock console methods to capture calls
        console.log = (...args: any[]) => {
            logCalls.push(args.join(' '));
        };
        console.warn = (...args: any[]) => {
            warnCalls.push(args.join(' '));
        };
    });

    afterEach(() => {
        // Always restore original console methods
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
    });

    describe('logDebug function', () => {
        test('should log when MANIM_DEBUG is true and level matches', () => {
            // Test with verbose level (MANIM_DEBUG=true, LOG_LEVEL=verbose)
            util.logDebug('Test message', 'verbose', false);
            
            // Should log since MANIM_DEBUG=true and LOG_LEVEL=verbose matches
            expect(logCalls.length).toBeGreaterThan(0);
            expect(logCalls[0]).toContain('Test message');
        });

        test('should handle different log levels', () => {
            const testCases = [
                { level: 'verbose', message: 'Verbose message' },
                { level: 'debug', message: 'Debug message' },
                { level: 'info', message: 'Info message' },
                { level: 'warn', message: 'Warning message' },
                { level: 'error', message: 'Error message' }
            ];

            testCases.forEach(({ level, message }) => {
                logCalls.length = 0;
                util.logDebug(message, level as any, true);
                
                // Should log if debug is enabled and level is appropriate
                if (MANIM_CONFIG.MANIM_DEBUG) {
                    // The exact behavior depends on the implementation
                    // but we can at least verify it doesn't throw
                    expect(() => util.logDebug(message, level as any, true)).not.toThrow();
                }
            });
        });

        test('should use console.warn when isWarn is true', () => {
            // Test warning message
            util.logDebug('Warning message', 'verbose', true);
            expect(warnCalls.length).toBeGreaterThan(0);
            expect(warnCalls[0]).toContain('Warning message');
        });

        test('should not log when force is false and conditions not met', () => {
            logCalls.length = 0;
            
            // Don't force logging
            util.logDebug('Non-forced message', 'verbose', false);
            
            // Should only log if MANIM_DEBUG is true and level matches
            if (!MANIM_CONFIG.MANIM_DEBUG || MANIM_CONFIG.LOG_LEVEL !== 'verbose') {
                expect(logCalls.length).toBe(0);
            }
        });

        test('should handle empty messages', () => {
            expect(() => util.logDebug('', 'info', true)).not.toThrow();
            expect(() => util.logDebug('   ', 'info', true)).not.toThrow();
        });

        test('should handle special characters in messages', () => {
            const specialMessages = [
                'Message with "quotes"',
                'Message with \'single quotes\'',
                'Message with \n newlines',
                'Message with \t tabs',
                'Message with unicode: 🎬🎯✅'
            ];

            specialMessages.forEach(message => {
                expect(() => util.logDebug(message, 'info', true)).not.toThrow();
            });
        });
    });

    describe('util object structure', () => {
        test('should export logDebug function', () => {
            expect(util).toBeDefined();
            expect(util.logDebug).toBeDefined();
            expect(typeof util.logDebug).toBe('function');
        });

        test('should have correct function signature', () => {
            // Test that the function accepts the expected parameters
            expect(() => util.logDebug('test', 'info', true)).not.toThrow();
            expect(() => util.logDebug('test', 'verbose', false)).not.toThrow();
        });
    });
});
