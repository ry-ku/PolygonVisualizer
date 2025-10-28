interface Point {
  x: number;
  y: number;
}

type Polygon = Point[];

/**
 * Returns the closes point to 'pos' that lies inside or on the boundary
 * of the polygon 'poly'. (non-self intersecting; maybe concave;)
 * Time complexity should be O(n) in number of vertices.
 */
function closestPointInPolygon(poly: Point[], pos: Point): Point {
  let minDistance = Infinity;
  let closestPoint: Point = poly[0];

  for (let coordinate = 0; coordinate < poly.length; coordinate++) {
    const c1 = poly[coordinate];
    const c2 = poly[(coordinate + 1) % poly.length];

    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;

    const mx = pos.x - c1.x;
    const my = pos.y - c1.y;

    const lengthSquared = dx ** 2 + dy ** 2;
    const dotProduct = dx * mx + dy * my;

    let t = dotProduct / lengthSquared;

    t = Math.max(0, Math.min(1, t));

    const interpolatedPoint = {
      x: c1.x + t * dx,
      y: c1.y + t * dy,
    };

    const distance = Math.hypot(
      interpolatedPoint.x - pos.x,
      interpolatedPoint.y - pos.y,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = interpolatedPoint;
    }
  }

  return closestPoint;
}

function isMouseInPolygon(poly: Point[], pos: Point): boolean {
  let crossings = 0;

  for (let index = 0; index < poly.length; index++) {
    const c1 = poly[index];
    const c2 = poly[(index + 1) % poly.length];

    if (isRayIntersectingSide(pos, c1, c2)) {
      crossings++;
    }
  }

  return crossings % 2 === 1;
}

function isRayIntersectingSide(pos: Point, p1: Point, p2: Point) {
  if (p1.y > pos.y === p2.y > pos.y) {
    return false;
  }

  const slope = (p2.x - p1.x) / (p2.y - p1.y);
  const crossX = p1.x + slope * (pos.y - p1.y);

  return pos.x < crossX;
}

function drawPoint(layer: CanvasRenderingContext2D, point: Point) {
  layer.beginPath();
  layer.arc(point.x, point.y, 5, 0, Math.PI * 2);
  layer.fillStyle = "white";
  layer.fill();
  layer.closePath();
}

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
canvas.height = 700;
canvas.width = document.body.getBoundingClientRect().width;

const pointerCanvasNode = canvas.cloneNode(true) as HTMLCanvasElement;
pointerCanvasNode.id = "point-layer-canvas";

canvas.parentElement?.append(pointerCanvasNode);

const pointerCanvasLayer = document.querySelector(
  "#point-layer-canvas",
) as HTMLCanvasElement;

// biome-ignore-start lint/style/noNonNullAssertion: It will be there.
var canvasCtx = canvas.getContext("2d")!;
// biome-ignore-end lint/style/noNonNullAssertion: It will be there.

canvasCtx.strokeStyle = "white";

// Rectangle (Top-left)
const rectangle: Point[] = [
  { x: 60, y: 20 },
  { x: 60, y: 180 },
  { x: 240, y: 180 },
  { x: 240, y: 20 },
  { x: 60, y: 20 },
];

// Triangle (Top-right)
const triangle: Point[] = [
  { x: 450, y: 20 },
  { x: 530, y: 180 },
  { x: 370, y: 180 },
  { x: 450, y: 20 },
];

// Pentagon (Bottom-left)
const pentagon: Point[] = [
  { x: 150, y: 380 },
  { x: 220, y: 430 },
  { x: 200, y: 520 },
  { x: 100, y: 520 },
  { x: 80, y: 430 },
  { x: 150, y: 380 },
];

// Hexagon (Bottom-right)
const hexagon: Point[] = [
  { x: 500, y: 380 },
  { x: 560, y: 410 },
  { x: 580, y: 480 },
  { x: 530, y: 530 },
  { x: 470, y: 530 },
  { x: 420, y: 480 },
  { x: 440, y: 410 },
  { x: 500, y: 380 },
];

const shapes: Polygon[] = [rectangle, triangle, pentagon, hexagon];

const pointers: Point[] = [];

/**
 * Index of the shape that the pointer is currently inside of.
 */
let activeShape: number | null = null;

for (let shapeIndex = 0; shapeIndex <= shapes.length - 1; shapeIndex++) {
  const [movedPoint, ...points] = shapes[shapeIndex];
  canvasCtx.beginPath();

  canvasCtx.moveTo(movedPoint.x, movedPoint.y);

  points.forEach((point) => {
    canvasCtx.lineTo(point.x, point.y);
  });

  canvasCtx.closePath();
  canvasCtx.stroke();

  const pointerCanvasCtx = pointerCanvasLayer.getContext("2d");
  if (!pointerCanvasCtx) continue;

  drawPoint(pointerCanvasCtx, shapes[shapeIndex][0]);

  let abortController: AbortController | undefined;

  pointerCanvasLayer.addEventListener("mousedown", () => {
    abortController = new AbortController();

    pointerCanvasLayer.addEventListener(
      "mousemove",
      (event) => {
        const point = closestPointInPolygon(points, {
          x: event.clientX,
          y: event.clientY,
        });

        pointers[shapeIndex] = point;

        pointerCanvasCtx.clearRect(
          0,
          0,
          pointerCanvasLayer.width,
          pointerCanvasLayer.height,
        );

        if (isMouseInPolygon(points, { x: event.clientX, y: event.clientY })) {
          activeShape = shapeIndex;
        } else {
          if (activeShape === shapeIndex) {
            activeShape = null;
          }
        }

        pointers.forEach((pointer, index) => {
          if (index === activeShape) return;
          drawPoint(pointerCanvasCtx, pointer);
        });
      },
      {
        signal: abortController.signal,
      },
    );
  });

  pointerCanvasLayer.addEventListener("mouseup", () => {
    abortController?.abort();
  });
}
