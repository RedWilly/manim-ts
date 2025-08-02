/**
 * Vector class for Manim TypeScript
 * Ported from Luau compiled version
 */

import { MObject } from '../mobject.js';
import type { MObjectAttributes } from '../mobject.js';
import type { Color3, CFrame, WritableInstanceProperties, LineHandleAdornment, ConeHandleAdornment } from '../../types.js';
import { Colors } from '../../colors.js';
import { util } from '../../util.js';
import { Line, type LineAttributes } from './line.js';
import { Cone, type ConeAttributes } from './cone.js';

export type VectorAttributes = {
    Origin?: CFrame;
    CFrame: CFrame;
    Color?: Color3;
} & MObjectAttributes;

/**
 * Vector MObject for creating vector visualizations with line and cone components
 */
export class Vector extends MObject<VectorAttributes> {
    private line: Line | undefined;
    private cone: Cone | undefined;

    constructor(params: VectorAttributes) {
        super(params);
    }

    /**
     * Constructs the vector with line and cone components
     */
    public construct(): void {
        if (!this.getOutputInstance()) {
            util.logDebug("Manim::Vector::construct(): Output instance is undefined!", "verbose", false);
        }

        // Clone params for line (set Length to 0 initially)
        const lineParams: LineAttributes = {
            ...this.params,
            Length: 0
        };
        this.line = new Line(lineParams);

        // Clone params for cone
        const coneParams: ConeAttributes = {
            ...this.params
        };
        this.cone = new Cone(coneParams);

        // Add as children
        this.addChild("line", this.line);
        this.addChild("cone", this.cone);
    }

    /**
     * Sets a native property on the line component
     */
    public setNativeLine(prop: keyof WritableInstanceProperties<LineHandleAdornment>, value: any): void {
        if (!this.line) {
            return;
        }
        this.line.setNative(prop, value);
    }

    /**
     * Sets a native property on the cone component
     */
    public setNativeCone(prop: keyof WritableInstanceProperties<ConeHandleAdornment>, value: any): void {
        if (!this.cone) {
            return;
        }
        this.cone.setNative(prop, value);
    }

    /**
     * Updates the vector components each frame
     */
    public tick(_dt: number): void {
        if (!this.line || !this.cone) {
            return;
        }

        // Calculate vector properties
        const origin = this.params.Origin || { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } };
        const tail = origin.position;
        const head = this.params.CFrame.position;
        
        const direction = {
            x: head.x - tail.x,
            y: head.y - tail.y,
            z: head.z - tail.z
        };
        
        const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
        
        const mid = {
            x: tail.x + direction.x,
            y: tail.y + direction.y,
            z: tail.z + direction.z
        };

        const orient: CFrame = {
            position: mid,
            rotation: { x: 0, y: 0, z: 0 }
        };

        const lineCF: CFrame = {
            position: mid,
            rotation: {
                x: orient.rotation.x - Math.PI,
                y: orient.rotation.y,
                z: orient.rotation.z
            }
        };

        this.line.setNative("Length", length);
        this.line.setNative("CFrame", lineCF);
        this.line.setNative("Color3", this.params.Color || Colors.WHITE);
        this.line.setNative("Visible", this.params.Visible ?? true);
        const coneCF: CFrame = {
            position: head,
            rotation: orient.rotation
        };

        // Update cone properties
        this.cone.setNative("CFrame", coneCF);
        this.cone.setNative("Color3", this.params.Color || Colors.WHITE);
        this.cone.setNative("Visible", this.params.Visible ?? true);
    }
}
