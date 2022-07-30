import {
  Canvas2DGraphics,
  Canvas2DGraphicsOptions,
  DrawingOptions,
  lerp,
  TAU
} from '..';

declare module '..' {
  interface DrawingOptions {
    roughness?: number;
  }
}

export interface Canvas2DGraphicsRough extends Canvas2DGraphics {}

export class Canvas2DGraphicsRough extends Canvas2DGraphics {
  constructor(context: CanvasRenderingContext2D, options: Canvas2DGraphicsOptions) {
    super(context, options);

    const defaults: Canvas2DGraphicsOptions = {
      roughness: 0.025
    };

    this.options = { ...defaults, ...this.options };
  }

  public lineSegments(points: number[][], options: DrawingOptions = {}) {
    const numSegments = points.length - 1;
    // super.lineSegments(points, options);
    for (let i = 0; i < numSegments; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const length = Math.sqrt((p0[0] - p1[0]) ** 2 + (p0[1] - p1[1]) ** 2);
      const roughnessAdj = this.options.roughness! * length;
      // two rough lines for each line
      for (let j = 0; j < 2; j++) {
        const points = [];
        // four rough points for each rough line
        for (let k = 0; k < 4; k++) {
          const randomRadius = Math.random() * roughnessAdj;
          const randomRotation = Math.random() * TAU;
          const randomX = randomRadius * Math.cos(randomRotation);
          const randomY = randomRadius * Math.sin(randomRotation);
          let x = NaN;
          let y = NaN;
          if (k === 0) {
            x = p0[0] + randomX;
            y = p0[1] + randomY;
          }
          if (k === 1) {
            const distance = 0.5;
            x = lerp(distance, p0[0], p1[0]) + randomX;
            y = lerp(distance, p0[1], p1[1]) + randomY;
          }
          if (k === 2) {
            const distance = 0.75;
            x = lerp(distance, p0[0], p1[0]) + randomX;
            y = lerp(distance, p0[1], p1[1]) + randomY;
          }
          if (k === 3) {
            x = p1[0] + randomX;
            y = p1[1] + randomY;
          }
          points.push([x, y]);
        }
        this.curveThroughPoints(points, options);
      }
    }
  }

  public circle(cx: number, cy: number, r: number, options: DrawingOptions = {}) {
    const segmentCount = 16;
    const roughnessAdj = this.options.roughness! * r * 6;
    for (let n = 0; n < 2; n++) {
      const points = [];
      for (let i = 0; i < segmentCount; i++) {
        const randomRadius = Math.random() * roughnessAdj;
        const randomRotation = Math.random() * TAU;
        const randomX = randomRadius * Math.cos(randomRotation);
        const randomY = randomRadius * Math.sin(randomRotation);
        const angle = (TAU * i) / segmentCount;
        const x0 = cx + randomX + Math.cos(angle) * r * 2;
        const y0 = cy + randomY + Math.sin(angle) * r * 2;
        points.push([x0, y0]);
      }
      points[segmentCount] = points[0];
      points[segmentCount + 1] = points[1];
      this.curveThroughPoints(points, options);
    }
  }

  public rect(x = 0, y = 0, width = 1, height = 1, options: DrawingOptions = {}) {
    const xAdj = this.resolveXValue(x);
    const yAdj = this.resolveYValue(y);
    const widthAdj = this.resolveScalarValue(width);
    const heightAdj = this.resolveScalarValue(height);
    const points = [
      [xAdj, yAdj],
      [xAdj + widthAdj, yAdj],
      [xAdj + widthAdj, yAdj + heightAdj],
      [xAdj, yAdj + heightAdj],
      [xAdj, yAdj]
    ];
    this.lineSegments(points, {
      ...options,
      useNormalCoordinates: false,
      saveAndRestore: true
    });
    // const points = [
    //   [x, y],
    //   [x + width, y],
    //   [x + width, y + height],
    //   [x, y + height],
    //   [x, y]
    // ];
    // this.lineSegments(points, options);
  }
}