const TAU = Math.PI * 2;

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
const boundedSin = (period = 1, yMin = -1, yMax = 1, translateX = 0, translateY = 0, invert = false) => {
  return x => yMin + (yMax - yMin) * (0.5 + (invert ? -1 : 1) * Math.sin(-translateX + Math.PI * x / (period / 2)) / 2) + translateY;
};
/**
 * Returns a cos function that is scaled based on it's period and bounds
 * @param {object} [period = 1] The increment after which the function repeats its behavior
 * @param {number} [yMin = 1] The minimum value of y
 * @param {number} [yMax = 1] The maximum value of y
 * @param {number} [offset = 0] The translation along the x-axis
 * @param {bool} [invert = false] If true, mirrors the function around the midpoint of yMin and yMax
 * @returns {object} A function that take x and returns fn(x)
 */

const boundedCos = (period = 1, yMin = -1, yMax = 1, translateX = 0, translateY = 0, invert = false) => {
  return x => yMin + (yMax - yMin) * (0.5 + (invert ? -1 : 1) * Math.cos(-translateX + Math.PI * x / (period / 2)) / 2) + translateY;
};
const clamp = (n, min, max) => {
  return Math.max(Math.min(max, n), min);
};
const lerp = (n0, n1, t) => {
  return n0 * (1 - t) + n1 * t;
};
const cartToPolar = (x, y) => {
  return {
    r: Math.sqrt(x * x + y * y),
    theta: Math.atan2(y, x)
  };
};
const polarToCart = (r, theta) => {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  };
};
const solveExpEquation = (x0, y0, x1, y1) => {
  // solve the system of equations ...
  // a*b^(x0) = y0
  // a*b^(x1) = y1
  const b = Math.pow(y1 / y0, 1 / (x1 - x0));
  const a = y0 / Math.pow(b, x0);
  return {
    a,
    b
  }; // to be used y = ab^x
};
const linToLog = w => {
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
  return {
    a,
    b
  };
};

/**
 * @param {object} context The canvas context to draw with
 * @param {*} resolution The number of line segments
 * @param {*} fn A function that takes a normalized input in the [0, 1] range and returns 
 * an [x, y] array that describes the coordinates of the line at that point.
 */
const drawLine2D = (context, resolution, fn) => {
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
};

const rotatePoint = (px, py, cx, cy, angle) => {
  return {
    x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
    y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
  };
};
const equilateralTriangle = (x, y, side, rotation) => {
  const v = [];
  const h = side * Math.sqrt(3) / 2;
  v.push(rotatePoint(x, y - 2 * h / 3, x, y, rotation));
  v.push(rotatePoint(x + side / 2, y * (h / 3), x, y, rotation));
  v.push(rotatePoint(x - side / 2, y * (h / 3), x, y, rotation));
  return v;
};
const isocelesTriangle = (x, y, sideOne, sideTwo, rotation) => {
  const v = [];
  const h = Math.sqrt(sideTwo * sideTwo / 4 - sideOne * sideOne);
  v.push(rotatePoint(x, y - 2 * h / 3, x, y, rotation));
  v.push(rotatePoint(x + sideTwo / 2, y * (h / 3), x, y, rotation));
  v.push(rotatePoint(x - sideTwo / 2, y * (h / 3), x, y, rotation));
  return v;
};
const star = (x, y, scale, rotation) => {
};
const regularPolygon = (nSides, size = 1, cx = 0, cy = 0, closedLoop = true, rotate = false, twoDim = false) => {
  const nPoints = closedLoop ? nSides + 1 : nSides;
  const nCoords = twoDim ? 2 : 3;
  const points = new Float32Array(nPoints * nCoords);

  for (let i = 0; i < nPoints; i++) {
    if (twoDim) {
      points[i * nCoords] = cx + size * Math.cos(i * 2 * Math.PI / nSides);
      points[i * nCoords + 1] = cy + size * Math.sin(i * 2 * Math.PI / nSides);
    } else {
      points[i * nCoords] = cx + size * Math.cos(i * 2 * Math.PI / nSides);
      points[i * nCoords + 1] = rotate ? 0 : cy + size * Math.sin(i * 2 * Math.PI / nSides);
      points[i * nCoords + 2] = rotate ? cy + size * Math.sin(i * 2 * Math.PI / nSides) : 0;
    }
  }

  return points;
};

