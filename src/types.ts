/**
 * Core type definitions for Manim TypeScript
 * Ported from Luau compiled version
 */

// Basic 3D color type - assuming this represents RGB values
export interface Color3 {
    r: number;
    g: number;
    b: number;
}

// Vector3 type for 3D coordinates
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

// Vector2 type for 2D coordinates
export interface Vector2 {
    x: number;
    y: number;
}

// Basic transformation matrix type
export interface CFrame {
    position: Vector3;
    rotation: Vector3;
}

// Basic instance type for objects
export interface Instance {
    Name: string;
    Parent?: Instance;
    Destroy(): void;
}

// Basic part type
export interface BasePart extends Instance {
    Position: Vector3;
    Size: Vector3;
    Color: Color3;
    Material: string;
    Transparency: number;
    CanCollide: boolean;
    Anchored: boolean;
    CFrame: CFrame;
}

// Camera type for scene rendering
export interface Camera extends Instance {
    CFrame: CFrame;
    FieldOfView: number;
    Focus: Instance | undefined;
}

// Tween-related types for animations
export interface Tween {
    Play(): void;
    Pause(): void;
    Cancel(): void;
    Completed: {
        Once(callback: () => void): void;
        Connect(callback: () => void): void;
    };
}

export enum EasingStyle {
    Linear = "Linear",
    Sine = "Sine",
    Back = "Back",
    Quad = "Quad",
    Quart = "Quart",
    Quint = "Quint",
    Bounce = "Bounce",
    Elastic = "Elastic",
    Exponential = "Exponential",
    Circular = "Circular",
    Cubic = "Cubic"
}

export enum EasingDirection {
    In = "In",
    Out = "Out",
    InOut = "InOut"
}

export interface TweenInfo {
    Time: number;
    EasingStyle: EasingStyle;
    EasingDirection: EasingDirection;
    RepeatCount: number;
    Reverses: boolean;
    DelayTime: number;
}

// Handle adornment types for derived objects
export interface LineHandleAdornment extends Instance {
    Length: number;
    Thickness: number;
    Color3: Color3;
    CFrame: CFrame;
    Transparency: number;
    Visible: boolean;
    Adornee?: Instance;
}

export interface ConeHandleAdornment extends Instance {
    Height: number;
    Radius: number;
    Color3: Color3;
    CFrame: CFrame;
    Transparency: number;
    Visible: boolean;
    Adornee?: Instance;
}

// Utility type for writable instance properties
export type WritableInstanceProperties<T> = {
    [K in keyof T]?: T[K];
};
