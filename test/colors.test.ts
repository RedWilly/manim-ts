/**
 * Test suite for Manim TypeScript colors module
 */

import { describe, test, expect } from 'bun:test';
import { Colors } from '../src/colors.js';
import type { Color3 } from '../src/types.js';

describe('Colors Module', () => {
    describe('Color Constants', () => {
        test('should have all blue variants', () => {
            expect(Colors.BLUE_E).toBeDefined();
            expect(Colors.BLUE_D).toBeDefined();
            expect(Colors.BLUE_C).toBeDefined();
            expect(Colors.BLUE_B).toBeDefined();
            expect(Colors.BLUE_A).toBeDefined();
        });

        test('should have valid RGB values for all colors', () => {
            const testColor = (color: Color3) => {
                expect(color.r).toBeGreaterThanOrEqual(0);
                expect(color.r).toBeLessThanOrEqual(1);
                expect(color.g).toBeGreaterThanOrEqual(0);
                expect(color.g).toBeLessThanOrEqual(1);
                expect(color.b).toBeGreaterThanOrEqual(0);
                expect(color.b).toBeLessThanOrEqual(1);
            };

            testColor(Colors.BLUE_C);
            testColor(Colors.RED_C);
            testColor(Colors.GREEN_C);
            testColor(Colors.YELLOW_C);
            testColor(Colors.WHITE);
            testColor(Colors.BLACK);
        });

        test('should have expected values for common colors', () => {
            // WHITE should be (1, 1, 1)
            expect(Colors.WHITE.r).toBe(1);
            expect(Colors.WHITE.g).toBe(1);
            expect(Colors.WHITE.b).toBe(1);

            // BLACK should be (0, 0, 0)
            expect(Colors.BLACK.r).toBe(0);
            expect(Colors.BLACK.g).toBe(0);
            expect(Colors.BLACK.b).toBe(0);
        });
    });

    describe('fromHex function', () => {
        test('should convert hex to Color3 correctly', () => {
            // Access fromHex through Colors object if it's exported
            // Note: fromHex might not be directly exported, so we test through known hex values
            
            // Test that BLUE_C matches expected hex value #58C4DD
            const blueC = Colors.BLUE_C;
            expect(blueC.r).toBeCloseTo(0.345, 2);
            expect(blueC.g).toBeCloseTo(0.769, 2);
            expect(blueC.b).toBeCloseTo(0.867, 2);
        });
    });

    describe('colorGradient function', () => {
        test('should create gradient between colors', () => {
            const colors = [Colors.RED_C, Colors.BLUE_C];
            const gradient = Colors.colorGradient(colors, 3);
            
            expect(gradient).toHaveLength(3);
            expect(gradient[0]).toEqual(Colors.RED_C);
            expect(gradient[2]).toEqual(Colors.BLUE_C);
            
            // Middle color should be a blend
            const middle = gradient[1]!;
            expect(middle.r).toBeGreaterThan(0);
            expect(middle.g).toBeGreaterThan(0);
            expect(middle.b).toBeGreaterThan(0);
        });

        test('should handle edge cases', () => {
            // Empty gradient
            const empty = Colors.colorGradient([Colors.RED_C], 0);
            expect(empty).toHaveLength(0);

            // Single color
            const single = Colors.colorGradient([Colors.RED_C], 1);
            expect(single).toHaveLength(1);
            expect(single[0]).toEqual(Colors.RED_C);
        });
    });

    // Note: linearSpace is not exported from Colors, removing these tests

    describe('Color Collections', () => {
        test('should have all color families', () => {
            // Blues
            expect(Colors.BLUE_E).toBeDefined();
            expect(Colors.BLUE_D).toBeDefined();
            expect(Colors.BLUE_C).toBeDefined();
            expect(Colors.BLUE_B).toBeDefined();
            expect(Colors.BLUE_A).toBeDefined();

            // Reds
            expect(Colors.RED_E).toBeDefined();
            expect(Colors.RED_D).toBeDefined();
            expect(Colors.RED_C).toBeDefined();
            expect(Colors.RED_B).toBeDefined();
            expect(Colors.RED_A).toBeDefined();

            // Greens
            expect(Colors.GREEN_E).toBeDefined();
            expect(Colors.GREEN_D).toBeDefined();
            expect(Colors.GREEN_C).toBeDefined();
            expect(Colors.GREEN_B).toBeDefined();
            expect(Colors.GREEN_A).toBeDefined();
        });

        test('should have monochrome colors', () => {
            expect(Colors.WHITE).toBeDefined();
            expect(Colors.BLACK).toBeDefined();
            expect(Colors.GREY_A).toBeDefined();
            expect(Colors.GREY_C).toBeDefined();
            expect(Colors.GREY_E).toBeDefined();
        });
    });
});
