import { CanvasCoordinates, deepClone, isUndefined, polygon, star, TAU } from '..';
import { DPR } from '../js/constants';
import { Vector2 } from '../math/Vector2';

export enum CanvasDimensions {
  Width = 'width',
  Height = 'height'
}

type ReactiveStyleFunction<T> = (coords: CanvasCoordinates) => T;

type ValueOrReactiveStyleFunction<T> = T | ReactiveStyleFunction<T>;

type RotationWithOrigin = { rotation: number; origin: Vector2 };

type ScaleWithOrigin = {
  scale: Vector2;
  origin: Vector2;
  constantLineWidth?: boolean;
};

export type Canvas2DStyleValues = {
  /**
   * Directly from the CanvasRenderingCntext2D API
   */
  fillStyle: CanvasRenderingContext2D['fillStyle'];
  lineWidth: CanvasRenderingContext2D['lineWidth'];
  lineCap: CanvasRenderingContext2D['lineCap'];
  lineJoin: CanvasRenderingContext2D['lineJoin'];
  lineDashOffset: CanvasRenderingContext2D['lineDashOffset'];
  miterLimit: CanvasRenderingContext2D['miterLimit'];
  strokeStyle: CanvasRenderingContext2D['strokeStyle'];
  textAlign: CanvasRenderingContext2D['textAlign'];
  textBaseline: CanvasRenderingContext2D['textBaseline'];
  /**
   * Custom to this library
   */
  transform: DOMMatrixInit;
  scale: Vector2 | ScaleWithOrigin;
  rotation: number | RotationWithOrigin;
  translation: Vector2;
  /**
   * Font size in pixels
   */
  fontSize: number;
  lineDash: number[];
  alpha: number;
  lineWidthIsProportionalTo: CanvasDimensions;
  /**
   * Directly from the CSSStyleDeclaration
   */
  fontFamily: CSSStyleDeclaration['fontFamily'];
  fontStyle: CSSStyleDeclaration['fontStyle'];
  fontWeight: CSSStyleDeclaration['fontWeight'];
  fontStretch: CSSStyleDeclaration['fontStretch'];
  fontVariant: CSSStyleDeclaration['fontVariant'];
  lineHeight: CSSStyleDeclaration['lineHeight'];
};

export type Canvas2DStyles = Partial<{
  [Property in keyof Canvas2DStyleValues]: ValueOrReactiveStyleFunction<
    Canvas2DStyleValues[Property]
  >;
}>;

export interface DrawingOptions {
  /** @defaultValue true */
  beginPath?: boolean;
  /** @defaultValue false */
  closePath?: boolean;
  /** @defaultValue false */
  fill?: boolean;
  /** @defaultValue undefined */
  maxTextWidth?: number;
  /** @defaultValue true */
  saveAndRestore?: boolean;
  /** @defaultValue false */
  stroke?: boolean;
  /** @defaultValue \{\} */
  styles?: Canvas2DStyles;
  /** @defaultValue false */
  useNormalCoordinates?: boolean;
  /** @defaultValue false */
  scalarNormalization?: 'width' | 'height' | false;
  /** @defaultValue false */
  skipApplyStyles?: boolean;
}

export interface InitializationOptions {
  coords?: CanvasCoordinates;
}

export interface Canvas2DGraphicsOptions extends DrawingOptions, InitializationOptions {}

export interface Canvas2DGraphics {
  context: CanvasRenderingContext2D;
  coords: CanvasCoordinates;
  options: Omit<DrawingOptions, 'coords'>;
}

export class Canvas2DGraphics {
  constructor(
    context: CanvasRenderingContext2D,
    /**
     * @defaultValue options.beginPath = true
     */
    options: Canvas2DGraphicsOptions = {}
  ) {
    this.context = context;
    this.coords = options.coords ?? new CanvasCoordinates({ canvas: context.canvas });

    const defaultStyles: Canvas2DStyles = {
      fontFamily: 'sans-serif',
      fontSize: 16
    };

    const defaults: DrawingOptions = {
      beginPath: true,
      closePath: false,
      fill: false,
      maxTextWidth: undefined,
      saveAndRestore: true,
      stroke: false,
      useNormalCoordinates: false,
      scalarNormalization: false,
      skipApplyStyles: false
    };

    this.options = { ...defaults, ...options };
    this.options.styles = {
      ...defaultStyles,
      ...options.styles
    };
  }

  public rect(x = 0, y = 0, width = 1, height = 1, options: DrawingOptions = {}): void {
    this.preDrawOps(options);
    this.context.rect(
      this.resolveX(x, options),
      this.resolveY(y, options),
      this.resolveScalar(width, options),
      this.resolveScalar(height, options)
    );
    this.postDrawOps(options);
  }

  public lineSegments(points: number[][], options: DrawingOptions = {}): void {
    this.preDrawOps(options);
    for (let i = 0; i < points.length; i++) {
      const x = this.resolveX(points[i][0], options);
      const y = this.resolveY(points[i][1], options);
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }
    this.postDrawOps(options);
  }

