/**
 * Axes class for Manim TypeScript
 * Ported from Luau compiled version
 */

import { MObject } from '../mobject.js';
import type { MObjectAttributes } from '../mobject.js';
import type { Color3, Vector3, CFrame } from '../../types.js';
import { Colors } from '../../colors.js';
import { util } from '../../util.js';
import { Vector, type VectorAttributes } from './vector.js';

export type AxesAttributes = {
    Sizes: [number, number, number];
    Colors?: [Color3, Color3, Color3];
    Origin?: Vector3;
} & MObjectAttributes;

/**
 * Axes MObject for creating 3D coordinate axes with X, Y, Z vectors
 */
export class Axes extends MObject<AxesAttributes> {
    private xVector: Vector | undefined;
    private yVector: Vector | undefined;
    private zVector: Vector | undefined;

    constructor(params: AxesAttributes) {
        super(params);
    }

    /**
     * Constructs the three axis vectors
     */
    public construct(): void {
        if (!this.getOutputInstance()) {
            util.logDebug("Manim::Axes::construct(): Output instance is undefined!", "verbose", false);
        }

        // Set default values
        const origin = this.params.Origin || { x: 0, y: 0, z: 0 };
        const colors = this.params.Colors || [Colors.WHITE, Colors.WHITE, Colors.WHITE];
        
        const originCF: CFrame = {
            position: origin,
            rotation: { x: 0, y: 0, z: 0 }
        };

        const [sizeX, sizeY, sizeZ] = this.params.Sizes;
        const [colorX, colorY, colorZ] = colors;

        // Create X-axis vector
        const xVectorParams: VectorAttributes = {
            Origin: originCF,
            CFrame: {
                position: {
                    x: origin.x + sizeX,
                    y: origin.y,
                    z: origin.z
                },
                rotation: { x: 0, y: 0, z: 0 }
            },
            Color: colorX,
            Visible: true
        };
        this.xVector = new Vector(xVectorParams);

        // Create Y-axis vector
        const yVectorParams: VectorAttributes = {
            Origin: originCF,
            CFrame: {
                position: {
                    x: origin.x,
                    y: origin.y + sizeY,
                    z: origin.z
                },
                rotation: { x: 0, y: 0, z: 0 }
            },
            Color: colorY,
            Visible: true
        };
        this.yVector = new Vector(yVectorParams);

        // Create Z-axis vector
        const zVectorParams: VectorAttributes = {
            Origin: originCF,
            CFrame: {
                position: {
                    x: origin.x,
                    y: origin.y,
                    z: origin.z + sizeZ
                },
                rotation: { x: 0, y: 0, z: 0 }
            },
            Color: colorZ,
            Visible: true
        };
        this.zVector = new Vector(zVectorParams);

        // Add as children
        this.addChild("xAxis", this.xVector);
        this.addChild("yAxis", this.yVector);
        this.addChild("zAxis", this.zVector);
    }

    /**
     * Updates all axis vectors each frame
     */
    public tick(dt: number): void {
        this.tickAllChildren(dt);
    }
}
