import { Canvas2DGraphics, Canvas2DGraphicsOptions, DrawingOptions, TAU } from "..";

interface Canvas2DGraphicsRoughOptions {
  roughness?: number;
}

export interface Canvas2DGraphicsRough
  extends Canvas2DGraphics,
    Canvas2DGraphicsRoughOptions {}

export class Canvas2DGraphicsRough extends Canvas2DGraphics {
  constructor(
    context: CanvasRenderingContext2D,
    options: Canvas2DGraphicsOptions & Canvas2DGraphicsRoughOptions
  ) {
    super(context, options);

    const defaults: Canvas2DGraphicsRoughOptions = {
      roughness: 0.25
    };

    this.options = { ...this.options, ...defaults, ...options };
  }

  public lineSegments(points: number[][], options: DrawingOptions = {}) {
    const numSegments = points.length - 1;
    for (let i = 0; i < numSegments; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const length = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
      const roughnessAdj = 0.025 * length;
      // two rough lines for each line
      for (let j = 0; j < 2; j++) {
        const points = [];
        // two rough points for each rough line
        for (let k = 0; k < 2; k++) {
          const randomRadius = Math.random() * roughnessAdj;
          const randomRotation = Math.random() * TAU;
          const randomX = randomRadius * Math.cos(randomRotation);
          const randomY = randomRadius * Math.sin(randomRotation);
          if (k === 0) {
            points.push([p1[0] + randomX, p1[1] + randomY]);
          } else {
            points.push([p2[0] + randomX, p2[1] + randomY]);
          }
        }
        super.lineSegments(points);
      }
    }
  }

  public circle(cx: number, cy: number, r: number, options: DrawingOptions = {}) {
    const segmentCount = 16;
    for (let i = 0; i < segmentCount; i++) {
      const angle0 = (TAU * i) / segmentCount;
      const angle1 = (TAU * (i + 1)) / segmentCount;
      const x0 = cx + Math.cos(angle0) * r * 2;
      const y0 = cy + Math.sin(angle0) * r * 2;
      const x1 = cx + Math.cos(angle1) * r * 2;
      const y1 = cy + Math.sin(angle1) * r * 2;
      this.lineSegments(
        [
          [x0, y0],
          [x1, y1]
        ],
        options
      );
    }
  }
}
