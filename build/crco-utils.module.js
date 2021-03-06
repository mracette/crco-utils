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
const normalize = (n, min, max, clamp = false) => {
  return clamp ? (n - min) / (max - min) : (clamp(n, min, max) - min) / (max - min);
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
 * Approximates a [0, 1] gaussian distribution and returns a random number from that distribution.
 * @param {number} [factor = 6] The higher the factor, the more closely the distribution resembles a Gaussian distribution. Tradeoff is speed.
 */

const gaussianRand = (factor = 6) => {
  let rand = 0;

  for (let i = 0; i < factor; i += 1) {
    rand += Math.random();
  }

  return rand / factor;
};
/**
 * Calculates the point where the line segment from (0, 0, 0) to (x, y, z) intersects a sphere with radius r
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @param {number} z the z coordinate
 * @param {number} r the radius of the sphere
 */

const coordsToSphere = (x, y, z, r) => {
  const d = Math.sqrt(x * x + y * y + z * z);
  const nX = r * x / d;
  const nY = r * y / d;
  const nZ = r * z / d;
  return {
    x: nX,
    y: nY,
    z: nZ
  };
};

/**
 * Alternate to ctx.save() that will persist state following a canvas resize event.
 * https://stackoverflow.com/questions/48044951/canvas-state-lost-after-changing-size
 *
 * In its current implementation, properties need to be hardcoded. I'd love a solution where
 * the browsers CanvasRenderingContext2D implementation is used to generate the property list
 * (without the overhead of creating a new canvas element every time)
 *
 * @param {CanvasRenderingContext2D} context The context to save.
 *
 */
const saveCtx2d = context => {
  const props = ["strokeStyle", "fillStyle", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "lineDashOffset", "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor", "globalCompositeOperation", "font", "textAlign", "textBaseline", "direction", "imageSmoothingEnabled"];
  const state = {};
  props.forEach(prop => {
    try {
      state[prop] = context[prop];
    } catch (err) {
      console.log(`Could not fetch canvas property. Update props list with latest from the Canvas API. ${err}`);
    }
  });
  return state;
};
/**
 * Alternate to ctx.restore() that will persist state following a canvas resize event.
 * https://stackoverflow.com/questions/48044951/canvas-state-lost-after-changing-size
 *
 * @param {CanvasRenderingContext2D} context The context to restore.
 * @param {object} state A mapping of properties to values representing the state to restore.
 *
 */

const restoreCtx2d = (context, state) => {
  for (let prop in state) {
    context[prop] = state[prop];
  }
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
const createBlobFromDataURL = dataURL => {
  return new Promise(resolve => {
    const splitIndex = dataURL.indexOf(",");

    if (splitIndex === -1) {
      resolve(new window.Blob());
      return;
    }

    const base64 = dataURL.slice(splitIndex + 1);
    const byteString = window.atob(base64);
    const type = dataURL.slice(0, splitIndex);
    const mimeMatch = /data:([^;]+)/.exec(type);
    const mime = (mimeMatch ? mimeMatch[1] : "") || undefined;
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    resolve(new window.Blob([ab], {
      type: mime
    }));
  });
};
/**
 * @param {object} dataUrl The canvas context to draw with
 * @param {string} filename The filename for the output
 */

const canvasToPng = (canvas, filename) => {
  const dataUrl = canvas.toDataURL("image/png");
  createBlobFromDataURL(dataUrl).then(blob => {
    console.log(blob);
    const link = document.createElement("a");
    link.style.visibility = "hidden";
    link.target = "_blank";
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);

    link.onclick = () => {
      link.onclick = () => {};

      setTimeout(() => {
        window.URL.revokeObjectURL(blob);
        if (link.parentElement) link.parentElement.removeChild(link);
        link.removeAttribute("href");
      });
    };

    link.click();
  });
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
  const fadeType = options.fadeType || "exponential";
  const offlineRendering = options.offlineRendering || false;
  const logLevel = options.logLevel || "none";
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
            logLevel === "debug" && console.log(renderedBuffer);
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
            gainNode.gain.setValueAtTime(0.001, offline.currentTime);
            gainNode.gain.setValueAtTime(1, offline.currentTime + bufferDuration - fadeLength);

            if (fadeType === "exponential") {
              gainNode.gain.exponentialRampToValueAtTime(1, offline.currentTime + fadeLength);
              gainNode.gain.exponentialRampToValueAtTime(0.001, offline.currentTime + bufferDuration);
            } else if (fadeType === "linear") {
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
        logLevel === "debug" && console.error(err);
        reject(err);
      });
    }).catch(err => {
      logLevel === "debug" && console.error(err);
      reject(err);
    });
  });
};
const loadArrayBuffer = audioFilePath => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.responseType = "arraybuffer";
    request.addEventListener("load", () => {
      if (request.status === 200) {
        resolve(request.response);
      }
    });
    request.addEventListener("error", err => {
      reject(err);
    });
    request.open("GET", audioFilePath, true);
    request.send();
  });
};

