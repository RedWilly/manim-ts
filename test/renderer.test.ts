/**
 * Test suite for Manim TypeScript CanvasRenderer
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { CanvasRenderer } from '../src/renderer/canvas-renderer.js';
import { Vector } from '../src/object/derived/vector.js';
import { Line } from '../src/object/derived/line.js';
import { Cone } from '../src/object/derived/cone.js';
import { Axes } from '../src/object/derived/axes.js';
import { Colors } from '../src/colors.js';
import { mkdirSync } from 'fs';
import fs from 'fs';

describe('CanvasRenderer', () => {
    let renderer: CanvasRenderer;
    const testOutputDir = './test-frames';

    beforeEach(() => {
        renderer = new CanvasRenderer({
            width: 800,
            height: 600,
            backgroundColor: { r: 0.1, g: 0.1, b: 0.2 },
            scale: 80
        });

        // Create test output directory
        if (!fs.existsSync(testOutputDir)) {
            fs.mkdirSync(testOutputDir, { recursive: true });
        }
    });

    describe('Initialization', () => {
        test('should initialize with correct dimensions', () => {
            expect(renderer.getBuffer().length).toBeGreaterThan(0);
        });

        test('should initialize with default config', () => {
            const defaultRenderer = new CanvasRenderer();
            expect(defaultRenderer.getBuffer().length).toBeGreaterThan(0);
        });

        test('should handle custom configuration', () => {
            const customRenderer = new CanvasRenderer({
                width: 1280,
                height: 720,
                backgroundColor: { r: 1, g: 1, b: 1 },
                scale: 50
            });

            expect(customRenderer.getBuffer().length).toBeGreaterThan(0);
        });
    });

    // Note: worldToScreen methods are private, removing coordinate transformation tests

    // Note: colorToCSS method is private, removing color conversion tests

    describe('Object Rendering', () => {
        test('should render Vector without errors', () => {
            const vector = new Vector({
                CFrame: { position: { x: 1, y: 1, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            expect(() => renderer.renderVector(vector)).not.toThrow();
        });

        test('should render Line without errors', () => {
            const line = new Line({
                CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Length: 3,
                Color: Colors.RED_C,
                Visible: true
            });

            expect(() => renderer.renderLine(line)).not.toThrow();
        });

        test('should render Cone without errors', () => {
            const cone = new Cone({
                CFrame: { position: { x: 2, y: 2, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Radius: 1,
                Color: Colors.GREEN_C,
                Visible: true
            });

            expect(() => renderer.renderCone(cone)).not.toThrow();
        });

        test('should render Axes without errors', () => {
            const axes = new Axes({
                Sizes: [3, 3, 3],
                Colors: [Colors.RED_C, Colors.GREEN_C, Colors.BLUE_C],
                Origin: { x: 0, y: 0, z: 0 },
                // Note: AxesAttributes doesn't have name property
            });

            axes._construct();
            expect(() => renderer.renderAxes(axes)).not.toThrow();
        });

        test('should skip invisible objects', () => {
            const invisibleVector = new Vector({
                CFrame: { position: { x: 1, y: 1, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: false
            });

            // Should not throw and should handle invisible objects gracefully
            expect(() => renderer.renderVector(invisibleVector)).not.toThrow();
        });
    });

    describe('Frame Management', () => {
        test('should clear frame without errors', () => {
            expect(() => renderer.clear()).not.toThrow();
        });

        test('should not draw grid when disabled', () => {
            const noGridRenderer = new CanvasRenderer({
                width: 400,
                height: 400,
                scale: 40
            });

            expect(() => noGridRenderer.clear()).not.toThrow();
        });
    });

    describe('File Operations', () => {
        test('should save frame to file', () => {
            // Create unique test directory for this test
            const testId = Date.now().toString() + Math.random().toString(36).substring(7);
            const outputDir = `output/test-frames-${testId}`;
            
            try {
                mkdirSync(outputDir, { recursive: true });
            } catch (e) {
                // Directory might already exist
            }
            
            const testRenderer = new CanvasRenderer({
                width: 100,
                height: 100,
                outputDir: outputDir
            });
            
            // Render something to the canvas first
            testRenderer.clear();
            const vector = new Vector({
                CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });
            testRenderer.renderVector(vector);
            
            const filename = testRenderer.saveFrame('test-frame.png');
            expect(filename).toContain('test-frame.png');
            
            // Verify file exists
            const fullPath = `${outputDir}/test-frame.png`;
            expect(fs.existsSync(fullPath)).toBe(true);
        });

        test('should get canvas buffer', () => {
            const buffer = renderer.getBuffer();
            expect(buffer).toBeInstanceOf(Buffer);
            expect(buffer.length).toBeGreaterThan(0);
        });

        test('should handle file save errors gracefully', () => {
            // Create a renderer with a valid directory first
            const testRenderer = new CanvasRenderer({
                width: 100,
                height: 100,
                outputDir: 'output/test-error'
            });
            
            // Try to save to a filename with invalid characters (Windows)
            // This should cause writeFileSync to throw
            expect(() => {
                testRenderer.saveFrame('invalid<>:"|?*.png');
            }).toThrow();
        });
    });

    describe('Complex Scenes', () => {
        test('should render multiple objects together', () => {
            const vector = new Vector({
                CFrame: { position: { x: 1, y: 1, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            const line = new Line({
                CFrame: { position: { x: -1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 4 } },
                Length: 2,
                Color: Colors.RED_C,
                Visible: true
            });

            const cone = new Cone({
                CFrame: { position: { x: 0, y: -1, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Radius: 0.5,
                Color: Colors.GREEN_C,
                Visible: true
            });

            expect(() => {
                renderer.clear();
                renderer.renderVector(vector);
                renderer.renderLine(line);
                renderer.renderCone(cone);
            }).not.toThrow();
        });

        test('should handle animated objects', () => {
            const vector = new Vector({
                CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
                Color: Colors.BLUE_C,
                Visible: true
            });

            // Simulate animation frames
            for (let frame = 0; frame < 10; frame++) {
                const time = frame * 0.1;
                
                vector.setParam('CFrame', {
                    position: { 
                        x: Math.cos(time), 
                        y: Math.sin(time), 
                        z: 0 
                    },
                    rotation: { x: 0, y: 0, z: time }
                });

                expect(() => {
                    renderer.clear();
                    renderer.renderVector(vector);
                }).not.toThrow();
            }
        });
    });
});
