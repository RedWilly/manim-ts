/**
 * Test suite for Manim TypeScript registry module
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { Registry } from '../src/registry.js';
import { Scene } from '../src/object/scene/scene.js';
import { MObject } from '../src/object/mobject.js';

// Mock scene class for testing
class MockScene extends Scene {
    constructor() {
        super({ name: 'MockScene' });
    }

    construct(): void {
        // Mock implementation
    }

    override tick(deltaTime: number): void {
        super.tick(deltaTime);
        // Mock implementation
    }
}

// Mock ticker for testing - using TestMObject instead of plain object
class MockTicker extends MObject {
    constructor() {
        super({ Visible: true });
    }

    construct(): void {
        // Mock implementation
    }

    tick(_deltaTime: number): void {
        // Mock implementation
    }
}

describe('Registry Module', () => {
    beforeEach(() => {
        // Clear registry before each test
        Registry.clearScenes();
        Registry.clearTickers();
    });

    describe('Scene Management', () => {
        test('should register and retrieve scenes', () => {
            const scene = new MockScene();
            Registry.setScene('testScene', scene);
            
            const retrieved = Registry.getScene('testScene');
            expect(retrieved).toBe(scene);
        });

        test('should return undefined for non-existent scenes', () => {
            const retrieved = Registry.getScene('nonExistentScene');
            expect(retrieved).toBeUndefined();
        });

        test('should remove scenes', () => {
            const scene = new MockScene();
            Registry.setScene('testScene', scene);
            
            expect(Registry.getScene('testScene')).toBe(scene);
            
            Registry.removeScene('testScene');
            expect(Registry.getScene('testScene')).toBeUndefined();
        });

        test('should get all scenes', () => {
            const scene1 = new MockScene();
            const scene2 = new MockScene();
            
            Registry.setScene('scene1', scene1);
            Registry.setScene('scene2', scene2);
            
            const allScenes = Registry.getAllScenes();
            expect(allScenes.size).toBe(2);
            expect(allScenes.get('scene1')).toBe(scene1);
            expect(allScenes.get('scene2')).toBe(scene2);
        });

        test('should clear all scenes', () => {
            const scene1 = new MockScene();
            const scene2 = new MockScene();
            
            Registry.setScene('scene1', scene1);
            Registry.setScene('scene2', scene2);
            
            expect(Registry.getAllScenes().size).toBe(2);
            
            Registry.clearScenes();
            expect(Registry.getAllScenes().size).toBe(0);
        });

        test('should overwrite existing scenes with same name', () => {
            const scene1 = new MockScene();
            const scene2 = new MockScene();
            
            Registry.setScene('testScene', scene1);
            expect(Registry.getScene('testScene')).toBe(scene1);
            
            Registry.setScene('testScene', scene2);
            expect(Registry.getScene('testScene')).toBe(scene2);
        });
    });

    describe('Ticker Management', () => {
        test('should register and retrieve tickers', () => {
            const mockTicker = new MockTicker();
            Registry.setTicker('testTicker', mockTicker);
            
            const retrieved = Registry.getTicker('testTicker');
            expect(retrieved).toBe(mockTicker);
        });

        test('should return undefined for non-existent tickers', () => {
            const retrieved = Registry.getTicker('nonExistentTicker');
            expect(retrieved).toBeUndefined();
        });

        test('should remove tickers', () => {
            const mockTicker = new MockTicker();
            Registry.setTicker('testTicker', mockTicker);
            
            expect(Registry.getTicker('testTicker')).toBe(mockTicker);
            
            Registry.removeTicker('testTicker');
            expect(Registry.getTicker('testTicker')).toBeUndefined();
        });

        test('should get all tickers', () => {
            const ticker1 = new MockTicker();
            const ticker2 = new MockTicker();
            
            Registry.setTicker('ticker1', ticker1);
            Registry.setTicker('ticker2', ticker2);
            
            const allTickers = Registry.getAllTickers();
            expect(allTickers.size).toBe(2);
            expect(allTickers.get('ticker1')).toBe(ticker1);
            expect(allTickers.get('ticker2')).toBe(ticker2);
        });

        test('should clear all tickers', () => {
            const ticker1 = new MockTicker();
            const ticker2 = new MockTicker();
            
            Registry.setTicker('ticker1', ticker1);
            Registry.setTicker('ticker2', ticker2);
            
            expect(Registry.getAllTickers().size).toBe(2);
            
            Registry.clearTickers();
            expect(Registry.getAllTickers().size).toBe(0);
        });

        test('should overwrite existing tickers with same name', () => {
            const ticker1 = new MockTicker();
            const ticker2 = new MockTicker();
            
            Registry.setTicker('testTicker', ticker1);
            expect(Registry.getTicker('testTicker')).toBe(ticker1);
            
            Registry.setTicker('testTicker', ticker2);
            expect(Registry.getTicker('testTicker')).toBe(ticker2);
        });
    });

    describe('Registry Isolation', () => {
        test('should maintain separate scene and ticker namespaces', () => {
            const scene = new MockScene();
            const ticker = new MockTicker();
            
            Registry.setScene('test', scene);
            Registry.setTicker('test', ticker);
            
            expect(Registry.getScene('test')).toBe(scene);
            expect(Registry.getTicker('test')).toBe(ticker);
            
            Registry.removeScene('test');
            expect(Registry.getScene('test')).toBeUndefined();
            expect(Registry.getTicker('test')).toBe(ticker);
        });
    });
});
