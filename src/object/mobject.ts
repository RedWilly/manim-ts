/**
 * Base MObject class for Manim TypeScript
 * Ported from Luau compiled version
 */

import { util } from '../util.js';
import type { Instance } from '../types.js';

export interface MObjectAttributes {
    Visible?: boolean;
}

/**
 * Abstract base class for all Manim objects
 */
export abstract class MObject<T extends MObjectAttributes = MObjectAttributes> {
    /** @hidden @internal */
    public __enabled: boolean = true;
    
    /** @hidden @internal */
    public __children: Map<string, MObject> = new Map();
    
    /** @hidden @internal */
    public __outputInstance: Instance | undefined;
    
    /** @hidden @internal */
    public __parent: MObject | undefined;
    
    /** @hidden @internal */
    public __destroying: boolean = false;
    
    public params: T;

    constructor(params?: Partial<T>) {
        this.params = { ...params } as T;
    }

    /**
     * Adds a child MObject to this object
     */
    public addChild<U extends MObjectAttributes = MObjectAttributes>(
        name: string, 
        child: MObject<U>
    ): void {
        this.__children.set(name, child);
        child.__parent = this;
    }

    /**
     * Removes and destroys a child MObject
     */
    public removeChild(name: string): void {
        const child = this.__children.get(name);
        if (child) {
            child.destroy();
        }
        this.__children.delete(name);
    }

    /**
     * Gets a child MObject by name
     */
    public getChild<U extends MObjectAttributes = MObjectAttributes>(
        name: string
    ): MObject<U> | undefined {
        return this.__children.get(name) as MObject<U> | undefined;
    }

    /**
     * Gets the output instance, traversing up the parent chain if necessary
     */
    public getOutputInstance(): Instance | undefined {
        if (this.__parent) {
            return this.__parent.getOutputInstance();
        } else {
            return this.__outputInstance;
        }
    }

    /**
     * Entry point for the MObject - implement your logic here
     */
    public abstract construct(): void;

    /**
     * Updates the MObject - called on each frame
     * Use Ticker() to automatically call this function
     */
    public abstract tick(dt: number): void;

    /**
     * Internal construction method with preprocessing
     * @hidden @internal
     */
    public _construct(): void {
        if (!this.__enabled) {
            util.logDebug(
                `Manim::MObject::_construct() -- MObject "${this}" is disabled, skipping.`, 
                "verbose"
            );
            return;
        }

        this.construct();

        // Construct all children
        for (const [, child] of this.__children) {
            child._construct();
        }
    }

    /**
     * Internal tick method with preprocessing
     * @hidden @internal
     */
    public _tick(dt: number): void {
        if (!this.__enabled) {
            return;
        }
        this.tick(dt);
    }

    /**
     * Recursively ticks all child MObjects
     */
    public tickAllChildren(dt: number): void {
        for (const [, child] of this.__children) {
            child.tick(dt);
        }
    }

    /**
     * Destroys this MObject and all its children
     */
    public destroy(): void {
        util.logDebug("Manim::MObject::destroy(): Destroying!", "verbose");
        
        // Destroy all children first
        for (const [, child] of this.__children) {
            child.destroy();
        }

        // Destroy the output instance if it exists
        const outputInstance = this.getOutputInstance();
        if (outputInstance) {
            outputInstance.Destroy();
        }

        this.__destroying = true;
    }

    /**
     * Sets a parameter value
     */
    public setParam(key: keyof T, value: unknown): void {
        (this.params as any)[key] = value;
    }
}
