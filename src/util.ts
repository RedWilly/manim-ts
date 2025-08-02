/**
 * Utility functions for Manim TypeScript
 * Ported from Luau compiled version
 */

import { MANIM_CONFIG } from './config.js';

export namespace util {
    /**
     * Logs debug messages based on configuration settings
     */
    export function logDebug(
        message: string, 
        level: typeof MANIM_CONFIG.LOG_LEVEL = "info", 
        isWarn: boolean = false
    ): void {
        if (!MANIM_CONFIG.MANIM_DEBUG) {
            return;
        }
        
        if (MANIM_CONFIG.LOG_LEVEL === "info" && level === "verbose") {
            return;
        }
        
        if (isWarn) {
            console.warn(message);
        } else {
            console.log(message);
        }
    }
}
