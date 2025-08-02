/**
 * Scene class for Manim TypeScript
 * Ported from Luau compiled version
 */

import { MObject } from '../mobject.js';
import type { MObjectAttributes } from '../mobject.js';

export type SceneAttributes = {
    name: string;
    destroyOnCompleted?: boolean;
} & MObjectAttributes;

/**
 * Abstract base class for all scenes
 */
export abstract class Scene extends MObject<SceneAttributes> {
    constructor(params: SceneAttributes) {
        super(params);
    }

    /**
     * Adds all given child MObjects to the scene
     */
    public add(objs: { [k: string]: MObject }): void {
        for (const [name, obj] of Object.entries(objs)) {
            this.addChild(name, obj);
        }
    }

    /**
     * Returns name-value pairs of the given objects
     */
    public get(objs: string[]): Array<[string, MObject | undefined]> {
        const children: Array<[string, MObject | undefined]> = [];
        
        for (const name of objs) {
            children.push([name, this.getChild(name)]);
        }
        
        return children;
    }

    /**
     * Ticks all children in the scene
     */
    public tick(dt: number): void {
        this.tickAllChildren(dt);
    }
}
