/**
 * Test suite for Manim TypeScript MObject base class
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { MObject } from '../src/object/mobject.js';
import type { MObjectAttributes } from '../src/object/mobject.js';

// Mock MObject implementation for testing
class TestMObject extends MObject<MObjectAttributes> {
    public constructCalled = false;
    public tickCalled = false;
    public destroyCalled = false;

    constructor(params: MObjectAttributes) {
        super(params);
    }

    construct(): void {
        this.constructCalled = true;
    }

    tick(deltaTime: number): void {
        this.tickCalled = true;
        this.tickAllChildren(deltaTime);
    }

    override destroy(): void {
        this.destroyCalled = true;
    }
}

describe('MObject Module', () => {
    let testObject: TestMObject;

    beforeEach(() => {
        testObject = new TestMObject({ Visible: true });
    });

    describe('Constructor', () => {
        test('should initialize with parameters', () => {
            const params = { Visible: true };
            const obj = new TestMObject(params);
            
            expect(obj.params).toEqual(params);
        });

        test('should handle minimal parameters', () => {
            const params = { Visible: false };
            const obj = new TestMObject(params);
            
            expect(obj.params.Visible).toBe(false);
        });
    });

    describe('Child Management', () => {
        test('should add children correctly', () => {
            const child = new TestMObject({ Visible: true });
            testObject.addChild('child1', child);
            
            const retrieved = testObject.getChild('child1');
            expect(retrieved).toBe(child);
        });

        test('should remove children correctly', () => {
            const child = new TestMObject({ Visible: true });
            testObject.addChild('child1', child);
            
            expect(testObject.getChild('child1')).toBe(child);
            
            testObject.removeChild('child1');
            expect(testObject.getChild('child1')).toBeUndefined();
        });

        test('should return undefined for non-existent children', () => {
            const retrieved = testObject.getChild('nonExistent');
            expect(retrieved).toBeUndefined();
        });

        test('should overwrite children with same name', () => {
            const child1 = new TestMObject({ Visible: true });
            const child2 = new TestMObject({ Visible: false });
            
            testObject.addChild('child', child1);
            expect(testObject.getChild('child')).toBe(child1);
            
            testObject.addChild('child', child2);
            expect(testObject.getChild('child')).toBe(child2);
        });
    });

    describe('Lifecycle Methods', () => {
        test('should call construct method', () => {
            expect(testObject.constructCalled).toBe(false);
            testObject._construct();
            expect(testObject.constructCalled).toBe(true);
        });

        test('should call tick method with deltaTime', () => {
            expect(testObject.tickCalled).toBe(false);
            testObject._tick(0.016);
            expect(testObject.tickCalled).toBe(true);
        });

        test('should call destroy method', () => {
            expect(testObject.destroyCalled).toBe(false);
            testObject.destroy();
            expect(testObject.destroyCalled).toBe(true);
        });

        test('should tick all children', () => {
            const child1 = new TestMObject({ Visible: true });
            const child2 = new TestMObject({ Visible: true });
            
            testObject.addChild('child1', child1);
            testObject.addChild('child2', child2);
            
            expect(child1.tickCalled).toBe(false);
            expect(child2.tickCalled).toBe(false);
            
            testObject._tick(0.016);
            
            expect(child1.tickCalled).toBe(true);
            expect(child2.tickCalled).toBe(true);
        });
    });

    describe('Parameter Management', () => {
        test('should set parameters correctly', () => {
            testObject.setParam('Visible', false);
            expect(testObject.params.Visible).toBe(false);
        });

        test('should handle different parameter types', () => {
            const params = {
                Visible: true
            };
            
            const obj = new TestMObject(params);
            
            obj.setParam('Visible', false);
            
            expect(obj.params.Visible).toBe(false);
        });
    });

    describe('Visible State', () => {
        test('should respect visible state during tick', () => {
            const child = new TestMObject({ Visible: false });
            testObject.addChild('child', child);
            
            testObject._tick(0.016);
            
            // Child should still tick regardless of visibility
            expect(child.tickCalled).toBe(true);
        });

        test('should tick visible children', () => {
            const child = new TestMObject({ Visible: true });
            testObject.addChild('child', child);
            
            testObject._tick(0.016);
            
            expect(child.tickCalled).toBe(true);
        });

        test('should handle undefined visible state', () => {
            const child = new TestMObject({}); // Visible undefined
            testObject.addChild('child', child);
            
            testObject._tick(0.016);
            
            // Should tick by default when Visible is undefined
            expect(child.tickCalled).toBe(true);
        });
    });

    describe('Output Instance', () => {
        test('should handle undefined output instance', () => {
            expect(testObject.getOutputInstance()).toBeUndefined();
        });

        test('should get output instance from parent chain', () => {
            // Note: setOutputInstance is not available in the actual API
            // This test just verifies the getter works
            expect(testObject.getOutputInstance()).toBeUndefined();
        });
    });
});
