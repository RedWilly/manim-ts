/**
 * Enhanced Server-side Animation Example using Manim TypeScript + node-canvas
 * Creates moving squares around the perimeter with a pulsing circle in the center
 */

import { Manim } from "../src/index.js";
import { CanvasRenderer } from "../src/renderer/index.js";

console.log("=== Manim TypeScript Enhanced Animation ===");
console.log("Creating moving squares and pulsing center circle...");

// Initialize Manim
Manim.init();

// Configure renderer
const renderer = new CanvasRenderer({
    width: 1920,
    height: 1080,
    backgroundColor: { r: 0.02, g: 0.02, b: 0.08 }, // Deep space background
    scale: 120, // Scale factor for world coordinates
    outputDir: "./frames"
});

// Create moving squares (using lines to form squares)
const squares: Array<{
    top: any,
    bottom: any,
    left: any,
    right: any,
    angle: number,
    radius: number,
    speed: number,
    color: any
}> = [];

// Create 4 squares that will orbit around the center
for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI * 2) / 4; // Evenly spaced around circle
    const radius = 4; // Distance from center
    const speed = 0.5 + i * 0.1; // Different speeds for variety
    const colors = [Manim.Colors.RED_C, Manim.Colors.GREEN_C, Manim.Colors.BLUE_C, Manim.Colors.YELLOW_C];
    
    const squareSize = 0.8;
    
    // Create 4 lines to form a square
    const square = {
        top: new Manim.Objects.Line({
            CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            Length: squareSize,
            Color: colors[i],
            Visible: true
        }),
        bottom: new Manim.Objects.Line({
            CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            Length: squareSize,
            Color: colors[i],
            Visible: true
        }),
        left: new Manim.Objects.Line({
            CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            Length: squareSize,
            Color: colors[i],
            Visible: true
        }),
        right: new Manim.Objects.Line({
            CFrame: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            Length: squareSize,
            Color: colors[i],
            Visible: true
        }),
        angle,
        radius,
        speed,
        color: colors[i]
    };
    
    squares.push(square);
}

// Create pulsing center circle (using a cone as circle representation)
const centerCircle = new Manim.Objects.Cone({
    CFrame: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    Radius: 1.0,
    Color: Manim.Colors.WHITE,
    Visible: true
});

// Initialize objects
console.log("Initializing objects...");
for (const square of squares) {
    square.top._construct();
    square.bottom._construct();
    square.left._construct();
    square.right._construct();
}
centerCircle._construct();

// Animation parameters
const duration = 5; // seconds
const fps = 30;
const totalFrames = duration * fps;
const deltaTime = 1 / fps;

console.log(`Rendering ${totalFrames} frames at ${fps} FPS...`);
console.log(`Duration: ${duration} seconds`);

// Animation loop
function renderAnimation() {
    for (let frame = 0; frame < totalFrames; frame++) {
        const time = frame * deltaTime;

        // Update moving squares - each orbits around center at different speeds
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            if (!square) continue; // Type safety check
            
            const currentAngle = square.angle + time * square.speed;
            const centerX = square.radius * Math.cos(currentAngle);
            const centerY = square.radius * Math.sin(currentAngle);
            
            const halfSize = 0.4; // Half the square size
            
            // Position the 4 lines to form a square
            // Top line
            square.top.setParam("CFrame", {
                position: { x: centerX, y: centerY + halfSize, z: 0 },
                rotation: { x: 0, y: 0, z: 0 }
            });
            
            // Bottom line
            square.bottom.setParam("CFrame", {
                position: { x: centerX, y: centerY - halfSize, z: 0 },
                rotation: { x: 0, y: 0, z: 0 }
            });
            
            // Left line (rotated 90 degrees)
            square.left.setParam("CFrame", {
                position: { x: centerX - halfSize, y: centerY, z: 0 },
                rotation: { x: 0, y: 0, z: Math.PI / 2 }
            });
            
            // Right line (rotated 90 degrees)
            square.right.setParam("CFrame", {
                position: { x: centerX + halfSize, y: centerY, z: 0 },
                rotation: { x: 0, y: 0, z: Math.PI / 2 }
            });
        }

        // Animate pulsing center circle
        const pulseScale = 1.0 + 0.5 * Math.sin(time * 4); // Pulse between 0.5x and 1.5x size
        const baseRadius = 1.0;
        centerCircle.setParam("Radius", baseRadius * pulseScale);
        
        // Optional: Add rotation to center circle for visual interest
        centerCircle.setParam("CFrame", {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: time * 0.5 }
        });
        
        // Tick all objects
        for (const square of squares) {
            square.top._tick(deltaTime);
            square.bottom._tick(deltaTime);
            square.left._tick(deltaTime);
            square.right._tick(deltaTime);
        }
        centerCircle._tick(deltaTime);

        // Render frame
        renderer.clear();
        renderer.drawGrid(1, { r: 0.1, g: 0.1, b: 0.15 });
        
        // Render all square lines
        for (const square of squares) {
            renderer.renderLine(square.top);
            renderer.renderLine(square.bottom);
            renderer.renderLine(square.left);
            renderer.renderLine(square.right);
        }
        
        // Render pulsing center circle
        renderer.renderCone(centerCircle);

        const savedPath = renderer.saveFrame();
        
        // Progress indicator
        if (frame % 10 === 0 || frame === totalFrames - 1) {
            const percent = ((frame + 1) / totalFrames * 100).toFixed(1);
            console.log(`Frame ${frame + 1}/${totalFrames} (${percent}%) - ${savedPath}`);
        }
    }
}

// Generate animation
const startTime = performance.now();
renderAnimation();
const endTime = performance.now();

console.log("\n=== Animation Complete ===");
console.log(`Rendered ${totalFrames} frames in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
console.log(`Average: ${((endTime - startTime) / totalFrames).toFixed(2)}ms per frame`);
console.log(`Output directory: ./frames`);
console.log("\nTo create a video from frames, you can use FFmpeg:");
console.log(`ffmpeg -framerate ${fps} -i frames/frame_%06d.png -c:v libx264 -pix_fmt yuv420p animation.mp4`);

// Optional: Save a single preview frame
console.log("\nSaving preview frame...");
renderer.clear();
renderer.drawGrid(1, { r: 0.1, g: 0.1, b: 0.15 });

// Reset squares to initial positions for preview
for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    if (!square) continue;
    
    const centerX = square.radius * Math.cos(square.angle);
    const centerY = square.radius * Math.sin(square.angle);
    const halfSize = 0.4;
    
    // Position square lines at initial positions
    square.top.setParam("CFrame", {
        position: { x: centerX, y: centerY + halfSize, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    });
    square.bottom.setParam("CFrame", {
        position: { x: centerX, y: centerY - halfSize, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    });
    square.left.setParam("CFrame", {
        position: { x: centerX - halfSize, y: centerY, z: 0 },
        rotation: { x: 0, y: 0, z: Math.PI / 2 }
    });
    square.right.setParam("CFrame", {
        position: { x: centerX + halfSize, y: centerY, z: 0 },
        rotation: { x: 0, y: 0, z: Math.PI / 2 }
    });
}

// Reset center circle to initial state
centerCircle.setParam("Radius", 1.0);
centerCircle.setParam("CFrame", {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
});

// Render preview frame
for (const square of squares) {
    renderer.renderLine(square.top);
    renderer.renderLine(square.bottom);
    renderer.renderLine(square.left);
    renderer.renderLine(square.right);
}
renderer.renderCone(centerCircle);

const previewPath = renderer.saveFrame("preview.png");
console.log(`Preview saved: ${previewPath}`);
