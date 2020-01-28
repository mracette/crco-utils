/**
 * Returns a sin function that is scaled based on it's period and bounds
 * @param {object} [period = 1] The increment after which the function repeats its behavior
 * @param {number} [yMin = 1] The minimum value of y
 * @param {number} [yMax = 1] The maximum value of y
 * @param {number} [translateY = 0] The translation along the x-axis
 * @param {number} [translateX = 0] The translation along the x-axis
 * @param {bool} [invert = false] If true, mirrors the function around the midpoint of yMin and yMax
 * @returns {object} A function that take x and returns fn(x)
 */
export const boundedSin = (period = 1, yMin = -1, yMax = 1, translateX = 0, translateY = 0, invert = false) => {
    return (x) => yMin + (yMax - yMin) * (0.5 + (invert ? -1 : 1) * Math.sin(-translateX + Math.PI * x / (period / 2)) / 2) + translateY;
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
export const boundedCos = (period = 1, yMin = -1, yMax = 1, translateX = 0, translateY = 0, invert = false) => {
    return (x) => yMin + (yMax - yMin) * (0.5 + (invert ? -1 : 1) * Math.cos(-translateX + Math.PI * x / (period / 2)) / 2) + translateY;
}

export const clamp = (n, min, max) => {
    return Math.max(Math.min(max, n), min);
}

export const lerp = (n0, n1, t) => {
    return n0 * (1 - t) + n1 * t;
}

export const cartToPolar = (x, y) => {
    return {
        r: Math.sqrt(x * x + y * y),
        theta: Math.atan2(y, x)
    };
}

export const polarToCart = (r, theta) => {
    return {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta)
    }
}

export const solveExpEquation = (x0, y0, x1, y1) => {

    // solve the system of equations ...
    // a*b^(x0) = y0
    // a*b^(x1) = y1

    const b = Math.pow((y1 / y0), (1 / (x1 - x0)));
    const a = y0 / Math.pow(b, x0);
    return { a, b }; // to be used y = ab^x
}


export const linToLog = (w) => {
    /* 
    *
    * linear scale: [1, w] 
    *    log scale: [1, w] 
    * 
    * (x0, y0): (1, 1)
    * (x1, y1): (w, w)
    * 
    * b = log(y0/y1)/(x0-x1)
    * b = log(1/w)/(1-w)
    * 
    * a = y1/exp(b*x1)
    * a = w/exp(b*w)
    * 
    */
    let b = Math.log(1 / w) / (1 - w);
    let a = w / Math.exp(b * w);

    return { a, b };
}