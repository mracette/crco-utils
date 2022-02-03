import { CanvasCoordinates, isUndefined, TAU } from "..";
import { DPR } from "../js/constants";

export enum CanvasDimensions {
  Width = "width",
  Height = "height"
}

export type Canvas2DStyle = Partial<
  Pick<
    CanvasRenderingContext2D,
    | "fillStyle"
    | "lineWidth"
    | "lineCap"
    | "lineJoin"
    | "lineDashOffset"
    | "miterLimit"
    | "strokeStyle"
    | "textAlign"
    | "textBaseline"
  > & {
    fontSize: number;
    lineDash: number[];
    alpha: number;
    lineWidthIsProportionalTo: CanvasDimensions;
    fontSizeIsProportionalTo: CanvasDimensions;
  } & Pick<
      CSSStyleDeclaration,
      | "fontFamily"
      | "fontStyle"
      | "fontWeight"
      | "fontStretch"
      | "fontVariant"
      | "lineHeight"
    >
>;

export interface DrawingOptions {
  beginPath?: boolean;
  closePath?: boolean;
  fill?: boolean;
  maxTextWidth?: number;
  saveAndRestore?: boolean;
  stroke?: boolean;
  styles?: Canvas2DStyle | Canvas2DStyle[];
  useNormalCoordinates?: boolean;
}

export interface Canvas2DGraphics {
  context: CanvasRenderingContext2D;
  coords: CanvasCoordinates;
  options: DrawingOptions;
}

export class Canvas2DGraphics {
  constructor(
    context: CanvasRenderingContext2D,
    coords?: CanvasCoordinates,
    options?: DrawingOptions
  ) {
    this.context = context;
    this.coords = coords ?? new CanvasCoordinates({ canvas: context.canvas });

    const defaults: DrawingOptions = {
      beginPath: true,
      closePath: false,
      fill: false,
      maxTextWidth: undefined,
      saveAndRestore: true,
      stroke: false,
      styles: undefined,
      useNormalCoordinates: false
    };

    this.options = { ...defaults, ...options };
  }

  private assignStyleToContext(style: Canvas2DStyle) {
    // run font and font size up front, because fontSize must run after font
    for (const key in style) {
      if (key === "lineDash") {
        this.context.setLineDash(style[key]!);
      }
      if (key === "alpha") {
        this.context.globalAlpha = style[key]!;
      }
      if (key === "lineWidth" && style.lineWidthIsProportionalTo === "width") {
        this.context.lineWidth = this.coords.width(style[key]);
        delete style.lineWidthIsProportionalTo;
      }
      if (key === "lineWidth" && style.lineWidthIsProportionalTo === "height") {
        this.context.lineWidth = this.coords.height(style[key]);
        delete style.lineWidthIsProportionalTo;
      }
      if (!(key in this.context)) {
        continue;
      }
      // @ts-ignore
      this.context[key] = style[key];
    }
    // set font as a combination of related fields
    let fontSize;
    if (style.fontSizeIsProportionalTo === "width") {
      fontSize = this.coords.width(style.fontSize);
    } else if (style.fontSizeIsProportionalTo === "height") {
      fontSize = this.coords.height(style.fontSize);
    } else {
      // eslint-disable-next-line prefer-destructuring
      fontSize = style.fontSize;
    }
    fontSize = fontSize + "px";
    if (style.lineHeight) {
      fontSize = fontSize + "/" + style.lineHeight;
    }
    this.context.font = [
      fontSize,
      style.fontFamily,
      style.fontStyle,
      style.fontWeight,
      style.fontStretch
    ].join(" ");
  }

  private preDrawOps(options: DrawingOptions = {}) {
    (options.saveAndRestore ?? this.options.saveAndRestore) && this.context.save();
    // apply base styles first
    this.options.styles && this.applyStyles(this.options.styles);
    // override with more specific styles
    options.styles && this.applyStyles(options.styles);
    (options.beginPath ?? this.options.beginPath) && this.context.beginPath();
  }

  private postDrawOps(options: DrawingOptions) {
    (options.closePath ?? this.options.closePath) && this.context.closePath();
    (options.fill ?? this.options.fill) && this.context.fill();
    (options.stroke ?? this.options.stroke) && this.context.stroke();
    (options.saveAndRestore ?? this.options.saveAndRestore) &&
      this.context.restore();
  }

  public applyStyles(styles: Canvas2DStyle | Canvas2DStyle[]): void;
  public applyStyles(...styles: Canvas2DStyle[]): void;
  public applyStyles(styles: Canvas2DStyle[] | Canvas2DStyle): void {
    if (Array.isArray(styles)) {
      for (const style of styles) {
        this.assignStyleToContext(style);
      }
    } else {
      this.assignStyleToContext(styles);
    }
  }

  public rect(
    x = 0,
    y = 0,
    width = 1,
    height = 1,
    options: DrawingOptions = {}
  ): void {
    const { useNormalCoordinates = this.options.useNormalCoordinates } = options;
    this.preDrawOps(options);
    const xAdj = useNormalCoordinates ? this.coords.nx(x) : x;
    const yAdj = useNormalCoordinates ? this.coords.ny(y) : y;
    const widthAdj = useNormalCoordinates ? this.coords.width(width) : width;
    const heightAdj = useNormalCoordinates ? this.coords.height(height) : height;
    this.context.rect(xAdj, yAdj, widthAdj, heightAdj);
    this.postDrawOps(options);
  }

  public lineSegments(points: number[][], options: DrawingOptions = {}): void {
    const { useNormalCoordinates = this.options.useNormalCoordinates } = options;
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

  public text(text: string, cx: number, cy: number, options: DrawingOptions = {}) {
    const { useNormalCoordinates = this.options.useNormalCoordinates } = options;
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
    const { useNormalCoordinates = this.options.useNormalCoordinates } = options;
    this.preDrawOps(options);
    this.context.arc(
      useNormalCoordinates ? this.coords.nx(cx) : cx,
      useNormalCoordinates ? this.coords.ny(cy) : cy,
      r,
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
}
