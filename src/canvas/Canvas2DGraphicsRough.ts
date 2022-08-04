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
    closeLoop?: boolean;
  }
}

export interface Canvas2DGraphicsRough extends Canvas2DGraphics {}

export class Canvas2DGraphicsRough extends Canvas2DGraphics {
  constructor(context: CanvasRenderingContext2D, options: Canvas2DGraphicsOptions) {
    super(context, options);

    const defaults: Canvas2DGraphicsOptions = {
      roughness: 0.025,
      closeLoop: false
    };

    this.options = { ...defaults, ...this.options };
  }

  public lineSegments(points: number[][], options: DrawingOptions = {}) {
    const numSegments = points.length - 1;
    // two outlines for each set of points
    for (let j = 0; j < 2; j++) {
      const roughPoints = [];
      for (let i = 0; i < numSegments; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[i + 1];
        const length = Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
        const roughnessAdj = this.options.roughness! * length;

        if (options.closeLoop && i === numSegments - 1) {
          // roughPoints[i] = roughPoints[1];
          roughPoints.push(roughPoints[0]);
          break;
        }

        // four rough points for each rough line
        for (let k = 0; k < 4; k++) {
          const randomRadius = Math.random() * roughnessAdj;
          const randomRotation = Math.random() * TAU;
          const randomX = randomRadius * Math.cos(randomRotation);
          const randomY = randomRadius * Math.sin(randomRotation);
          let x = NaN;
          let y = NaN;
          if (k === 0) {
            x = x0 + randomX;
            y = y0 + randomY;
          }
          if (k === 1) {
            const distance = 0.5;
            x = lerp(distance, x0, x1) + randomX;
            y = lerp(distance, y0, y1) + randomY;
          }
          if (k === 2) {
            const distance = 0.75;
            x = lerp(distance, x0, x1) + randomX;
            y = lerp(distance, y0, y1) + randomY;
          }
          if (k === 3) {
            x = x1 + randomX;
            y = y1 + randomY;
          }
          roughPoints.push([x, y]);
        }
      }
      // only allow fills on the first outline
      const optionsAdjusted: DrawingOptions =
        j === 0 ? options : { ...options, fill: false };
      this.curveThroughPoints(roughPoints, optionsAdjusted);
    }
  }

  public circle(cx: number, cy: number, r: number, options: DrawingOptions = {}) {
    const segmentCount = 16;
    const roughnessAdj =
      (this.options.roughness! * 10 * this.resolveScalarValue(r, options)) /
      window.innerWidth;
    for (let n = 0; n < 2; n++) {
      const points = [];
      for (let i = 0; i < segmentCount; i++) {
        const randomRadius = Math.random() * roughnessAdj;
        const randomRotation = Math.random() * TAU;
        const randomX = randomRadius * Math.cos(randomRotation);
        const randomY = randomRadius * Math.sin(randomRotation);
        const angle = (TAU * i) / segmentCount;
        const x0 =
          this.resolveXValue(cx + randomX, options) +
          Math.cos(angle) * this.resolveScalarValue(r, options);
        const y0 =
          this.resolveYValue(cy + randomY, options) +
          Math.sin(angle) * this.resolveScalarValue(r, options);
        points.push([x0, y0]);
      }
      points[segmentCount] = points[0];
      points[segmentCount + 1] = points[1];
      this.curveThroughPoints(points, {
        ...options,
        useNormalCoordinates: false,
        saveAndRestore: true,
        closeLoop: true
      });
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
      saveAndRestore: true,
      closeLoop: true
    });
  }

  public polygon(
    cx: number,
    cy: number,
    size: number,
    numPoints?: number,
    options: DrawingOptions = {}
  ) {
    super.polygon(cx, cy, size, numPoints, { ...options, closeLoop: true });
  }
}
