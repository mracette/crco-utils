
/**
 * @param {object} context The canvas context to draw with
 * @param {*} resolution The number of line segments
 * @param {*} fn A function that takes a normalized input in the [0, 1] range and returns 
 * an [x, y] array that describes the coordinates of the line at that point.
 */

export const drawLine2D = (context, resolution, fn) => {
    context.beginPath();
    for (let i = 0; i <= resolution; i++) {
        const coords = fn(i / resolution);
        if (i === 0) {
            context.moveTo(coords[0], coords[1]);
        } else {
            context.lineTo(coords[0], coords[1]);
        }
    }
    context.stroke();
}