/**
 * Server-side Canvas Renderer for Manim TypeScript
 * Uses node-canvas for high-quality server-side rendering
 */

import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Color3 } from '../types.js';
import type { Vector } from '../object/derived/vector.js';
import type { Line } from '../object/derived/line.js';
import type { Cone } from '../object/derived/cone.js';
import type { Axes } from '../object/derived/axes.js';

export interface RenderConfig {
    width: number;
    height: number;
    backgroundColor: Color3;
    scale: number;
    outputDir: string;
}

export class CanvasRenderer {
    private canvas: Canvas;
    private ctx: CanvasRenderingContext2D;
    private config: RenderConfig;
    private frameCount: number = 0;

    constructor(config: Partial<RenderConfig> = {}) {
        this.config = {
            width: 1920,
            height: 1080,
            backgroundColor: { r: 0, g: 0, b: 0 },
            scale: 100,
            outputDir: './output',
            ...config
        };

        this.canvas = createCanvas(this.config.width, this.config.height);
        this.ctx = this.canvas.getContext('2d');

        // Ensure output directory exists
        try {
            mkdirSync(this.config.outputDir, { recursive: true });
        } catch (error) {
            // Directory might already exist
        }
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    private worldToScreen(worldPos: { x: number; y: number }): { x: number; y: number } {
        return {
            x: worldPos.x * this.config.scale + this.config.width / 2,
            y: -worldPos.y * this.config.scale + this.config.height / 2 // Flip Y axis
        };
    }

    /**
     * Convert Color3 to CSS color string
     */
    private colorToCSS(color: Color3): string {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Clear the canvas with background color
     */
    public clear(): void {
        this.ctx.fillStyle = this.colorToCSS(this.config.backgroundColor);
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }

    /**
     * Draw coordinate grid for reference
     */
    public drawGrid(gridSize: number = 1, color: Color3 = { r: 0.2, g: 0.2, b: 0.2 }): void {
        this.ctx.strokeStyle = this.colorToCSS(color);
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        const screenGridSize = gridSize * this.config.scale;
        const centerX = this.config.width / 2;
        const centerY = this.config.height / 2;

        // Vertical lines
        for (let x = centerX % screenGridSize; x < this.config.width; x += screenGridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.config.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = centerY % screenGridSize; y < this.config.height; y += screenGridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.config.width, y);
            this.ctx.stroke();
        }

        // Reset line dash
        this.ctx.setLineDash([]);

        // Draw main axes
        this.ctx.strokeStyle = this.colorToCSS({ r: 0.4, g: 0.4, b: 0.4 });
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.config.width, centerY);
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, this.config.height);
        this.ctx.stroke();
    }

    /**
     * Render a Vector object
     */
    public renderVector(vector: Vector): void {
        if (!vector.params.Visible || !vector.params.CFrame) return;

        const tail = { x: 0, y: 0 }; // Origin
        const head = {
            x: vector.params.CFrame.position.x,
            y: vector.params.CFrame.position.y
        };

        const tailScreen = this.worldToScreen(tail);
        const headScreen = this.worldToScreen(head);

        const color = vector.params.Color || { r: 1, g: 1, b: 1 };

        // Draw line
        this.ctx.strokeStyle = this.colorToCSS(color);
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(tailScreen.x, tailScreen.y);
        this.ctx.lineTo(headScreen.x, headScreen.y);
        this.ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(headScreen.y - tailScreen.y, headScreen.x - tailScreen.x);
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6;

        this.ctx.fillStyle = this.colorToCSS(color);
        this.ctx.beginPath();
        this.ctx.moveTo(headScreen.x, headScreen.y);
        this.ctx.lineTo(
            headScreen.x - arrowLength * Math.cos(angle - arrowAngle),
            headScreen.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        this.ctx.lineTo(
            headScreen.x - arrowLength * Math.cos(angle + arrowAngle),
            headScreen.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Render a Line object
     */
    public renderLine(line: Line): void {
        if (!line.params.Visible || !line.params.CFrame) return;

        const center = {
            x: line.params.CFrame.position.x,
            y: line.params.CFrame.position.y
        };
        const length = line.params.Length || 1;
        const rotation = line.params.CFrame.rotation.z || 0;

        const halfLength = length / 2;
        const start = {
            x: center.x - halfLength * Math.cos(rotation),
            y: center.y - halfLength * Math.sin(rotation)
        };
        const end = {
            x: center.x + halfLength * Math.cos(rotation),
            y: center.y + halfLength * Math.sin(rotation)
        };

        const startScreen = this.worldToScreen(start);
        const endScreen = this.worldToScreen(end);

        const color = line.params.Color || { r: 1, g: 1, b: 1 };

        this.ctx.strokeStyle = this.colorToCSS(color);
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(startScreen.x, startScreen.y);
        this.ctx.lineTo(endScreen.x, endScreen.y);
        this.ctx.stroke();
    }

    /**
     * Render a Cone object
     */
    public renderCone(cone: Cone): void {
        if (!cone.params.Visible || !cone.params.CFrame) return;

        const center = this.worldToScreen({
            x: cone.params.CFrame.position.x,
            y: cone.params.CFrame.position.y
        });

        const radius = (cone.params.Radius || 0.5) * this.config.scale;
        const color = cone.params.Color || { r: 1, g: 1, b: 1 };

        this.ctx.fillStyle = this.colorToCSS(color);
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = this.colorToCSS(color);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    /**
     * Render an Axes object
     */
    public renderAxes(axes: Axes): void {
        if (!axes.params.Visible) return;

        // Note: Axes object has private vector properties, so we'll render a simplified version
        // In a full implementation, you'd need to expose the vectors or render them differently
        const origin = axes.params.Origin || { x: 0, y: 0, z: 0 };
        const sizes = axes.params.Sizes || [1, 1, 1];
        const colors = axes.params.Colors || [
            { r: 1, g: 0, b: 0 }, // X - Red
            { r: 0, g: 1, b: 0 }, // Y - Green  
            { r: 0, g: 0, b: 1 }  // Z - Blue
        ];

        // Draw X axis
        this.drawAxisLine(origin, { x: origin.x + sizes[0], y: origin.y, z: origin.z }, colors[0]);
        // Draw Y axis
        this.drawAxisLine(origin, { x: origin.x, y: origin.y + sizes[1], z: origin.z }, colors[1]);
        // Draw Z axis (represented as a point since we're in 2D)
        this.drawAxisPoint(origin, colors[2]);
    }

    /**
     * Helper method to draw an axis line
     */
    private drawAxisLine(start: { x: number; y: number; z: number }, end: { x: number; y: number; z: number }, color: Color3): void {
        const startScreen = this.worldToScreen({ x: start.x, y: start.y });
        const endScreen = this.worldToScreen({ x: end.x, y: end.y });

        this.ctx.strokeStyle = this.colorToCSS(color);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(startScreen.x, startScreen.y);
        this.ctx.lineTo(endScreen.x, endScreen.y);
        this.ctx.stroke();
    }

    /**
     * Helper method to draw an axis point (for Z axis in 2D view)
     */
    private drawAxisPoint(point: { x: number; y: number; z: number }, color: Color3): void {
        const pointScreen = this.worldToScreen({ x: point.x, y: point.y });
        
        this.ctx.fillStyle = this.colorToCSS(color);
        this.ctx.beginPath();
        this.ctx.arc(pointScreen.x, pointScreen.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /**
     * Save current frame as PNG
     */
    public saveFrame(filename?: string): string {
        const frameFilename = filename || `frame_${this.frameCount.toString().padStart(6, '0')}.png`;
        const filepath = join(this.config.outputDir, frameFilename);
        
        const buffer = this.canvas.toBuffer('image/png');
        writeFileSync(filepath, buffer);
        
        this.frameCount++;
        return filepath;
    }

    /**
     * Get canvas as buffer for further processing
     */
    public getBuffer(format: 'image/png' | 'image/jpeg' = 'image/png'): Buffer {
        return this.canvas.toBuffer(format as any);
    }

    /**
     * Get current frame count
     */
    public getFrameCount(): number {
        return this.frameCount;
    }

    /**
     * Reset frame count
     */
    public resetFrameCount(): void {
        this.frameCount = 0;
    }
}
