export interface AspectRatio {
    x: number;
    y: number;
}
export declare const aspectRatioResize: (element: HTMLElement, aspect: AspectRatio) => ResizeObserver | null;
