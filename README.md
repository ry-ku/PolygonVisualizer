# Polygon Visualizer

A polygon visualizer with draggable handles that constrain themselves to within the edges of shapes using the browser 2D Canvas API.

**[Try it live here!](https://ry-ku.github.io/PolygonVisualizer/)**

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - To use the development server and worry less about the configuration stuff.
- **pnpm** - Fast, disk space efficient package manager

## Installation

### Prerequisites

Make sure you have [pnpm](https://pnpm.io/) installed. If not, choose one of these methods:

**Option 1: Using Corepack (recommended if you have Node.js installed)**

Corepack comes bundled with Node.js 16.13+. Enable it:

```bash
corepack enable pnpm
```

**Option 2: Using npm**

```bash
npm install -g pnpm
```

### Setup Steps

1. **Clone the repository** (or navigate to the project directory)

```bash
cd PolygonVisualizer
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start the development server**

```bash
pnpm vite
```

4. **Open your browser**

The dev server will start at `http://localhost:5173` (or another port if 5173 is busy). Open this URL in your browser.

## Usage

- Click and drag anywhere on the canvas
- The closest point on each polygon will follow your cursor
- When dragging inside a polygon, the handle will track your mouse position directly

## Features

- **O(n) time complexity** for closest point calculation
- **Ray-casting algorithm** for point-in-polygon detection
- **requestAnimationFrame** throttling for smooth 60fps performance
- Support for convex and concave polygons
