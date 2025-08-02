import { Manim } from "../src/index.js";

// Simple demonstration of the Manim TypeScript port
console.log("=== Manim TypeScript Port Demo ===");

// Initialize Manim
Manim.init();

// Show available colors
console.log("\nAvailable Colors:");
console.log("BLUE_C:", Manim.Colors.BLUE_C);
console.log("RED_C:", Manim.Colors.RED_C);
console.log("GREEN_C:", Manim.Colors.GREEN_C);

// Create objects programmatically (without decorators for simplicity)
console.log("\n=== Creating Objects ===");

const vector = new Manim.Objects.Vector({
    CFrame: {
        position: { x: 5, y: 3, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    Color: Manim.Colors.BLUE_C,
    Visible: true
});

const line = new Manim.Objects.Line({
    CFrame: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    Length: 4,
    Color: Manim.Colors.RED_C,
    Visible: true
});

console.log("Vector created:", vector.params);
console.log("Line created:", line.params);

// Demonstrate object lifecycle
console.log("\n=== Object Lifecycle ===");
vector._construct();
line._construct();

console.log("Objects constructed successfully");

// Demonstrate parameter updates
console.log("\n=== Parameter Updates ===");
vector.setParam("Color", Manim.Colors.GREEN_C);
line.setParam("Length", 6);

console.log("Vector color updated to:", vector.params.Color);
console.log("Line length updated to:", line.params.Length);

// Demonstrate animation tick
console.log("\n=== Animation Tick ===");
let tickCount = 0;
const maxTicks = 5;

function animationLoop() {
    if (tickCount < maxTicks) {
        const deltaTime = 0.016; // ~60fps
        
        // Update vector position in a circle
        const time = tickCount * deltaTime;
        const radius = 3;
        vector.setParam("CFrame", {
            position: {
                x: radius * Math.cos(time * 2),
                y: radius * Math.sin(time * 2),
                z: 0
            },
            rotation: { x: 0, y: 0, z: 0 }
        });
        
        // Rotate the line
        line.setParam("CFrame", {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: time }
        });
        
        // Tick the objects
        vector._tick(deltaTime);
        line._tick(deltaTime);
        
        console.log(`Tick ${tickCount + 1}: Vector at (${vector.params.CFrame?.position.x.toFixed(2)}, ${vector.params.CFrame?.position.y.toFixed(2)})`);
        
        tickCount++;
        setTimeout(animationLoop, 16); // ~60fps
    } else {
        console.log("\n=== Demo Complete ===");
        console.log("The Manim TypeScript port is working correctly!");
        console.log("\nTo create real animations, you would:");
        console.log("1. Choose a rendering backend (Canvas, WebGL, SVG, Three.js)");
        console.log("2. Implement proper tweening curves");
        console.log("3. Add more object types and features");
        console.log("4. Create a scene management system");
    }
}

animationLoop();
