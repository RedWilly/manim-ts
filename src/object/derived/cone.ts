/**
 * Cone class for Manim TypeScript
 * Ported from Luau compiled version
 */

import { MObject } from '../mobject.js';
import type { MObjectAttributes } from '../mobject.js';
import type { ConeHandleAdornment, Color3, CFrame, WritableInstanceProperties } from '../../types.js';
import { Colors } from '../../colors.js';
import { util } from '../../util.js';

export type ConeAttributes = {
    Radius?: number;
    Height?: number;
    Color?: Color3;
    CFrame?: CFrame;
} & MObjectAttributes;

/**
 * Cone MObject for creating cone visualizations
 */
export class Cone extends MObject<ConeAttributes> {
    private cone: ConeHandleAdornment | undefined;

    constructor(params: ConeAttributes) {
        super(params);
    }

    /**
     * Constructs the cone adornment
     */
    public construct(): void {
        if (!this.getOutputInstance()) {
            util.logDebug("Manim::Cone::construct(): Output instance is undefined!", "verbose", false);
        }


        const cone: ConeHandleAdornment = {
            Name: "ConeHandleAdornment",
            Parent: this.getOutputInstance(),
            Radius: this.params.Radius ?? 0.25,
            Height: this.params.Height ?? 1,
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
            (cone as any).Visible = this.params.Visible;
        } else {
            (cone as any).Visible = true;
        }

        // Set adornee and parent
        (cone as any).Adornee = this.getOutputInstance();
        cone.Parent = this.getOutputInstance();

        this.cone = cone;
    }

    /**
     * Sets a native property on the cone adornment
     */
    public setNative(prop: keyof WritableInstanceProperties<ConeHandleAdornment>, value: unknown): void {
        if (!this.cone) {
            return;
        }
        (this.cone as any)[prop] = value;
    }

    /**
     * Updates the cone properties each frame
     */
    public tick(_dt: number): void {
        if (!this.cone) {
            return;
        }

        this.cone.Radius = this.params.Radius ?? 0.25;
        this.cone.Height = this.params.Height ?? 1;
        this.cone.Color3 = this.params.Color || Colors.WHITE;
        (this.cone as any).Adornee = this.getOutputInstance();
        this.cone.Parent = this.getOutputInstance();
    }
}