const createAudioPlayer = (audioCtx, audioFilePath, options = {}) => {
  const fade = options.fade || false;
  const fadeLength = options.fadeLength || null;
  const fadeType = options.fadeType || 'exponential';
  const offlineRendering = options.offlineRendering || false;
  const logLevel = options.logLevel || 'none';
  return new Promise((resolve, reject) => {
    loadArrayBuffer(audioFilePath).then(arrayBuffer => {
      audioCtx.decodeAudioData(arrayBuffer, function (buffer) {
        if (offlineRendering) {
          const bufferLength = options.renderLength || buffer.length;
          const bufferDuration = bufferLength / buffer.sampleRate;
          const offline = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, bufferLength, buffer.sampleRate);

          offline.oncomplete = event => {
            const {
              renderedBuffer
            } = event;
            logLevel === 'debug' && console.log(renderedBuffer);
            const audioPlayer = audioCtx.createBufferSource();
            audioPlayer.buffer = renderedBuffer;
            resolve(audioPlayer);
          };

          const gainNode = offline.createGain();
          const offlineBuffer = offline.createBufferSource();
          offlineBuffer.buffer = buffer;
          offlineBuffer.connect(gainNode);
          gainNode.connect(offline.destination);

          if (fade) {
            gainNode.gain.setValueAtTime(.001, offline.currentTime);
            gainNode.gain.setValueAtTime(1, offline.currentTime + bufferDuration - fadeLength);

            if (fadeType === 'exponential') {
              gainNode.gain.exponentialRampToValueAtTime(1, offline.currentTime + fadeLength);
              gainNode.gain.exponentialRampToValueAtTime(0.001, offline.currentTime + bufferDuration);
            } else if (fadeType === 'linear') {
              gainNode.gain.linearRampToValueAtTime(1, offline.currentTime + fadeLength);
              gainNode.gain.linearRampToValueAtTime(0.001, offline.currentTime + bufferDuration);
            }
          }

          offlineBuffer.start();
          offline.startRendering();
        } else {
          const audioPlayer = audioCtx.createBufferSource();
          audioPlayer.buffer = buffer;
          resolve(audioPlayer);
        }
      }, err => {
        logLevel === 'debug' && console.error(err);
        reject(err);
      });
    }).catch(err => {
      logLevel === 'debug' && console.error(err);
      reject(err);
    });
  });
};
const loadArrayBuffer = audioFilePath => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.responseType = "arraybuffer";
    request.addEventListener('load', () => {
      if (request.status === 200) {
        resolve(request.response);
      }
    });
    request.addEventListener('error', err => {
      reject(err);
    });
    request.open('GET', audioFilePath, true);
    request.send();
  });
};

class Spread {
  /**
   * Creates a canvas coordinate system.
   * @param {object} [options] Optional properties of the system
   * @param {object|number} [options.anchor = 'spacing'] Defines a method (or array of methods, 1 per dimension), which decide
   *  which to preserve in the distribution: equal spacing between points, or full range of the distribution from start to 
   *  end point.
   * @param {object|number} [options.border] The function (or array of functions, 1 per dimension) that include or exclude 
   *  certain points based on a return value.
   * @param {object|number} [options.count] The count (or array of counts, 1 per dimension), that the spread data will contain.
   * @param {object} [options.bounds = [0, 10]] Defines the direction of positive Y (either 'up' or 'down').
   * @param {number} [options.dimensions = 1] Defines how many data dimensions the spread will contain.
   * @param {object} [options.distribution = (n => n)] A function (or array of functions, 1-per dimension) that determine how
   *  the spread data will be calculated. Distribution is passed two parameters: value and params.
   */
  constructor(options) {
    const defaults = {
      anchor: 'spacing',
      border: undefined,
      bounds: [0, 1],
      count: 10,
      dimensions: 1,
      distribution: n => n
    };
    Object.assign(this, { ...defaults,
      ...options
    });
    this.flatData = [];
    this.data = this.getData(this.count, this.bounds, this.dimensions);
  }

