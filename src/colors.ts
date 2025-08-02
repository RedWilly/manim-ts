/**
 * Color definitions and utilities for Manim TypeScript
 * Ported from Luau compiled version
 */

import type { Color3 } from './types.js';

/**
 * Creates a Color3 from a hex string
 */
function fromHex(hex: string): Color3 {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result || result.length < 4) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    
    return {
        r: parseInt(result[1]!, 16) / 255,
        g: parseInt(result[2]!, 16) / 255,
        b: parseInt(result[3]!, 16) / 255
    };
}

/**
 * Creates a Color3 from RGB values (0-1 range)
 */
function newColor3(r: number, g: number, b: number): Color3 {
    return { r, g, b };
}

/**
 * Generates linearly spaced values between start and stop
 */
function linearSpace(start: number, stop: number, num: number): number[] {
    const arr: number[] = [];
    
    if (num === 1) {
        arr.push(start);
    } else {
        const step = (stop - start) / (num - 1);
        for (let i = 0; i < num; i++) {
            arr.push(start + i * step);
        }
    }
    
    return arr;
}

/**
 * Generates a color gradient between given colors
 */
function colorGradient(colors: Color3[], n: number): Color3[] {
    if (n === 0) {
        return [];
    }
    
    const alphas = linearSpace(0, 1, n);
    const result: Color3[] = [];
    
    for (let i = 0; i < n; i++) {
        const alpha = alphas[i]!; // Safe because linearSpace generates exactly n elements
        const idx = Math.floor(alpha * (colors.length - 1));
        const f = alpha * (colors.length - 1) - idx;
        const col1 = colors[idx]!; // Safe because idx is within bounds
        const col2 = colors[Math.min(idx + 1, colors.length - 1)]!; // Safe because we clamp to valid index
        
        // Use gamma-correct interpolation
        const r = Math.sqrt((1 - f) * (col1.r * col1.r) + f * (col2.r * col2.r));
        const g = Math.sqrt((1 - f) * (col1.g * col1.g) + f * (col2.g * col2.g));
        const b = Math.sqrt((1 - f) * (col1.b * col1.b) + f * (col2.b * col2.b));
        
        result.push(newColor3(r, g, b));
    }
    
    return result;
}

/**
 * Predefined color constants
 */
export const Colors = {
    // Blues
    BLUE_E: fromHex("#1C758A"),
    BLUE_D: fromHex("#29ABCA"),
    BLUE_C: fromHex("#58C4DD"),
    BLUE_B: fromHex("#9CDCEB"),
    BLUE_A: fromHex("#C7E9F1"),
    
    // Teals
    TEAL_E: fromHex("#49A88F"),
    TEAL_D: fromHex("#55C1A7"),
    TEAL_C: fromHex("#5CD0B3"),
    TEAL_B: fromHex("#76DDC0"),
    TEAL_A: fromHex("#ACEAD7"),
    
    // Greens
    GREEN_E: fromHex("#699C52"),
    GREEN_D: fromHex("#77B05D"),
    GREEN_C: fromHex("#83C167"),
    GREEN_B: fromHex("#A6CF8C"),
    GREEN_A: fromHex("#C9E2AE"),
    
    // Yellows
    YELLOW_E: fromHex("#E8C11C"),
    YELLOW_D: fromHex("#F4D345"),
    YELLOW_C: fromHex("#FFFF00"),
    YELLOW_B: fromHex("#FFEA94"),
    YELLOW_A: fromHex("#FFF1B6"),
    
    // Golds
    GOLD_E: fromHex("#C78D46"),
    GOLD_D: fromHex("#E1A158"),
    GOLD_C: fromHex("#F0AC5F"),
    GOLD_B: fromHex("#F9B775"),
    GOLD_A: fromHex("#F7C797"),
    
    // Reds
    RED_E: fromHex("#CF5044"),
    RED_D: fromHex("#E65A4C"),
    RED_C: fromHex("#FC6255"),
    RED_B: fromHex("#FF8080"),
    RED_A: fromHex("#F7A1A3"),
    
    // Maroons
    MAROON_E: fromHex("#94424F"),
    MAROON_D: fromHex("#A24D61"),
    MAROON_C: fromHex("#C55F73"),
    MAROON_B: fromHex("#EC92AB"),
    MAROON_A: fromHex("#ECABC1"),
    
    // Purples
    PURPLE_E: fromHex("#644172"),
    PURPLE_D: fromHex("#715582"),
    PURPLE_C: fromHex("#9A72AC"),
    PURPLE_B: fromHex("#B189C6"),
    PURPLE_A: fromHex("#CAA3E8"),
    
    // Greys
    GREY_E: fromHex("#222222"),
    GREY_D: fromHex("#444444"),
    GREY_C: fromHex("#888888"),
    GREY_B: fromHex("#BBBBBB"),
    GREY_A: fromHex("#DDDDDD"),
    
    // Basic colors
    WHITE: fromHex("#FFFFFF"),
    BLACK: fromHex("#000000"),
    GREY_BROWN: fromHex("#736357"),
    DARK_BROWN: fromHex("#8B4513"),
    LIGHT_BROWN: fromHex("#CD853F"),
    PINK: fromHex("#D147BD"),
    LIGHT_PINK: fromHex("#DC75CD"),
    GREEN_SCREEN: fromHex("#00FF00"),
    ORANGE: fromHex("#FF862F"),
    
    // Utility function
    colorGradient
} as const;
