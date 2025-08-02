/**
 * Test suite for Manim TypeScript types
 */

import { describe, test, expect } from 'bun:test';
import type { Color3, Vector3, CFrame, Instance, Camera, Tween } from '../src/types.js';

describe('Types Module', () => {
    describe('Color3', () => {
        test('should have valid RGB values', () => {
            const color: Color3 = { r: 0.5, g: 0.7, b: 0.9 };
            
            expect(color.r).toBeGreaterThanOrEqual(0);
            expect(color.r).toBeLessThanOrEqual(1);
            expect(color.g).toBeGreaterThanOrEqual(0);
            expect(color.g).toBeLessThanOrEqual(1);
            expect(color.b).toBeGreaterThanOrEqual(0);
            expect(color.b).toBeLessThanOrEqual(1);
        });

        test('should accept edge values', () => {
            const black: Color3 = { r: 0, g: 0, b: 0 };
            const white: Color3 = { r: 1, g: 1, b: 1 };
            
            expect(black.r).toBe(0);
            expect(white.r).toBe(1);
        });
    });

    describe('Vector3', () => {
        test('should have x, y, z coordinates', () => {
            const vector: Vector3 = { x: 1, y: 2, z: 3 };
            
            expect(vector.x).toBe(1);
            expect(vector.y).toBe(2);
            expect(vector.z).toBe(3);
        });

        test('should handle negative coordinates', () => {
            const vector: Vector3 = { x: -1, y: -2, z: -3 };
            
            expect(vector.x).toBe(-1);
            expect(vector.y).toBe(-2);
            expect(vector.z).toBe(-3);
        });
    });

    describe('CFrame', () => {
        test('should have position and rotation', () => {
            const cframe: CFrame = {
                position: { x: 1, y: 2, z: 3 },
                rotation: { x: 0, y: 0, z: 0 }
            };
            
            expect(cframe.position.x).toBe(1);
            expect(cframe.rotation.z).toBe(0);
        });
    });

    describe('Instance', () => {
        test('should have required properties', () => {
            const instance: Instance = {
                Name: "TestInstance",
                Parent: undefined,
                Destroy: () => {}
            };
            
            expect(instance.Name).toBe("TestInstance");
            expect(instance.Parent).toBeUndefined();
            expect(typeof instance.Destroy).toBe('function');
        });
    });

    describe('Camera', () => {
        test('should extend Instance with CFrame and camera properties', () => {
            const camera: Camera = {
                Name: "TestCamera",
                Parent: undefined,
                Destroy: () => {},
                CFrame: {
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 }
                },
                FieldOfView: 70,
                Focus: undefined
            };
            
            expect(camera.Name).toBe("TestCamera");
            expect(camera.CFrame.position.x).toBe(0);
            expect(camera.FieldOfView).toBe(70);
        });
    });

    describe('Tween', () => {
        test('should have tween methods', () => {
            const tween: Tween = {
                Play: () => {},
                Pause: () => {},
                Cancel: () => {},
                Completed: {
                    Once: (_callback: () => void) => {},
                    Connect: (_callback: () => void) => {}
                }
            };
            
            expect(typeof tween.Play).toBe('function');
            expect(typeof tween.Pause).toBe('function');
            expect(typeof tween.Cancel).toBe('function');
            expect(typeof tween.Completed.Once).toBe('function');
            expect(typeof tween.Completed.Connect).toBe('function');
        });
    });
});
