/**
 * Line class for Manim TypeScript
 * Ported from Luau compiled version
 */

import { MObject } from '../mobject.js';
import type { MObjectAttributes } from '../mobject.js';
import type { LineHandleAdornment, Color3, CFrame, WritableInstanceProperties } from '../../types.js';
import { Colors } from '../../colors.js';
import { util } from '../../util.js';

export type LineAttributes = {
    Length: number;
    Thickness?: number;
    Color?: Color3;
    CFrame?: CFrame;
} & MObjectAttributes;

/**
 * Line MObject for creating line visualizations
 */
export class Line extends MObject<LineAttributes> {
    private line: LineHandleAdornment | undefined;

    constructor(params: LineAttributes) {
        super(params);
    }

    /**
     * Constructs the line adornment
     */
    public construct(): void {
        if (!this.getOutputInstance()) {
            util.logDebug("Manim::Line::construct(): Output instance is undefined!", "verbose", false);
        }


        const line: LineHandleAdornment = {
            Name: "LineHandleAdornment",
            Parent: this.getOutputInstance(),
            Length: this.params.Length,
            Thickness: this.params.Thickness ?? 8,
            Color3: this.params.Color || Colors.WHITE,
            CFrame: this.params.CFrame || { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            Transparency: 0,
            Visible: this.params.Visible ?? true,
            Adornee: this.getOutputInstance(),
            Destroy: () => {
                
            }
        };

        // Set visibility
        if (this.params.Visible !== undefined) {
            (line as any).Visible = this.params.Visible;
        } else {
            (line as any).Visible = true;
        }

        // Set adornee and parent
        (line as any).Adornee = this.getOutputInstance();
        line.Parent = this.getOutputInstance();

        this.line = line;
    }

    /**
     * Sets a native property on the line adornment
     */
    public setNative(prop: keyof WritableInstanceProperties<LineHandleAdornment>, value: any): void {
        if (!this.line) {
            return;
        }
        (this.line as any)[prop] = value;
    }

    /**
     * Updates the line properties each frame
     */
    public tick(_dt: number): void {
        if (!this.line) {
            return;
        }

        this.line.Length = this.params.Length;
        this.line.Thickness = this.params.Thickness ?? 6;
        this.line.Color3 = this.params.Color || Colors.WHITE;
        (this.line as any).Adornee = this.getOutputInstance();
        this.line.Parent = this.getOutputInstance();
    }
}
