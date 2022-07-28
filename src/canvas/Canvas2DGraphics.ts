import { CanvasCoordinates, isUndefined, TAU } from "..";
import { DPR } from "../js/constants";
import { Vector2 } from "../math/Vector2";

export enum CanvasDimensions {
  Width = "width",
  Height = "height"
}

type ReactiveStyleFunction<T> = (coords: CanvasCoordinates) => T;

type ValueOrReactiveStyleFunction<T> = T | ReactiveStyleFunction<T>;

type RotationWithOrigin = { rotation: number; origin: Vector2 };

type ScaleWithOrigin = { scale: Vector2; origin: Vector2 };

export type Canvas2DStyleValues = {
  /**
   * Directly from the CanvasRenderingContext2D API
   */
  fillStyle: CanvasRenderingContext2D["fillStyle"];
  lineWidth: CanvasRenderingContext2D["lineWidth"];
  lineCap: CanvasRenderingContext2D["lineCap"];
  lineJoin: CanvasRenderingContext2D["lineJoin"];
  lineDashOffset: CanvasRenderingContext2D["lineDashOffset"];
  miterLimit: CanvasRenderingContext2D["miterLimit"];
  strokeStyle: CanvasRenderingContext2D["strokeStyle"];
  textAlign: CanvasRenderingContext2D["textAlign"];
  textBaseline: CanvasRenderingContext2D["textBaseline"];
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
  fontSizeIsProportionalTo: CanvasDimensions;
  /**
   * Directly from the CSSStyleDeclaration
   */
  fontFamily: CSSStyleDeclaration["fontFamily"];
  fontStyle: CSSStyleDeclaration["fontStyle"];
  fontWeight: CSSStyleDeclaration["fontWeight"];
  fontStretch: CSSStyleDeclaration["fontStretch"];
  fontVariant: CSSStyleDeclaration["fontVariant"];
  lineHeight: CSSStyleDeclaration["lineHeight"];
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
  scalarNormalization?: "width" | "height" | false;
}

export interface InitializationOptions {
  coords?: CanvasCoordinates;
}

export interface Canvas2DGraphics {
  context: CanvasRenderingContext2D;
  coords: CanvasCoordinates;
  options: Omit<DrawingOptions, "coords">;
}

export class Canvas2DGraphics {
  constructor(
    context: CanvasRenderingContext2D,
    /**
     * @defaultValue options.beginPath = true
     */
    options: DrawingOptions & InitializationOptions = {}
  ) {
    this.context = context;
    this.coords =
      options.coords ?? new CanvasCoordinates({ canvas: context.canvas });

    const defaults: DrawingOptions = {
      beginPath: true,
      closePath: false,
      fill: false,
      maxTextWidth: undefined,
      saveAndRestore: true,
      stroke: false,
      styles: {},
      useNormalCoordinates: false,
      scalarNormalization: false
    };

    this.options = { ...defaults, ...options };
  }

  public getStyleValue<T extends keyof Canvas2DStyleValues>(
    key: T
  ): Canvas2DStyleValues[T] {
    return this.resolveValueForStyles(key);
  }

  public applyStyles(styles?: Canvas2DStyles): void {
    this.assignStylesToContext(this.options.styles!);
    if (styles) {
      this.assignStylesToContext(styles);
    }
  }

  public rect(
    x = 0,
    y = 0,
    width = 1,
    height = 1,
    options: DrawingOptions = {}
  ): void {
    const useNormalCoordinates = this.resolveValueForDrawingOptions(
      "useNormalCoordinates",
      options
    );
    this.preDrawOps(options);
    const xAdj = useNormalCoordinates ? this.coords.nx(x) : x;
    const yAdj = useNormalCoordinates ? this.coords.ny(y) : y;
    const widthAdj = useNormalCoordinates
      ? this.coords.width(width / (this.coords.nxRange[1] - this.coords.nxRange[0]))
      : width;
    const heightAdj = useNormalCoordinates
      ? this.coords.height(
          height / (this.coords.nyRange[1] - this.coords.nyRange[0])
        )
      : height;
    this.context.rect(xAdj, yAdj, widthAdj, heightAdj);
    this.postDrawOps(options);
  }

  public lineSegments(points: number[][], options: DrawingOptions = {}): void {
    const useNormalCoordinates = this.resolveValueForDrawingOptions(
      "useNormalCoordinates",
      options
    );
    this.preDrawOps(options);
    for (let i = 0; i < points.length; i++) {
      const x = useNormalCoordinates ? this.coords.nx(points[i][0]) : points[i][0];
      const y = useNormalCoordinates ? this.coords.ny(points[i][1]) : points[i][1];
      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }
    this.postDrawOps(options);
  }

  public text(
    text: string,
    cx: number,
    cy: number,
    options: DrawingOptions = {}
  ): void {
    const useNormalCoordinates = this.resolveValueForDrawingOptions(
      "useNormalCoordinates",
      options
    );
    this.preDrawOps(options);
    this.context.fillText(
      text,
      useNormalCoordinates ? this.coords.nx(cx) : cx,
      useNormalCoordinates ? this.coords.ny(cy) : cy,
      options.maxTextWidth ?? this.options.maxTextWidth
    );
    this.postDrawOps(options);
  }

  /**
   * @defaultValue options.beginPath = true
   * @defaultValue options.saveAndRestore = true
   * @defaultValue options.fill = true
   */
  public circle(
    cx: number,
    cy: number,
    r: number,
    options: DrawingOptions = {}
  ): void {
    this.preDrawOps(options);
    this.context.arc(
      this.resolveXValue(cx, options),
      this.resolveYValue(cy, options),
      this.resolveScalarValue(r, options),
      0,
      TAU
    );
    this.postDrawOps(options);
  }

