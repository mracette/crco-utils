export interface BoundedSineParams {
    /**
     * The value of fx(0) before translations.
     * @defaultValue 0
     */
    yStart?: number;
    /**
     * The minimum y-value.
     * @defaultValue -1
     */
    yMin?: number;
    /**
     * The maximum y-value.
     * @defaultValue 1
     */
    yMax?: number;
    /**
     * The length of one cycle of the curve.
     * @defaultValue 1
     */
    period?: number;
    /**
     * Translation applied in the x-direction.
     * @defaultValue 0
     */
    translateX?: number;
    /**
     * Translation applied in the y-direction.
     * @defaultValue 0
     */
    translateY?: number;
    /**
     * Inverts the sine function.
     * @defaultValue false
     */
    invert?: boolean;
}
export declare type BoundedSineFunction = (n: number) => number;
/**
 * Returns a sine function fx such that fx(0) = yStart,
 * and yMin \<= fx(x) \<= yMax.
 */
export declare const boundedSine: ({ yStart, yMin, yMax, period, translateX, translateY, invert }?: BoundedSineParams) => BoundedSineFunction;
