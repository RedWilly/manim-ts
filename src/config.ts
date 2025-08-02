/**
 * Configuration settings for Manim TypeScript
 * Ported from Luau compiled version
 */

export interface ManimGlobals {
    MANIM_DEBUG: boolean;
    LOG_LEVEL: "info" | "verbose";
}

export const MANIM_CONFIG: ManimGlobals = {
    MANIM_DEBUG: true,
    LOG_LEVEL: "verbose"
} as const;
