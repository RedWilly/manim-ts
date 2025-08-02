/**
 * Main Manim TypeScript entry point
 * Ported from Luau compiled version
 */

import * as decorators from './decorators/index.js';
import * as objects from './object/index.js';
import { Colors as ManimColors } from './colors.js';
import { Registry as ManimRegistry } from './registry.js';
import { Scene as ManimScene } from './object/scene/scene.js';
import { SceneWithCamera as ManimSceneWithCamera } from './object/scene/scene-with-camera.js';
import { util } from './util.js';
import { MANIM_CONFIG } from './config.js';
import * as renderer from './renderer/index.js';

export namespace Manim {
    export const VERSION = "1.0.0";
    export const CONFIG = MANIM_CONFIG;
    export const Objects = objects;
    export const Decorators = decorators;
    export const Colors = ManimColors;
    export const Registry = ManimRegistry;
    export const Scene = ManimScene;
    export const SceneWithCamera = ManimSceneWithCamera;
    export const Renderer = renderer;
    
    /**
     * Initializes the Manim system
     */
    export function init(): void {
        const sceneCount = Registry.getAllScenes().size;
        const tickerCount = Registry.getAllTickers().size;
        
        util.logDebug(`Manim::init() Registering ${sceneCount} scenes, and ${tickerCount} tickers.`);
        
        // Construct all registered scenes
        for (const [, scene] of Registry.getAllScenes()) {
            scene._construct();
        }
        
        if (tickerCount > 0) {
            util.logDebug(`Manim::init() Setting up ticker system for ${tickerCount} tickers.`, "verbose");
            
            let lastTime = performance.now();
            const tick = () => {
                const currentTime = performance.now();
                const deltaTime = (currentTime - lastTime) / 1000;
                lastTime = currentTime;
                
                for (const [, ticker] of Registry.getAllTickers()) {
                    if (ticker._tick) {
                        ticker._tick(deltaTime);
                    }
                }
                
                requestAnimationFrame(tick);
            };
            
            requestAnimationFrame(tick);
        }
    }
}

// Export all types from object types
export * from './object/types.js';

// Export main namespace as default
export default Manim;