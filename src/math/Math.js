export class MathUtil {

    constructor() {

    }

    /**
     * Returns a sin function that is scaled based on it's period and bounds
     * @param {object} [period = 1] The increment after which the function repeats its behavior
     * @param {number} [yMin = 1] The minimum value of y
     * @param {number} [yMax = 1] The maximum value of y
     * @param {number} [offset = 0] The translation along the x-axis
     * @param {bool} [invert = false] If true, mirrors the function around the midpoint of yMin and yMax
     * @returns {object} A function that take x and returns fn(x)
     */
    static boundedSin(period = 1, yMin = -1, yMax = 1, offset = 0, invert = false) {
        return (x) => yMin + (yMax - yMin) * (0.5 + (invert ? -1 : 1) * Math.sin(offset + Math.PI * x / (period / 2)) / 2);
    }

    /**
     * Returns a cos function that is scaled based on it's period and bounds
     * @param {object} [period = 1] The increment after which the function repeats its behavior
     * @param {number} [yMin = 1] The minimum value of y
     * @param {number} [yMax = 1] The maximum value of y
     * @param {number} [offset = 0] The translation along the x-axis
     * @param {bool} [invert = false] If true, mirrors the function around the midpoint of yMin and yMax
     * @returns {object} A function that take x and returns fn(x)
     */
    static boundedCos(period = 1, yMin = -1, yMax = 1, offset = 0, invert = false) {
        return (x) => yMin + (yMax - yMin) * (0.5 + (invert ? -1 : 1) * Math.cos(offset + Math.PI * x / (period / 2)) / 2);
    }

    static clamp(n, min, max) {
        return Math.max(Math.min(max, n), min);
    }

    static lerp(n0, n1, t) {
        return n0 * (1 - t) + n1 * t
    }

    static rotatePoint(px, py, cx, cy, angle) {
        return {
            x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
            y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
        }
    }

}