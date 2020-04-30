import { clamp } from "../utils/math";

export class CanvasCoordinates {
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
    if (
      (typeof options.baseHeight === "undefined" &&
        typeof options.canvas === "undefined") ||
      (typeof options.baseWidth === "undefined" &&
        typeof options.canvas === "undefined")
    ) {
      throw new Error(
        "Invalid options. A canvas element must be supplied if baseHeight or baseWidth are not defined."
      );
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
      orientationY: "down",
    };

    Object.assign(this, { ...defaults, ...options });

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

    if (typeof options.padding === "number") {
      padding = options.padding * this.width;
    } else {
      padding = (this.paddingX || this.padding) * this.width;
    }

    return (
      padding +
      this.xOffset +
      ((n - this.nxRange[0]) / (this.nxRange[1] - this.nxRange[0])) *
        (this.width - 2 * padding)
    );
  }

  /**
   * Maps a canvas x-value to a normalized x-value
   * @param {object} n A canvas x-value in the range [0, canvas.width]
   * @param {number} [options.padding] Defines padding as a proportion of the canvas width (if defined, overrides padding settings for the system)
   */

  xn(x, options = {}) {
    let padding;

    if (typeof options.padding === "number") {
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

    if (typeof options.paddingY === "number") {
      padding = options.paddingY * this.height;
    } else if (typeof options.padding === "number") {
      padding = options.padding * this.width;
    } else {
      padding =
        typeof this.paddingY === "number"
          ? this.paddingY * this.height
          : this.padding * this.width;
    }

    if (this.orientationY === "down") {
      return (
        padding +
        this.yOffset +
        ((n - this.nyRange[0]) / (this.nyRange[1] - this.nyRange[0])) *
          (this.height - 2 * padding)
      );
    } else if (this.orientationY === "up") {
      return (
        this.height -
        padding -
        this.yOffset -
        ((n - this.nyRange[0]) / (this.nyRange[1] - this.nyRange[0])) *
          (this.height - 2 * padding)
      );
    }
  }

  /**
   * Maps a canvas y-value to a normalized y-value
   * @param {object} n A canvas y-value in the range [0, canvas.height]
   * @param {number} [options.padding] Defines padding as a proportion of the canvas height (if defined, overrides padding settings for the system)
   */

  yn(y, options = {}) {
    let padding;

    if (typeof options.paddingY === "number") {
      padding = options.paddingY * this.height;
    } else if (typeof options.padding === "number") {
      padding = options.padding * this.width;
    } else {
      padding =
        typeof this.paddingY === "number"
          ? this.paddingY * this.height
          : this.padding * this.width;
    }

    if (this.orientationY === "down") {
      return (y - padding - this.yOffset) / (this.height - padding * 2);
    } else if (this.orientationY === "up") {
      return (
        (this.height - y - padding - this.yOffset) / (this.height - padding * 2)
      );
    }
  }

  getWidth() {
    return this.nx(this.nxRange[1]) - this.nx(this.nxRange[0]);
  }

  getHeight() {
    if (this.orientationY === "down") {
      return this.ny(this.nyRange[1]) - this.ny(this.nyRange[0]);
    } else if (this.orientationY === "up") {
      return this.ny(this.nyRange[0]) - this.ny(this.nyRange[1]);
    } else {
      return undefined;
    }
  }
}
