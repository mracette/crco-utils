import { clamp } from "../utils/math";

export class CanvasCoordinates {
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
    if (
      (typeof opts.baseHeight === "undefined" && typeof opts.canvas === "undefined") ||
      (typeof opts.baseWidth === "undefined" && typeof opts.canvas === "undefined")
    ) {
      throw new Error(
        "Invalid options. A canvas element must be supplied if baseHeight or baseWidth are not defined."
      );
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
      orientationY: "down",
    };

    Object.assign(this, { ...defaults, ...opts });

    // set base width / height
    this.baseWidth = this.canvas ? this.canvas.width : this.baseWidth;
    this.baseHeight = this.canvas ? this.canvas.height : this.baseHeight;

    // calculate canvas-unit padding amounts
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
      this.calculatedPaddingX = this.padding * this.baseWidth;
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
      this.calculatedPaddingY = this.padding * this.baseWidth;
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
    return (
      (x - this.calculatedPaddingX - this.offsetX) / (this.baseWidth - this.calculatedPaddingX * 2)
    );
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
      padding =
        typeof this.paddingY === "number"
          ? this.paddingY * this.baseHeight
          : this.padding * this.baseWidth;
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
    }
    // calculate canvas-unit padding amounts
    this.memoizePaddingX();
    this.memoizePaddingY();
  }
}
