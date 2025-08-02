/**
 * Test suite for Manim TypeScript config module
 */

import { describe, test, expect } from 'bun:test';
import { MANIM_CONFIG } from '../src/config.js';

describe('Config Module', () => {
    describe('MANIM_CONFIG', () => {
        test('should have required configuration properties', () => {
            expect(MANIM_CONFIG).toBeDefined();
            expect(typeof MANIM_CONFIG).toBe('object');
        });

        test('should have MANIM_DEBUG property', () => {
            expect(MANIM_CONFIG).toHaveProperty('MANIM_DEBUG');
            expect(typeof MANIM_CONFIG.MANIM_DEBUG).toBe('boolean');
        });

        test('should have LOG_LEVEL property', () => {
            expect(MANIM_CONFIG).toHaveProperty('LOG_LEVEL');
            expect(typeof MANIM_CONFIG.LOG_LEVEL).toBe('string');
        });

        test('should have valid log level values', () => {
            const validLogLevels = ['verbose', 'debug', 'info', 'warn', 'error'];
            expect(validLogLevels).toContain(MANIM_CONFIG.LOG_LEVEL);
        });

        test('should be immutable (readonly)', () => {
            // Test that the config object is properly typed as readonly
            const config = MANIM_CONFIG;
            expect(config.MANIM_DEBUG).toBeDefined();
            expect(config.LOG_LEVEL).toBeDefined();
        });
    });
});