const moonYellow = "#f6f2d5";
const offBlack = "#1f262f";
const hotPink = "#ff4c7a";
const hotGreen = "#00e19e";
const hotBlue = "#00f9ff";

const testStringShort = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
const testStringMedium = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const testStringLong = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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
      anchor: "spacing",
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
          case "spacing":
            value = distribution(bounds[0] + units * (i + 0.5), {
              d: dim,
              i
            });
            break;

          case "endpoints":
            value = distribution(bounds[0] + units * i, {
              d: dim,
              i
            });
            break;

          default:
            throw new Error("Anchor type not valid. Choose from (spacing, endpoints).");
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
    if (typeof d === "number") {
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
    if (typeof d === "number") {
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
    if (typeof d === "number") {
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
    if (typeof d === "number") {
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
   * @param   {object} [opts] Optional properties of the system
   * @param   {object} [opts.canvas] The canvas to map the coordinate system to
   * @param   {number} [opts.baseWidth] If specified, coordinates will map to this width instead of the canvas width (px)
   * @param   {number} [opts.baseHeight] If specified, coordinates will map to this height instead of the canvas height (px)
   * @param   {object} [opts.nxRange = [-1, 1]] An array that represents the bounds of the normalized x axis
   * @param   {object} [opts.nyRange = [-1, 1]] An array that represents the bounds of the normalized y axis
   * @param   {number} [opts.padding = 0] Defines padding as a proportion of the canvas width
   * @param   {number} [opts.paddingX = 0] Defines X padding as a proportion of the canvas width (if defined, overrides opts.padding)
   * @param   {number} [opts.paddingY = 0] Defines Y padding as a proportion of the canvas height (if defined, overrides opts.padding)
   * @param   {number} [opts.offsetX = 0] Defines the canvas coords of nx(0)
   * @param   {number} [opts.offsetY = 0] Defines the canvas coords of ny(0)
   * @param   {boolean} [opts.clamp = false] Whether or not to clamp coordinate that are outside of the bounds
   * @param   {number} [opts.orientationY = 'down'] Defines the direction of positive Y (either 'up' or 'down')
   */
  constructor(opts = {}) {
    if (typeof opts.baseHeight === "undefined" && typeof opts.canvas === "undefined" || typeof opts.baseWidth === "undefined" && typeof opts.canvas === "undefined") {
      throw new Error("Invalid options. A canvas element must be supplied if baseHeight or baseWidth are not defined.");
    }

    const defaults = {
      nxRange: [-1, 1],
      nyRange: [-1, 1],
      canvas: undefined,
      baseHeight: undefined,
      baseWidth: undefined,
      padding: 0,
      paddingX: undefined,
      paddingY: undefined,
      offsetX: 0,
      offsetY: 0,
      clamp: false,
      orientationY: "down"
    };
    Object.assign(this, { ...defaults,
      ...opts
    }); // set base width / height

    this.baseWidth = this.canvas ? this.canvas.width : this.baseWidth;
    this.baseHeight = this.canvas ? this.canvas.height : this.baseHeight; // calculate canvas-unit padding amounts

    this.memoizePaddingX();
    this.memoizePaddingY();
  }
  /**
   * Sets the clamp behavior.
   * @param   {boolean} value
   *          Whether or not to clamp normal values outside of nxRange or nyRange
   *
   */


  setClamp(value) {
    this.clamp = value;
  }
  /**
   * Sets the normalized padding amount.
   * @param   {number} value
   *          A number in the range [0, 1]
   */


  setPadding(value) {
    this.padding = value;
    this.memoizePaddingX();
    this.memoizePaddingY();
  }
  /**
   * Sets the normalized X-padding amount.
   * @param   {number} value
   *          A number in the range [0, 1]
   */


  setPaddingX(value) {
    this.paddingX = value;
    this.memoizePaddingX();
  }
  /**
   * Sets the normalized Y-padding amount.
   * @param   {number} value
   *          A number in the range [0, 1]
   */


  setPaddingY(value) {
    this.paddingY = value;
    this.memoizePaddingY();
  }
  /**
   * Sets the X-offset amount.
   * @param   {number} value
   *          The new X-offset.
   */


  setoffsetX(value) {
    this.offsetX = value;
  }
  /**
   * Sets the Y-offset amount.
   * @param   {number} value
   *          The new Y-offset.
   */


  setoffsetY(value) {
    this.offsetY = value;
  }
  /**
   * Sets the Y-orientation
   * @param   {string} orientation
   *          The new y-orientation (one of 'up', 'down')
   */


  setOrientationY(orientation) {
    this.orientationY = orientation;
  }
  /**
   * Calculates and stores the X-padding amount in canvas units, using
   * this.paddingX if available, with a fallback to this.padding.
   * Stores the result in this.calculatedPaddingX for efficient retrieval.
   * @returns {number}
   *          The calculated X-padding in canvas units.
   */


  memoizePaddingX() {
    if (typeof this.paddingX === "undefined") {
      if (typeof this.padding === "undefined") {
        this.calculatedPaddingX = 0;
      } else {
        this.calculatedPaddingX = this.padding * this.baseWidth;
      }
    } else {
      this.calculatedPaddingX = this.paddingX * this.baseWidth;
    }

    return this.calculatedPaddingX;
  }
  /**
   * Calculates and stores the X-padding amount in canvas units, using
   * this.paddingX if available, with a fallback to this.padding.
   * Stores the result in this.calculatedPaddingX for efficient retrieval.
   * @returns {number}
   *          The calculated X-padding in canvas units.
   */


  memoizePaddingY() {
    if (typeof this.paddingY === "undefined") {
      if (typeof this.padding === "undefined") {
        this.calculatedPaddingY = 0;
      } else {
        this.calculatedPaddingY = this.padding * this.baseWidth;
      }
    } else {
      this.calculatedPaddingY = this.paddingY * this.baseHeight;
    }

    return this.calculatedPaddingY;
  }
  /**
   * Maps a normalized x-value to a canvas x-value
   * @param   {number} n
   *          A normalized x-value in the range [0, 1]
   */


  nx(n) {
    const offsetX = this.calculatedPaddingX + this.offsetX;
    const xProportion = (n - this.nxRange[0]) / (this.nxRange[1] - this.nxRange[0]);
    const xRange = this.baseWidth - 2 * this.calculatedPaddingX;
    const xn = offsetX + xProportion * xRange;

    if (this.clamp) {
      return clamp(xn, 0, this.baseWidth);
    } else {
      return xn;
    }
  }
  /**
   * Maps a canvas y-value to a normalized y-value
   * @param   {number} x
   *          A value in the range [0, canvas.width]
   * @returns {number}
   *          The normalized y-value
   */


  xn(x) {
    this.clamp && (x = clamp(x, 0, this.baseWidth));
    return (x - this.calculatedPaddingX - this.offsetX) / (this.baseWidth - this.calculatedPaddingX * 2);
  }
  /**
   * Maps a normalized y-value to a canvas y-value
   * @param   {number} n
   *          A normalized y-value in the range [0, 1]
   */


  ny(n) {
    const offsetY = this.calculatedPaddingY + this.offsetY;
    const yProportion = (n - this.nyRange[0]) / (this.nyRange[1] - this.nyRange[0]);
    const yRange = this.baseHeight - 2 * this.calculatedPaddingY;
    let yn;

    if (this.orientationY === "down") {
      yn = offsetY + yProportion * yRange;
    } else if (this.orientationY === "up") {
      yn = this.baseHeight - offsetY - yProportion * yRange;
    }

    if (this.clamp) {
      return clamp(yn, 0, this.baseHeight);
    } else {
      return yn;
    }
  }
  /**
   * Maps a canvas y-value to a normalized y-value
   * @param   {number} y
   *          A value in the range [0, canvas.height]
   * @returns {number}
   *          The normalized y-value
   */


  yn(y) {
    this.clamp && (x = clamp(x, 0, this.baseWidth));

    if (typeof opts.paddingY === "number") {
      padding = opts.paddingY * this.baseHeight;
    } else if (typeof opts.padding === "number") {
      padding = opts.padding * this.baseWidth;
    } else {
      padding = typeof this.paddingY === "number" ? this.paddingY * this.baseHeight : this.padding * this.baseWidth;
    }

    if (this.orientationY === "down") {
      return (y - padding - this.offsetY) / (this.baseHeight - padding * 2);
    } else if (this.orientationY === "up") {
      return (this.baseHeight - y - padding - this.offsetY) / (this.baseHeight - padding * 2);
    }
  }
  /**
   * Returns the width of the coordinate system, in canvas units, with an optional multiplier.
   * @param   {number} [n = 1]
   *          An optional multiplier
   * @returns {number}
   *          The width of the coordinate system, in canvas units, multiplied by n
   */


  width(n) {
    const width = this.nx(this.nxRange[1]) - this.nx(this.nxRange[0]);

    if (typeof n === "undefined") {
      return width;
    } else {
      return width * n;
    }
  }
  /**
   * Returns the height of the coordinate system, in canvas units, with an optional multiplier.
   * @param   {number} [n = 1]
   *          An optional multiplier
   * @returns {number}
   *          The height of the coordinate system, in canvas units, multiplied by n
   */


  height(n) {
    let height;

    if (this.orientationY === "down") {
      height = this.ny(this.nyRange[1]) - this.ny(this.nyRange[0]);
    } else if (this.orientationY === "up") {
      height = this.ny(this.nyRange[0]) - this.ny(this.nyRange[1]);
    }

    if (typeof n === "undefined") {
      return height;
    } else {
      return height * n;
    }
  }
  /**
   * Resizes the base dimensions of the coordinate system, appropriate
   * for when the underlying canvas element has changed sizes or when new width/height
   * values are needed.
   * If baseWidth and baseHeight were used in the instantiation of CanvasCoordinates,
   * then this function does nothing and the base dimensions remain the same.
   */


  resize(width, height) {
    if (typeof width === "undefined") {
      if (this.canvas) {
        this.baseWidth = this.canvas.width;
      }
    } else {
      this.baseWidth = width;
    }

    if (typeof height === "undefined") {
      if (this.canvas) {
        this.baseHeight = this.canvas.height;
      }
    } else {
      this.baseHeight = height;
    } // calculate canvas-unit padding amounts


    this.memoizePaddingX();
    this.memoizePaddingY();
  }

}

export { CanvasCoordinates, Spread, TAU, boundedCos, boundedSin, canvasToPng, cartToPolar, clamp, coordsToSphere, createAudioPlayer, createBlobFromDataURL, drawLine2D, equilateralTriangle, gaussianRand, hotBlue, hotGreen, hotPink, isocelesTriangle, lerp, linToLog, loadArrayBuffer, moonYellow, normalize, offBlack, polarToCart, regularPolygon, restoreCtx2d, rotatePoint, saveCtx2d, solveExpEquation, star, testStringLong, testStringMedium, testStringShort };