  getData() {
    const ndArray = this.ndArray(this.getDimensionCounts());

    const fillRange = (range, dim, accumulation) => {
      const bounds = this.getBounds(dim);
      const anchor = this.getAnchor(dim);
      const distribution = this.getDistribution(dim);
      const units = (bounds[1] - bounds[0]) / range.length;

      for (let i = 0; i < range.length; i++) {
        const clone = [...accumulation];
        let value;

        switch (anchor) {
          case 'spacing':
            value = distribution(bounds[0] + units * (i + 0.5), {
              d: dim,
              i
            });
            break;

          case 'endpoints':
            value = distribution(bounds[0] + units * i, {
              d: dim,
              i
            });
            break;

          default:
            throw new Error('Anchor type not valid. Choose from (spacing, endpoints).');
        }

        clone.push(value);

        if (dim < this.dimensions) {
          fillRange(range[i], dim + 1, clone);
        } else {
          if (this.border === undefined || this.border(...clone)) {
            range[i] = clone;
            this.flatData.push(clone);
          }
        }
      }
    };

    fillRange(ndArray, 1, []);
    return ndArray;
  }

  ndArray(dimensions) {
    if (dimensions.length > 0) {
      const dim = dimensions[0];
      const rest = dimensions.slice(1);
      const newArray = new Array();

      for (let i = 0; i < dim; i++) {
        newArray[i] = this.ndArray(rest);
      }

      return newArray;
    } else {
      return undefined;
    }
  }

  getAnchor(d) {
    if (typeof d === 'number') {
      if (Array.isArray(this.anchor)) {
        if (this.anchor[d - 1] !== undefined) {
          return this.anchor[d - 1];
        } else {
          return undefined;
        }
      } else {
        return this.anchor;
      }
    }
  }

  getBounds(d) {
    if (typeof d === 'number') {
      if (Array.isArray(this.bounds[0])) {
        if (this.bounds[d - 1] !== undefined) {
          return this.bounds[d - 1];
        } else {
          return undefined;
        }
      } else {
        return this.bounds;
      }
    }
  }

  getCount(d) {
    if (typeof d === 'number') {
      if (Array.isArray(this.count)) {
        if (this.count[d - 1] !== undefined) {
          return this.count[d - 1];
        } else {
          return undefined;
        }
      } else {
        return this.count;
      }
    }
  }

  getDistribution(d) {
    if (typeof d === 'number') {
      if (Array.isArray(this.distribution)) {
        if (this.distribution[d - 1] !== undefined) {
          return this.distribution[d - 1];
        } else {
          return undefined;
        }
      } else {
        return this.distribution;
      }
    }
  }

  getDimensionCounts() {
    const counts = [];

    for (let i = 1; i <= this.dimensions; i++) {
      counts[i - 1] = this.getCount(i);
    }

    return counts;
  }

}

class CanvasCoordinates {
  /**
   * Creates a canvas coordinate system.
   * @param {object} [options] Optional properties of the system
   * @param {object} [options.nxRange = [-1, 1]] An array that represents the bounds of the normalized x axis
   * @param {object} [options.nyRange = [-1, 1]] An array that represents the bounds of the normalized y axis
   * @param {number} [options.padding = 0] Defines padding as a proportion of the canvas width
   * @param {number} [options.paddingX = 0] Defines X padding as a proportion of the canvas width (if defined, overrides options.padding)
   * @param {number} [options.paddingY = 0] Defines Y padding as a proportion of the canvas height (if defined, overrides options.padding)
   * @param {number} [options.xOffset = 0] Defines the canvas coords of nx(0)
   * @param {number} [options.yOffset = 0] Defines the canvas coords of ny(0)
   * @param {object} [options.canvas] The canvas to map the coordinate system to
   * @param {number} [options.baseWidth] If specified, coordinates will map to this width instead of the canvas width (px)
   * @param {number} [options.baseHeight] If specified, coordinates will map to this height instead of the canvas height (px)
   * @param {boolean} [options.clamp = false] Whether or not to clamp coordinate that are outside of the bounds
   * @param {number} [options.orientationY = 'up'] Defines the direction of positive Y (either 'up' or 'down').
   */
  constructor(options = {}) {
    if (typeof options.baseHeight === 'undefined' && typeof options.canvas === 'undefined' || typeof options.baseWidth === 'undefined' && typeof options.canvas === 'undefined') {
      throw new Error('Invalid options. A canvas element must be supplied if baseHeight or baseWidth are not defined.');
    }

    const defaults = {
      nxRange: [-1, 1],
      nyRange: [-1, 1],
      padding: 0,
      paddingX: 0,
      paddingY: 0,
      xOffset: 0,
      yOffset: 0,
      canvas: null,
      clamp: false,
      baseHeight: null,
      baseWidth: null,
      orientationY: 'down'
    };
    Object.assign(this, { ...defaults,
      ...options
    });
    this.width = this.baseWidth || this.canvas.width;
    this.height = this.baseHeight || this.canvas.height;
  }
  /**
   * Maps a normalized x-value to a canvas x-value
   * @param {object} n A normalized x-value in the range [0, 1]
   * @param {number} [options.padding] Defines padding as a proportion of the canvas width (if defined, overrides padding settings for the system)
   */