  /**
   * @see {@link https://stackoverflow.com/a/7058606/3064334}
   */
  public curveThroughPoints(points: number[][], options: DrawingOptions = {}): void {
    this.preDrawOps(options);
    for (let i = 0; i < points.length - 1; i++) {
      const x = this.resolveX(points[i][0], options);
      const y = this.resolveY(points[i][1], options);
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        const x1 = this.resolveX(points[i + 1][0], options);
        const y1 = this.resolveY(points[i + 1][1], options);
        if (x1 === x && y1 === y) {
          this.context.lineTo(x1, y1);
        } else {
          const cx = (x + x1) / 2;
          const cy = (y + y1) / 2;
          this.context.quadraticCurveTo(x, y, cx, cy);
        }
      }
    }
    points.slice(-1).forEach((point) => {
      this.context.lineTo(
        this.resolveX(point[0], options),
        this.resolveY(point[1], options)
      );
    });
    this.postDrawOps(options);
  }

  /**
   * @defaultValue options.beginPath = true
   * @defaultValue options.saveAndRestore = true
   * @defaultValue options.fill = true
   */
  public circle(cx: number, cy: number, r: number, options: DrawingOptions = {}): void {
    this.preDrawOps(options);
    this.context.arc(
      this.resolveX(cx, options),
      this.resolveY(cy, options),
      this.resolveScalar(r, options),
      0,
      TAU
    );
    this.postDrawOps(options);
  }

  public drawImage(
    image: CanvasImageSource,
    x: number,
    y: number,
    options: DrawingOptions = {}
  ): void {
    this.preDrawOps(options);
    this.context.drawImage(image, this.resolveX(x, options), this.resolveY(y, options));
    this.postDrawOps(options);
  }

  public star(
    cx: number,
    cy: number,
    size: number,
    numPoints?: number,
    inset?: number,
    options: DrawingOptions = {}
  ) {
    this.lineSegments(
      star(
        this.resolveX(cx, options),
        this.resolveY(cy, options),
        this.resolveScalar(size, options),
        numPoints,
        inset
      ),
      {
        ...options,
        useNormalCoordinates: false,
        saveAndRestore: true
      }
    );
  }

  public polygon(
    cx: number,
    cy: number,
    size: number,
    numPoints?: number,
    options: DrawingOptions = {}
  ) {
    this.lineSegments(
      polygon(
        this.resolveX(cx, options),
        this.resolveY(cy, options),
        this.resolveScalar(size, options),
        numPoints
      ),
      {
        ...options,
        useNormalCoordinates: false, // signal that normalization is complete
        saveAndRestore: true
      }
    );
  }

  public applyStyles(styles?: Canvas2DStyles): void {
    // not sure about this...
    // this.assignStylesToContext(this.options.styles!);
    // if (styles) {
    //   this.assignStylesToContext(styles);
    // }
    this.assignStylesToContext({ ...this.options.styles, ...styles });
  }

  public text(text: string, cx: number, cy: number, options: DrawingOptions = {}): void {
    this.preDrawOps(options);
    this.context.fillText(
      text,
      this.resolveX(cx, options),
      this.resolveY(cy, options),
      this.resolveOptions('maxTextWidth', options)
    );
    this.postDrawOps(options);
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  /**
   * An alternative to context.clearRect() that can be run at the beginning of a draw loop.
   * This form has two advantages over clearRect:
   *
   * 1. For clearRect you need to either have an untransformed context, or keep track of your actual boundaries.
   *    Otherwise you may not be able to clear the entire canvas on each frame.
   *
   * 2. clearRect does not clear the state stack that is used by the canvas context when methods like save() and restore() are called.
   *    If these functions are being called anywhere in a render loop, some browsers (Firefox) will continue to add to the state stack
   *    leading to deteriorating performance over time. In this case, it is much better to use this function to clear the canvas for
   *    each frame.
   *
   * TODO: more investigation is needed. Why is this necessary on Firefox? Is it the save/restore stack or is this issue only present
   * when beginPath() is not called properly before each path? Or is there another reason?
   *
   */
  public clearCanvasAndState(
    canvas: HTMLCanvasElement,
    options: { dpr?: boolean } = {}
  ): void {
    canvas.width = canvas.clientWidth * (options.dpr ? DPR : 1);
    canvas.height = canvas.clientHeight * (options.dpr ? DPR : 1);
  }

  protected resolveX(value: number, options: DrawingOptions = {}) {
    const useNormalCoordinates = this.resolveOptions('useNormalCoordinates', options);
    return useNormalCoordinates ? this.coords.nx(value) : value;
  }

  protected resolveY(value: number, options: DrawingOptions = {}) {
    const useNormalCoordinates = this.resolveOptions('useNormalCoordinates', options);
    return useNormalCoordinates ? this.coords.ny(value) : value;
  }

  protected resolveScalar(value: number, options: DrawingOptions = {}) {
    const scalarNormalization = this.resolveOptions('scalarNormalization', options);
    if (scalarNormalization === 'width') {
      return this.coords.width(value);
    }
    if (scalarNormalization === 'height') {
      return this.coords.height(value);
    }
    return value;
  }

  protected resolveOptions<T extends keyof DrawingOptions>(
    param: T,
    options: DrawingOptions
  ): DrawingOptions[T] {
    return (
      options && param in options ? options[param] : this.options[param]
    ) as DrawingOptions[T];
  }

  protected resolveStyles<T extends keyof Canvas2DStyles>(
    param: T,
    styles?: Canvas2DStyles
  ): Canvas2DStyleValues[T] {
    const resolved =
      styles && param in styles ? styles[param] : this.options.styles![param];
    if (typeof resolved === 'function') {
      return resolved(this.coords) as Canvas2DStyleValues[T];
    } else {
      return resolved as Canvas2DStyleValues[T];
    }
  }

  /**
   * Creates a CSS style string for 'font' using a combination of related fields.
   *
   * Constructing the font string this way allows individual components of the
   * font style to be changed without needing to keep track of the entire font
   * string
   */
  protected constructFontString(styles: Canvas2DStyles): CSSStyleDeclaration['font'] {
    const fontSize = this.resolveStyles('fontSize', styles);
    const lineHeight = this.resolveStyles('lineHeight', styles);
    const fontStyle = this.resolveStyles('fontStyle', styles);
    const fontFamily = this.resolveStyles('fontFamily', styles);
    const fontWeight = this.resolveStyles('fontWeight', styles);
    const fontStretch = this.resolveStyles('fontStretch', styles);
    let fontSizePx = typeof fontSize === 'number' ? `${fontSize}px` : undefined;

    if (lineHeight && fontSizePx) {
      fontSizePx = `${fontSize} / ${lineHeight}}`;
    }

    const fontString = [fontSizePx, fontFamily, fontStyle, fontWeight, fontStretch]
      .join(' ')
      .trim();

    return fontString;
  }

  protected assignStylesToContext(styles: Canvas2DStyles) {
    for (const key in styles) {
      const resolvedStyle = this.resolveStyles(key as keyof Canvas2DStyles, styles);
      if (isUndefined(resolvedStyle)) {
        continue;
      }
      if (key === 'transform') {
        this.context.setTransform(resolvedStyle as Canvas2DStyleValues['transform']);
      }
      if (key === 'translation') {
        const { x, y } = resolvedStyle as Canvas2DStyleValues['translation'];
        this.context.translate(this.resolveX(x), this.resolveY(y));
      }
      if (key === 'rotation') {
        if (typeof resolvedStyle === 'number') {
          this.context.rotate(resolvedStyle);
        } else {
          const { rotation, origin } = resolvedStyle as RotationWithOrigin;
          const translateX = this.resolveX(origin.x);
          const translateY = this.resolveY(origin.y);
          this.context.translate(translateX, translateY);
          this.context.rotate(rotation);
          this.context.translate(-translateX, -translateY);
        }
      }
      if (key === 'scale') {
        if ('origin' in (resolvedStyle as Canvas2DStyleValues['scale'])) {
          const {
            origin,
            scale,
            constantLineWidth = false
          } = resolvedStyle as ScaleWithOrigin;
          const translateX = this.resolveX(origin.x);
          const translateY = this.resolveY(origin.y);
          this.context.translate(translateX, translateY);
          this.context.scale(scale.x, scale.y);
          this.context.translate(-translateX, -translateY);
          if (constantLineWidth) {
            this.context.lineWidth =
              this.context.lineWidth * (1 / ((scale.x + scale.y) / 2));
          }
        } else {
          const { x, y } = resolvedStyle as Vector2;
          this.context.scale(x, y);
        }
      }
      if (key === 'lineDash') {
        this.context.setLineDash(resolvedStyle as Canvas2DStyleValues['lineDash']);
      }
      if (key === 'alpha') {
        this.context.globalAlpha = resolvedStyle as Canvas2DStyleValues['alpha'];
      }
      // @ts-ignore
      if (key in this.context && typeof this.context[key] !== 'function') {
        // @ts-ignore
        this.context[key] = this.resolveStyles(key, styles);
      }
    }
    this.context.font = this.constructFontString(styles);
  }

  protected preDrawOps(options: DrawingOptions = {}) {
    if (this.resolveOptions('saveAndRestore', options)) {
      this.context.save();
    }
    if (!this.resolveOptions('skipApplyStyles', options)) {
      this.applyStyles(options.styles);
    }
    if (this.resolveOptions('beginPath', options)) {
      this.context.beginPath();
    }
  }

  protected postDrawOps(options: DrawingOptions) {
    if (this.resolveOptions('closePath', options)) {
      this.context.closePath();
    }
    if (this.resolveOptions('fill', options)) {
      this.context.fill();
    }
    if (this.resolveOptions('stroke', options)) {
      this.context.stroke();
    }
    if (this.resolveOptions('saveAndRestore', options)) {
      this.context.restore();
    }
  }
}
