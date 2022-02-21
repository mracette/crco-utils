import { CanvasCoordinates } from "..";
export declare enum CanvasDimensions {
    Width = "width",
    Height = "height"
}
export declare type Canvas2DStyle = Partial<Pick<CanvasRenderingContext2D, "fillStyle" | "lineWidth" | "lineCap" | "lineJoin" | "lineDashOffset" | "miterLimit" | "strokeStyle" | "textAlign" | "textBaseline"> & {
    fontSize: number;
    lineDash: number[];
    alpha: number;
    lineWidthIsProportionalTo: CanvasDimensions;
    fontSizeIsProportionalTo: CanvasDimensions;
} & Pick<CSSStyleDeclaration, "fontFamily" | "fontStyle" | "fontWeight" | "fontStretch" | "fontVariant" | "lineHeight">>;
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
export declare class Canvas2DGraphics {
    constructor(context: CanvasRenderingContext2D, coords?: CanvasCoordinates, options?: DrawingOptions);
    private assignStyleToContext;
    private preDrawOps;
    private postDrawOps;
    applyStyles(styles: Canvas2DStyle | Canvas2DStyle[]): void;
    applyStyles(...styles: Canvas2DStyle[]): void;
    rect(x?: number, y?: number, width?: number, height?: number, options?: DrawingOptions): void;
    lineSegments(points: number[][], options?: DrawingOptions): void;
    text(text: string, cx: number, cy: number, options?: DrawingOptions): void;
    /**
     * @defaultValue options.beginPath = true
     * @defaultValue options.saveAndRestore = true
     * @defaultValue options.fill = true
     */
    circle(cx: number, cy: number, r: number, options?: DrawingOptions): void;
    clear(): void;
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
    clearCanvasAndState(canvas: HTMLCanvasElement, options?: {
        dpr?: boolean;
    }): void;
}
