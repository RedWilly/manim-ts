/**
 * Scene decorator for Manim TypeScript
 * Ported from Luau compiled version
 */

import { Registry } from '../registry.js';
import { util } from '../util.js';
import type { SceneAttributes } from '../object/scene/scene.js';
import type { Instance } from '../types.js';

/**
 * @name Scene
 * @description Scene classes decorated with this will be picked up by the Registry.
 */
export function Scene(config: SceneAttributes, outputInstance: Instance): (ctor: any) => void {
    return function(ctor: any): void {
        // Check if the constructor has an add method (indicating it's a Scene)
        if (!ctor.prototype?.add && typeof ctor.add !== 'function') {
            util.logDebug(
                `Manim::Decorators::Scene(): Cannot decorate ${ctor} with Scene(), instance does not contain a add() function!`,
                "info",
                true
            );
            return;
        }

        util.logDebug(`Manim::Decorators::Scene(): Decorated ${ctor} with Scene().`, "verbose");
        
        // Set up the scene properties
        ctor.prototype.params = config;
        
        if (ctor.prototype.__enabled === undefined) {
            ctor.prototype.__enabled = true;
        }
        
        ctor.prototype.__children = new Map();
        ctor.prototype.__outputInstance = outputInstance;
        
        // Register the scene
        Registry.setScene(config.name, ctor);
    };
}