  nx(n, options = {}) {
    let padding;
    this.clamp && (n = clamp(n, this.nxRange[0], this.nxRange[1]));

    if (typeof options.padding === 'number') {
      padding = options.padding * this.width;
    } else {
      padding = (this.paddingX || this.padding) * this.width;
    }

    return padding + this.xOffset + (n - this.nxRange[0]) / (this.nxRange[1] - this.nxRange[0]) * (this.width - 2 * padding);
  }
  /**
   * Maps a canvas x-value to a normalized x-value
   * @param {object} n A canvas x-value in the range [0, canvas.width]
   * @param {number} [options.padding] Defines padding as a proportion of the canvas width (if defined, overrides padding settings for the system)
   */


  xn(x, options = {}) {
    let padding;

    if (typeof options.padding === 'number') {
      padding = options.padding * this.width;
    } else {
      padding = (this.paddingX || this.padding) * this.width;
    }

    return (x - padding - this.xOffset) / (this.width - padding * 2);
  }
  /**
   * Maps a normalized y-value to a canvas y-value
   * @param {object} n A normalized y-value in the range [0, 1]
   * @param {number} [options.padding] Defines padding as a proportion of the canvas width (if defined, overrides padding settings for the system)
   * @param {number} [options.paddingY] Defines padding as a proportion of the canvas height (if defined, overrides padding settings for the system)
   */


  ny(n, options = {}) {
    let padding;
    this.clamp && (n = clamp(n, this.nyRange[0], this.nyRange[1]));

    if (typeof options.paddingY === 'number') {
      padding = options.paddingY * this.height;
    } else if (typeof options.padding === 'number') {
      padding = options.padding * this.width;
    } else {
      padding = typeof this.paddingY === 'number' ? this.paddingY * this.height : this.padding * this.width;
    }

    if (this.orientationY === 'down') {
      return padding + this.yOffset + (n - this.nyRange[0]) / (this.nyRange[1] - this.nyRange[0]) * (this.height - 2 * padding);
    } else if (this.orientationY === 'up') {
      return this.height - padding - this.yOffset - (n - this.nyRange[0]) / (this.nyRange[1] - this.nyRange[0]) * (this.height - 2 * padding);
    }
  }
  /**
   * Maps a canvas y-value to a normalized y-value
   * @param {object} n A canvas y-value in the range [0, canvas.height]
   * @param {number} [options.padding] Defines padding as a proportion of the canvas height (if defined, overrides padding settings for the system)
   */


  yn(y, options = {}) {
    let padding;

    if (typeof options.paddingY === 'number') {
      padding = options.paddingY * this.height;
    } else if (typeof options.padding === 'number') {
      padding = options.padding * this.width;
    } else {
      padding = typeof this.paddingY === 'number' ? this.paddingY * this.height : this.padding * this.width;
    }

    if (this.orientationY === 'down') {
      return (y - padding - this.yOffset) / (this.height - padding * 2);
    } else if (this.orientationY === 'up') {
      return (this.height - y - padding - this.yOffset) / (this.height - padding * 2);
    }
  }

  getWidth() {
    return this.nx(this.nxRange[1]) - this.nx(this.nxRange[0]);
  }

  getHeight() {
    if (this.orientationY === 'down') {
      return this.ny(this.nyRange[1]) - this.ny(this.nyRange[0]);
    } else if (this.orientationY === 'up') {
      return this.ny(this.nyRange[0]) - this.ny(this.nyRange[1]);
    } else {
      return undefined;
    }
  }

}

export { CanvasCoordinates, Spread, TAU, boundedCos, boundedSin, cartToPolar, clamp, createAudioPlayer, drawLine2D, equilateralTriangle, isocelesTriangle, lerp, linToLog, loadArrayBuffer, polarToCart, regularPolygon, rotatePoint, solveExpEquation, star };