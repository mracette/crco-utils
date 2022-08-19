import {
  Canvas2DGraphics,
  Canvas2DGraphicsOptions,
  Canvas2DStyles,
  distance,
  DrawingOptions,
  lerp,
  TAU,
  Vector2
} from '..';
import { quadInOut } from '../math/ease';
import { random } from '../math/random';

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
      (this.options.roughness! * this.resolveScalar(r, options)) / window.innerWidth;
    for (let n = 0; n < 2; n++) {
      const points = [];
      for (let i = 0; i < segmentCount; i++) {
        const randomRadius = Math.random() * roughnessAdj;
        const randomRotation = Math.random() * TAU;
        const randomX = randomRadius * Math.cos(randomRotation);
        const randomY = randomRadius * Math.sin(randomRotation);
        const angle = (TAU * i) / segmentCount;
        const x0 =
          this.resolveX(cx + randomX, options) +
          Math.cos(angle) * this.resolveScalar(r, options);
        const y0 =
          this.resolveY(cy + randomY, options) +
          Math.sin(angle) * this.resolveScalar(r, options);
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
    const xAdj = this.resolveX(x);
    const yAdj = this.resolveY(y);
    const widthAdj = this.resolveScalar(width);
    const heightAdj = this.resolveScalar(height);
    const points = [
      [xAdj, yAdj],
      [xAdj + widthAdj, yAdj],
      [xAdj + widthAdj, yAdj + heightAdj],
      [xAdj, yAdj + heightAdj],
      [xAdj, yAdj]
    ];
    this.lineSegments(points, {
      ...options,
      useNormalCoordinates: false, // signal that normalization is complete
      saveAndRestore: true,
      closeLoop: true
    });
  }

  private measureTextInContext(text: string, styles?: Canvas2DStyles) {
    this.context.save();
    // apply the current styles to ensure that text measurement is accurate
    this.applyStyles(styles);
    const measurement = this.context.measureText(text);
    this.context.restore();
    return measurement;
  }

  public text(text: string, cx: number, cy: number, options: DrawingOptions = {}) {
    const {
      actualBoundingBoxAscent: top,
      actualBoundingBoxDescent: bottom,
      width
    } = this.measureTextInContext(text, options.styles);

    const letters = text.split('');

    const letterHeight = top - bottom;
    const letterHeightNormal = this.coords.nHeight(letterHeight);

    const letterWidth = width / letters.length;
    const letterWidthNormal = this.coords.xn(letterWidth) - this.coords.xn(0);

    const wordLengthNormal = letterWidthNormal * letters.length;

    this.applyStyles(options.styles);

    letters.forEach((letter, i) => {
      let letterX;
      let letterCx;
      if (this.context.textAlign === 'left') {
        letterX = cx + letterWidthNormal * i;
        letterCx = letterX + letterWidthNormal / 2;
      } else if (this.context.textAlign === 'right') {
        letterX = -wordLengthNormal + cx + letterWidthNormal * (i + 1);
        letterCx = letterX - letterWidthNormal / 2;
      } else if (this.context.textAlign === 'center') {
        letterX = -wordLengthNormal / 2 + cx + letterWidthNormal * (0.5 + i);
        letterCx = letterX;
      } else {
        throw new Error(
          "textAlign must be 'left', 'right', or 'center' to use rough text"
        );
      }

      const letterY = cy;
      let letterCy;
      if (this.context.textBaseline === 'top') {
        letterCy = letterY - letterHeightNormal / 2;
      } else if (this.context.textBaseline === 'bottom') {
        letterCy = letterY - letterHeightNormal / 2;
      } else if (this.context.textBaseline === 'middle') {
        letterCy = letterY;
      } else {
        throw new Error(
          "textBaseline must be 'top', 'bottom', or 'middle' to use rough text"
        );
      }

      const rx = [random(0.1) * letterWidthNormal, random(0.1) * letterWidthNormal];
      const ry = [random(0.1) * letterHeightNormal, random(0.1) * letterHeightNormal];

      super.text(letter, letterX + rx[0], letterY + ry[0], {
        ...options,
        styles: {
          ...options.styles,
          rotation: {
            origin: new Vector2(letterCx, letterCy),
            rotation: (this.options.roughness! * Math.PI) / 16
          }
        }
      });
      super.text(letter, letterX + rx[1], letterY + ry[1], {
        ...options,
        styles: {
          ...options.styles,
          rotation: {
            origin: new Vector2(letterCx, letterCy),
            rotation: (-this.options.roughness! * Math.PI) / 16
          }
        }
      });
    });
  }
}
