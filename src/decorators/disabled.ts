/**
 * Disabled decorator for Manim TypeScript
 * Ported from Luau compiled version
 */

import { MObject } from '../object/mobject.js';
import { util } from '../util.js';

/**
 * @name Disabled
 * @description Disables MObjects, when a MObject is decorated the tick() and construct() functions will not run.
 */
export function Disabled(): (ctor: any) => void {
    return function(ctor: any): void {
        // Check if the constructor is an MObject or extends MObject
        if (ctor.prototype instanceof MObject || ctor === MObject) {
            // Set the __enabled flag to false for instances created from this constructor
            ctor.prototype.__enabled = false;
            
            util.logDebug(`Manim::Decorators::Disabled(): Disabled ${ctor}.`, "verbose");
        } else {
            util.logDebug(
                `Manim::Decorators::Disabled: Cannot disable ${ctor}, it is not of class MObject`,
                "info",
                true
            );
        }
    };
}
