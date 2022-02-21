declare enum YAxisOrientation {
    Up = "up",
    Down = "down"
}
export interface CanvasCoordinates {
    canvas: HTMLCanvasElement;
    nxRange: [number, number];
    nyRange: [number, number];
    clamp: boolean;
    yAxisOrientation: YAxisOrientation;
    baseWidth?: number;
    baseHeight?: number;
    padding?: number;
    paddingX?: number;
    paddingY?: number;
    offsetX?: number;
    offsetY?: number;
    equalPadding?: boolean;
}
declare type CanvasCoordinatesOptions = Partial<CanvasCoordinates>;
export declare class CanvasCoordinates {
    constructor(opts?: CanvasCoordinatesOptions);
    private getBaseWidth;
    private getBaseWidthMinusPadding;
    private getBaseHeight;
    private getBaseHeightMinusPadding;
    private getPaddingX;
    private getPaddingXCanvasUnits;
    private getPaddingY;
    private getPaddingYCanvasUnits;
    private getOffsetX;
    private getOffsetY;
    /**
     * Maps a normalized value n to a x-coordinate on the canvas.
     */
    nx(n: number): number;
    /**
     * Maps a normalized value n to a y-coordinate on the canvas.
     */
    ny(n: number): number;
    /**
     * Maps a canvas x-value to a normalized value n
     */
    xn(x: number): number;
    /**
     * Maps a canvas y-value to a normalized y-value.
     */
    yn(y: number): number;
    /**
     * Returns the width of the coordinate system, in canvas units, with an optional multiplier.
     * @param n - An optional multiplier
     * @returns The width of the coordinate system, in canvas units, multiplied by n
     */
    width(n?: number): number;
    /**
     * Returns the height of the coordinate system, in canvas units, with an optional multiplier.
     * @param n - An optional multiplier
     * @returns The height of the coordinate system, in canvas units, multiplied by n
     */
    height(n?: number): number;
}
export {};
