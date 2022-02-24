import { CanvasCoordinates } from "..";
import { Vector2 } from "../math/Vector2";
export declare enum CanvasDimensions {
    Width = "width",
    Height = "height"
}
declare type ReactiveStyleFunction<T> = (coords: CanvasCoordinates) => T;
declare type ValueOrReactiveStyleFunction<T> = T | ReactiveStyleFunction<T>;
export declare type Canvas2DStyleValues = {
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
    scale: Vector2;
    rotation: number;
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
export declare type Canvas2DStyles = Partial<{
    [Property in keyof Canvas2DStyleValues]: ValueOrReactiveStyleFunction<Canvas2DStyleValues[Property]>;
}>;
export interface DrawingOptions {
    beginPath?: boolean;
    closePath?: boolean;
    fill?: boolean;
    maxTextWidth?: number;
    saveAndRestore?: boolean;
    stroke?: boolean;
    styles?: Canvas2DStyles;
    useNormalCoordinates?: boolean;
}
export interface Canvas2DGraphics {
    context: CanvasRenderingContext2D;
    coords: CanvasCoordinates;
    options: DrawingOptions;
}
export declare class Canvas2DGraphics {
    constructor(context: CanvasRenderingContext2D, coords?: CanvasCoordinates, options?: DrawingOptions);
    getStyleValue<T extends keyof Canvas2DStyleValues>(key: T): Canvas2DStyleValues[T];
    applyStyles(styles: Canvas2DStyles): void;
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
    private getResolvedValueForDrawingOptions;
    private getResolvedValueForStyles;
    /**
     * Creates a CSS style string for 'font' using a combination of related fields.
     *
     * Constructing the font string this way allows individual components of the
     * font style to be changed without needing to keep track of the entire font
     * string
     */
    private constructFontString;
    private assignStylesToContext;
    private preDrawOps;
    private postDrawOps;
}
export {};
