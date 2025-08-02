# Manim TypeScript Port

A TypeScript port of the Manim animation library for server-side rendering using Node.js/Bun and node-canvas.

## Credits

**This project is a reverse-engineered TypeScript port of [@rbxts/manim](https://www.npmjs.com/package/@rbxts/manim) v1.0.0 by [longuint-rbx](https://www.npmjs.com/~longuint-rbx).**

All core concepts, API design, and foundations are derived from the original Roblox TypeScript implementation. This port adapts the library for server-side use with node-canvas rendering instead of Roblox's 3D engine.

## Installation

```bash
bun install
```

## Quick Start

Run the enhanced animation example:

```bash
bun run example/server-animation.ts
```

This generates PNG frames in the `frames/` directory showing moving squares orbiting around a pulsing center circle.

## Generate Video

Convert the generated frames to MP4 using FFmpeg:

```bash
ffmpeg -framerate 30 -i frames/frame_%06d.png -c:v libx264 -pix_fmt yuv420p -crf 18 animation.mp4
```
see Animation.mp4 ( example - preview )

## Features

- **Server-side rendering** with node-canvas
- **1:1 API compatibility** with the original @rbxts/manim
- **Comprehensive test suite** with Bun/Jest compatibility
- **TypeScript-first** with explicit type annotations
- **Modular ES modules** structure
- **High-quality frame export** to PNG
- **FFmpeg integration** for video generation

## Architecture

- **Core Objects**: Vector, Line, Cone, Axes with full parameter animation
- **Scene System**: Scene and SceneWithCamera for complex compositions
- **Renderer**: CanvasRenderer for high-quality 2D output
- **Animation**: Tick-based system with deltaTime precision
- **Configuration**: Centralized config with debug logging

## TODO List

### Core Animation Features
- [ ] **Multi-chain animations** - Sequential and parallel animation chains
- [ ] **Manim-like API** - Python Manim compatibility layer
- [ ] **Easing functions** - Comprehensive easing/interpolation library
- [ ] **Transform animations** - Smooth morphing between shapes
- [ ] **Path animations** - Objects following custom curves
- [ ] **Timeline system** - Keyframe-based animation sequencing

### Advanced Objects
- [ ] **Text rendering** - Mathematical equations and labels
- [ ] **Complex shapes** - Polygons, circles, arcs, bezier curves
- [ ] **3D objects** - Basic 3D shapes with projection
- [ ] **Graph plotting** - Function plots and data visualization
- [ ] **Image objects** - Sprite and image manipulation

### Rendering & Export
- [ ] **Preview** - inbuilt play function similar to manim without needing to run ffmpeg command seperately

### Developer Experience
- [ ] **CLI tool** - Command-line animation generator
- [ ] **Animation templates** - Pre-built animation patterns
- [ ] **Performance profiling** - Frame timing and optimization
- [ ] **Documentation site** - docs and tutorials


## Contributing

This project maintains strict 1:1 API compatibility with the original [@rbxts/manim](https://www.npmjs.com/package/@rbxts/manim). When contributing:

1. Add comprehensive tests for new features
2. Follow TypeScript best practices
3. Ensure Bun compatibility
4. Document all public APIs

## License

This project respects the original work by longuint-rbx. Please refer to the original [@rbxts/manim](https://www.npmjs.com/package/@rbxts/manim) for licensing information.

### FYI
this is only a personal project == i was bored
---

*Built with [Bun](https://bun.sh) - A fast all-in-one JavaScript runtime*