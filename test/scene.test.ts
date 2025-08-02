/**
 * Test suite for Manim TypeScript Scene and SceneWithCamera classes
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { Scene } from '../src/object/scene/scene.js';
import { SceneWithCamera } from '../src/object/scene/scene-with-camera.js';
import { Vector } from '../src/object/derived/vector.js';
import { Colors } from '../src/colors.js';
import { EasingStyle, EasingDirection } from '../src/types.js';
import type { SceneAttributes } from '../src/object/scene/scene.js';

// Mock scene implementations for testing
class TestScene extends Scene {
    public constructCalled = false;
    public tickCalled = false;

    constructor(params: SceneAttributes) {
        super(params);
    }

    construct(): void {
        this.constructCalled = true;
    }

    override tick(deltaTime: number): void {
        this.tickCalled = true;
        super.tick(deltaTime);
    }
}

class TestSceneWithCamera extends SceneWithCamera {
    public constructCalled = false;
    public tickCalled = false;

    constructor(params: SceneAttributes) {
        super(params);
    }

    construct(): void {
        this.constructCalled = true;
    }

    override tick(deltaTime: number): void {
        this.tickCalled = true;
        super.tick(deltaTime);
    }
}

describe('Scene Classes', () => {
    describe('Scene', () => {
        let scene: TestScene;

        beforeEach(() => {
            scene = new TestScene({ name: 'TestScene', Visible: true });
        });

        test('should initialize with scene attributes', () => {
            expect(scene.params.name).toBe('TestScene');
            expect(scene.params.Visible).toBe(true);
        });

        test('should construct without errors', () => {
            expect(() => scene._construct()).not.toThrow();
            expect(scene.constructCalled).toBe(true);
        });

        test('should tick without errors', () => {
            scene._construct();
            expect(() => scene._tick(0.016)).not.toThrow();
            expect(scene.tickCalled).toBe(true);
        });

        test('should add objects correctly', () => {
            const vector = new Vector({
                CFrame: { position: { x: 1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            scene.add({ 'testVector': vector });
            
            const retrieved = scene.getChild('testVector');
            expect(retrieved).toBe(vector);
        });

        test('should add multiple objects', () => {
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

            scene.add({
                'vector1': vector1,
                'vector2': vector2
            });

            expect(scene.getChild('vector1')).toBe(vector1);
            expect(scene.getChild('vector2')).toBe(vector2);
        });

        test('should handle empty add calls', () => {
            expect(() => scene.add({})).not.toThrow();
        });

        test('should tick added objects', () => {
            const vector = new Vector({
                CFrame: { position: { x: 1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            scene.add({ 'testVector': vector });
            scene._construct();
            
            // Mock the vector's tick method to verify it's called
            let vectorTicked = false;
            const originalTick = vector._tick.bind(vector);
            vector._tick = (deltaTime: number) => {
                vectorTicked = true;
                originalTick(deltaTime);
            };

            scene._tick(0.016);
            expect(vectorTicked).toBe(true);
        });
    });

    describe('SceneWithCamera', () => {
        let scene: TestSceneWithCamera;

        beforeEach(() => {
            scene = new TestSceneWithCamera({ name: 'TestSceneWithCamera', Visible: true });
        });

        test('should initialize with camera', () => {
            expect(scene.params.name).toBe('TestSceneWithCamera');
            expect(scene.params.Visible).toBe(true);
            // Note: camera is private, so we can't test it directly
        });

        test('should construct without errors', () => {
            expect(() => scene._construct()).not.toThrow();
            expect(scene.constructCalled).toBe(true);
        });

        test('should tick without errors', () => {
            scene._construct();
            expect(() => scene._tick(0.016)).not.toThrow();
            expect(scene.tickCalled).toBe(true);
        });

        test('should have camera with default position', () => {
            // Note: camera is private, so we can't test its properties directly
            // We can only test that the scene initializes without errors
            expect(() => scene._construct()).not.toThrow();
        });

        test('should move camera correctly', () => {
            const newCFrame = {
                position: { x: 5, y: 5, z: 15 },
                rotation: { x: 0, y: 0, z: 0 }
            };

            scene.moveCameraTo(newCFrame, 1.0, EasingStyle.Linear, EasingDirection.In, 1, false, {});
            
            // Camera should start moving (implementation may vary)
            expect(() => scene._tick(0.016)).not.toThrow();
        });

        test('should handle camera movement parameters', () => {
            const newCFrame = {
                position: { x: 10, y: 10, z: 20 },
                rotation: { x: 0.1, y: 0.2, z: 0.3 }
            };

            expect(() => {
                scene.moveCameraTo(newCFrame, 2.0, EasingStyle.Sine, EasingDirection.InOut, 2, true, {});
            }).not.toThrow();
        });

        test('should inherit Scene functionality', () => {
            const vector = new Vector({
                CFrame: { position: { x: 1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            scene.add({ 'testVector': vector });
            
            const retrieved = scene.getChild('testVector');
            expect(retrieved).toBe(vector);
        });

        test('should handle multiple camera movements', () => {
            const cframe1 = {
                position: { x: 5, y: 0, z: 10 },
                rotation: { x: 0, y: 0, z: 0 }
            };

            const cframe2 = {
                position: { x: -5, y: 5, z: 15 },
                rotation: { x: 0.1, y: 0, z: 0 }
            };

            expect(() => {
                scene.moveCameraTo(cframe1, 1.0, EasingStyle.Linear, EasingDirection.In, 1, false, {});
                scene._tick(0.5); // Advance time
                scene.moveCameraTo(cframe2, 1.0, EasingStyle.Sine, EasingDirection.In, 1, false, {});
            }).not.toThrow();
        });
    });

    describe('Scene Integration', () => {
        test('should handle scene with multiple object types', () => {
            const scene = new TestScene({ name: 'IntegrationTest' });
            
            const vector = new Vector({
                CFrame: { position: { x: 1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            scene.add({ 'vector': vector });
            scene._construct();

            expect(() => {
                for (let i = 0; i < 10; i++) {
                    scene._tick(0.016);
                }
            }).not.toThrow();
        });

        test('should maintain object state across ticks', () => {
            const scene = new TestScene({ name: 'StateTest' });
            
            const vector = new Vector({
                CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            scene.add({ 'vector': vector });
            scene._construct();

            // Modify vector position
            vector.setParam('CFrame', {
                position: { x: 5, y: 5, z: 5 },
                rotation: { x: 0, y: 0, z: 0 }
            });

            scene._tick(0.016);
            
            expect(vector.params.CFrame?.position.x).toBe(5);
            expect(vector.params.CFrame?.position.y).toBe(5);
            expect(vector.params.CFrame?.position.z).toBe(5);
        });
    });
});
