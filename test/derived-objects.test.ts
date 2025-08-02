/**
 * Test suite for Manim TypeScript derived objects (Vector, Line, Cone, Axes)
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { Vector } from '../src/object/derived/vector.js';
import { Line } from '../src/object/derived/line.js';
import { Cone } from '../src/object/derived/cone.js';
import { Axes } from '../src/object/derived/axes.js';
import { Colors } from '../src/colors.js';
import type { Color3 } from '../src/types.js';

describe('Derived Objects', () => {
    describe('Vector', () => {
        let vector: Vector;

        beforeEach(() => {
            vector = new Vector({
                CFrame: {
                    position: { x: 1, y: 2, z: 3 },
                    rotation: { x: 0, y: 0, z: 0 }
                },
                Color: Colors.BLUE_C,
                Visible: true
            });
        });

        test('should initialize with correct parameters', () => {
            expect(vector.params.CFrame?.position.x).toBe(1);
            expect(vector.params.CFrame?.position.y).toBe(2);
            expect(vector.params.CFrame?.position.z).toBe(3);
            expect(vector.params.Color).toBe(Colors.BLUE_C);
            expect(vector.params.Visible).toBe(true);
        });

        test('should construct without errors', () => {
            expect(() => vector._construct()).not.toThrow();
        });

        test('should tick without errors', () => {
            vector._construct();
            expect(() => vector._tick(0.016)).not.toThrow();
        });

        test('should handle parameter updates', () => {
            const newCFrame = {
                position: { x: 5, y: 6, z: 7 },
                rotation: { x: 0, y: 0, z: 0 }
            };
            
            vector.setParam('CFrame', newCFrame);
            expect(vector.params.CFrame).toEqual(newCFrame);
        });

        test('should handle color changes', () => {
            vector.setParam('Color', Colors.RED_C);
            expect(vector.params.Color).toBe(Colors.RED_C);
        });

        test('should handle visibility changes', () => {
            vector.setParam('Visible', false);
            expect(vector.params.Visible).toBe(false);
        });
    });

    describe('Line', () => {
        let line: Line;

        beforeEach(() => {
            line = new Line({
                CFrame: {
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 }
                },
                Length: 5,
                Color: Colors.GREEN_C,
                Visible: true
            });
        });

        test('should initialize with correct parameters', () => {
            expect(line.params.CFrame?.position.x).toBe(0);
            expect(line.params.Length).toBe(5);
            expect(line.params.Color).toBe(Colors.GREEN_C);
            expect(line.params.Visible).toBe(true);
        });

        test('should construct without errors', () => {
            expect(() => line._construct()).not.toThrow();
        });

        test('should tick without errors', () => {
            line._construct();
            expect(() => line._tick(0.016)).not.toThrow();
        });

        test('should handle length changes', () => {
            line.setParam('Length', 10);
            expect(line.params.Length).toBe(10);
        });

        test('should handle rotation changes', () => {
            const newCFrame = {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: Math.PI / 4 }
            };
            
            line.setParam('CFrame', newCFrame);
            expect(line.params.CFrame?.rotation.z).toBe(Math.PI / 4);
        });

        test('should handle default length', () => {
            const lineWithoutLength = new Line({
                CFrame: {
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 }
                },
                Length: 1, // Length is required
                Color: Colors.GREEN_C,
                Visible: true
            });
            
            expect(() => lineWithoutLength._construct()).not.toThrow();
        });
    });

    describe('Cone', () => {
        let cone: Cone;

        beforeEach(() => {
            cone = new Cone({
                CFrame: {
                    position: { x: 2, y: 3, z: 4 },
                    rotation: { x: 0, y: 0, z: 0 }
                },
                Radius: 1.5,
                Color: Colors.YELLOW_C,
                Visible: true
            });
        });

        test('should initialize with correct parameters', () => {
            expect(cone.params.CFrame?.position.x).toBe(2);
            expect(cone.params.CFrame?.position.y).toBe(3);
            expect(cone.params.CFrame?.position.z).toBe(4);
            expect(cone.params.Radius).toBe(1.5);
            expect(cone.params.Color).toBe(Colors.YELLOW_C);
            expect(cone.params.Visible).toBe(true);
        });

        test('should construct without errors', () => {
            expect(() => cone._construct()).not.toThrow();
        });

        test('should tick without errors', () => {
            cone._construct();
            expect(() => cone._tick(0.016)).not.toThrow();
        });

        test('should handle radius changes', () => {
            cone.setParam('Radius', 2.5);
            expect(cone.params.Radius).toBe(2.5);
        });

        test('should handle position changes', () => {
            const newCFrame = {
                position: { x: 10, y: 20, z: 30 },
                rotation: { x: 0, y: 0, z: 0 }
            };
            
            cone.setParam('CFrame', newCFrame);
            expect(cone.params.CFrame?.position.x).toBe(10);
            expect(cone.params.CFrame?.position.y).toBe(20);
            expect(cone.params.CFrame?.position.z).toBe(30);
        });

        test('should handle default radius', () => {
            const coneWithoutRadius = new Cone({
                CFrame: {
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 }
                },
                Color: Colors.YELLOW_C,
                Visible: true
            });
            
            expect(() => coneWithoutRadius._construct()).not.toThrow();
        });
    });

    describe('Axes', () => {
        let axes: Axes;

        beforeEach(() => {
            axes = new Axes({
                Sizes: [5, 4, 3],
                Colors: [Colors.RED_C, Colors.GREEN_C, Colors.BLUE_C],
                Origin: { x: 0, y: 0, z: 0 }
            });
        });

        test('should initialize with correct parameters', () => {
            expect(axes.params.Sizes).toEqual([5, 4, 3]);
            expect(axes.params.Colors).toEqual([Colors.RED_C, Colors.GREEN_C, Colors.BLUE_C]);
            expect(axes.params.Origin).toEqual({ x: 0, y: 0, z: 0 });
        });

        test('should construct without errors', () => {
            expect(() => axes._construct()).not.toThrow();
        });

        test('should tick without errors', () => {
            axes._construct();
            expect(() => axes._tick(0.016)).not.toThrow();
        });

        test('should handle size changes', () => {
            axes.setParam('Sizes', [10, 8, 6]);
            expect(axes.params.Sizes).toEqual([10, 8, 6]);
        });

        test('should handle origin changes', () => {
            const newOrigin = { x: 1, y: 2, z: 3 };
            axes.setParam('Origin', newOrigin);
            expect(axes.params.Origin).toEqual(newOrigin);
        });

        test('should handle color changes', () => {
            const newColors = [Colors.PURPLE_C, Colors.ORANGE, Colors.PINK] as [Color3, Color3, Color3];
            axes.setParam('Colors', newColors);
            expect(axes.params.Colors).toEqual(newColors);
        });

        test('should handle default values', () => {
            const axesWithDefaults = new Axes({
                Sizes: [1, 1, 1]
            });
            
            expect(() => axesWithDefaults._construct()).not.toThrow();
        });
    });

    describe('Object Interactions', () => {
        test('should handle multiple objects without conflicts', () => {
            const vector = new Vector({
                CFrame: { position: { x: 1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            const line = new Line({
                CFrame: { position: { x: 0, y: 1, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Length: 3,
                Color: Colors.RED_C,
                Visible: true
            });

            const cone = new Cone({
                CFrame: { position: { x: 0, y: 0, z: 1 }, rotation: { x: 0, y: 0, z: 0 } },
                Radius: 0.5,
                Color: Colors.GREEN_C,
                Visible: true
            });

            expect(() => {
                vector._construct();
                line._construct();
                cone._construct();
                
                vector._tick(0.016);
                line._tick(0.016);
                cone._tick(0.016);
            }).not.toThrow();
        });

        test('should maintain independent state', () => {
            const vector1 = new Vector({
                CFrame: { position: { x: 1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            const vector2 = new Vector({
                CFrame: { position: { x: 2, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.RED_C,
                Visible: true
            });

            vector1.setParam('Color', Colors.GREEN_C);
            
            expect(vector1.params.Color).toBe(Colors.GREEN_C);
            expect(vector2.params.Color).toBe(Colors.RED_C);
        });
    });
});
