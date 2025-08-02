/**
 * Registry for managing scenes and tickers in Manim TypeScript
 * Ported from Luau compiled version
 */

import type { MObject } from './object/mobject.js';
import type { Scene } from './object/scene/scene.js';

export namespace Registry {
    // Private storage for scenes and tickers
    const __scenes = new Map<string, Scene>();
    const __tickers = new Map<string, MObject>();

    /**
     * Gets a scene by name
     */
    export function getScene(name: string): Scene | undefined {
        return __scenes.get(name);
    }

    /**
     * Sets a scene in the registry
     */
    export function setScene(name: string, scene: Scene): void {
        __scenes.set(name, scene);
    }

    /**
     * Removes a scene from the registry
     */
    export function removeScene(name: string): void {
        if (getScene(name)) {
            __scenes.delete(name);
        }
    }

    /**
     * Gets all registered scenes
     */
    export function getAllScenes(): Map<string, Scene> {
        return __scenes;
    }

    /**
     * Clears all scenes from the registry
     */
    export function clearScenes(): void {
        __scenes.clear();
    }

    /**
     * Gets a ticker by name
     */
    export function getTicker(name: string): MObject | undefined {
        return __tickers.get(name);
    }

    /**
     * Sets a ticker in the registry
     */
    export function setTicker(name: string, ticker: MObject): void {
        __tickers.set(name, ticker);
    }

    /**
     * Removes a ticker from the registry
     */
    export function removeTicker(name: string): void {
        if (getTicker(name)) {
            __tickers.delete(name);
        }
    }

    /**
     * Gets all registered tickers
     */
    export function getAllTickers(): Map<string, MObject> {
        return __tickers;
    }

    /**
     * Clears all tickers from the registry
     */
    export function clearTickers(): void {
        __tickers.clear();
    }
}