  public clear(): void {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
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

  private resolveXValue(value: number, options: DrawingOptions = {}) {
    const useNormalCoordinates = this.resolveValueForDrawingOptions(
      "useNormalCoordinates",
      options
    );
    return useNormalCoordinates ? this.coords.nx(value) : value;
  }

  private resolveYValue(value: number, options: DrawingOptions = {}) {
    const useNormalCoordinates = this.resolveValueForDrawingOptions(
      "useNormalCoordinates",
      options
    );
    return useNormalCoordinates ? this.coords.ny(value) : value;
  }

  private resolveScalarValue(value: number, options: DrawingOptions = {}) {
    const scalarNormalization = this.resolveValueForDrawingOptions(
      "scalarNormalization",
      options
    );
    if (scalarNormalization === "width") {
      return this.coords.width(value);
    }
    if (scalarNormalization === "height") {
      return this.coords.height(value);
    }
    return value;
  }

  private resolveValueForDrawingOptions<T extends keyof DrawingOptions>(
    param: T,
    options?: DrawingOptions
  ): DrawingOptions[T] {
    return (
      options && param in options ? options[param] : this.options[param]
    ) as DrawingOptions[T];
  }

  private resolveValueForStyles<T extends keyof Canvas2DStyles>(
    param: T,
    styles?: Canvas2DStyles
  ): Canvas2DStyleValues[T] {
    const resolved =
      styles && param in styles ? styles[param] : this.options.styles![param];
    if (typeof resolved === "function") {
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
  private constructFontString(styles: Canvas2DStyles): CSSStyleDeclaration["font"] {
    const fontSize = this.resolveValueForStyles("fontSize", styles);
    const lineHeight = this.resolveValueForStyles("lineHeight", styles);
    const fontStyle = this.resolveValueForStyles("fontStyle", styles);
    const fontFamily = this.resolveValueForStyles("fontFamily", styles);
    const fontWeight = this.resolveValueForStyles("fontWeight", styles);
    const fontStretch = this.resolveValueForStyles("fontStretch", styles);

    let fontSizePx = typeof fontSize === "number" ? `${fontSize}px` : undefined;

    if (lineHeight && fontSizePx) {
      fontSizePx = `${fontSize} / ${lineHeight}}`;
    }

    return [fontSizePx, fontFamily, fontStyle, fontWeight, fontStretch].join(" ");
  }

  private assignStylesToContext(styles: Canvas2DStyles) {
    const useNormalCoordinates = this.resolveValueForDrawingOptions(
      "useNormalCoordinates"
    );
    for (const key in styles) {
      const resolvedValue = this.resolveValueForStyles(
        key as keyof Canvas2DStyles,
        styles
      );
      if (isUndefined(resolvedValue)) {
        continue;
      }
      if (key === "transform") {
        this.context.setTransform(resolvedValue as Canvas2DStyleValues["transform"]);
      }
      if (key === "translation") {
        const { x, y } = resolvedValue as Canvas2DStyleValues["translation"];
        this.context.translate(
          useNormalCoordinates ? this.coords.nx(x) : x,
          useNormalCoordinates ? this.coords.ny(y) : y
        );
      }
      if (key === "rotation") {
        if (typeof resolvedValue === "number") {
          this.context.rotate(resolvedValue);
        } else {
          const { rotation, origin } = resolvedValue as RotationWithOrigin;
          const translateX = useNormalCoordinates
            ? this.coords.nx(origin.x)
            : origin.x;
          const translateY = useNormalCoordinates
            ? this.coords.ny(origin.y)
            : origin.y;
          this.context.translate(translateX, translateY);
          this.context.rotate(rotation);
          this.context.translate(-translateX, -translateY);
        }
      }
      if (key === "scale") {
        if ("origin" in (resolvedValue as Canvas2DStyleValues["scale"])) {
          const { origin, scale } = resolvedValue as ScaleWithOrigin;
          const translateX = useNormalCoordinates
            ? this.coords.nx(origin.x)
            : origin.x;
          const translateY = useNormalCoordinates
            ? this.coords.ny(origin.y)
            : origin.y;
          this.context.translate(translateX, translateY);
          this.context.scale(scale.x, scale.y);
          this.context.translate(-translateX, -translateY);
        } else {
          const { x, y } = resolvedValue as Vector2;
          this.context.scale(x, y);
        }
      }
      if (key === "lineDash") {
        this.context.setLineDash(resolvedValue as Canvas2DStyleValues["lineDash"]);
      }
      if (key === "alpha") {
        this.context.globalAlpha = resolvedValue as Canvas2DStyleValues["alpha"];
      }
      // @ts-ignore
      if (key in this.context && typeof this.context[key] !== "function") {
        // @ts-ignore
        this.context[key] = this.resolveValueForStyles(key, styles);
      }
    }
    this.context.font = this.constructFontString(styles);
  }

  private preDrawOps(options: DrawingOptions = {}) {
    if (this.resolveValueForDrawingOptions("saveAndRestore")) {
      this.context.save();
    }
    this.applyStyles(options.styles);
    if (this.resolveValueForDrawingOptions("beginPath")) {
      this.context.beginPath();
    }
  }

  private postDrawOps(options: DrawingOptions) {
    if (this.resolveValueForDrawingOptions("closePath", options)) {
      this.context.closePath();
    }
    if (this.resolveValueForDrawingOptions("fill", options)) {
      this.context.fill();
    }
    if (this.resolveValueForDrawingOptions("stroke", options)) {
      this.context.stroke();
    }
    if (this.resolveValueForDrawingOptions("saveAndRestore", options)) {
      this.context.restore();
    }
  }
}
