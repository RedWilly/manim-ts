/**
 * SceneWithCamera class for Manim TypeScript
 * Ported from Luau compiled version
 */

import { Scene } from './scene.js';
import { util } from '../../util.js';
import type { Camera, CFrame, Tween, WritableInstanceProperties } from '../../types.js';
import { EasingStyle, EasingDirection } from '../../types.js';

/**
 * Abstract scene class with camera functionality
 */
export abstract class SceneWithCamera extends Scene {
    private camera: Camera | undefined;
    private cameraTweenPlaying: boolean = false;

    /**
     * Moves the camera to a specified CFrame over time with optional easing
     */
    public moveCameraTo(
        cframe: CFrame,
        time: number,
        easing?: EasingStyle,
        direction?: EasingDirection,
        repeatCount?: number,
        reverses?: boolean,
        otherProps?: WritableInstanceProperties<Camera>
    ): Tween | undefined {
        if (this.cameraTweenPlaying) {
            return undefined;
        }

        if (!this.camera) {
            util.logDebug('Manim::SceneWithCamera::moveCameraTo(): Camera does not exist!');
            return undefined;
        }

        const tweenInfo = {
            Time: time,
            EasingStyle: easing || EasingStyle.Linear,
            EasingDirection: direction || EasingDirection.Out,
            RepeatCount: repeatCount || 0,
            Reverses: reverses || false,
            DelayTime: 0
        };

        const tweenProps: any = {
            CFrame: cframe
        };
        
        if (otherProps) {
            Object.assign(tweenProps, otherProps);
        }
        const tween: Tween = {
            Play: () => {
                this.cameraTweenPlaying = true;
                // Simulate tween completion after the specified time
                setTimeout(() => {
                    if (this.camera) {
                        Object.assign(this.camera, tweenProps);
                    }
                    this.cameraTweenPlaying = false;
                    // Call completion callback if it exists
                }, tweenInfo.Time * 1000);
            },
            Pause: () => {
                
            },
            Cancel: () => {
                this.cameraTweenPlaying = false;
            },
            Completed: {
                Once: (callback: () => void) => {
                    setTimeout(callback, tweenInfo.Time * 1000);
                },
                Connect: (callback: () => void) => {
                    setTimeout(callback, tweenInfo.Time * 1000);
                }
            }
        };

        tween.Play();
        return tween;
    }

    /**
     * Sets the camera for this scene
     */
    public setCamera(camera: Camera): void {
        this.camera = camera;
    }

    /**
     * Ticks all children in the scene
     */
    public override tick(dt: number): void {
        this.tickAllChildren(dt);
    }
}
