/**
 * Ticker decorator for Manim TypeScript
 * Ported from Luau compiled version
 */

import { util } from '../util.js';
import { Registry } from '../registry.js';

/**
 * @name Ticker
 * @description Connects the tick function on a class to a heartbeat-like system
 */
export function Ticker(): (ctor: any) => void {
    return function(ctor: any): void {
        // Check if the constructor has a tick method
        if (!ctor.prototype?.tick && typeof ctor.tick !== 'function') {
            util.logDebug(
                `Manim::Decorators::Ticker(): Cannot decorate ${ctor} with Ticker(), instance does not contain a tick() function!`,
                "info",
                true
            );
            return;
        }

        util.logDebug(`Manim::Decorators::Ticker(): Decorated ${ctor} with Ticker().`, "verbose");
        
        // Register the ticker in the registry
        Registry.setTicker(`${ctor}`, ctor);
    };
}
