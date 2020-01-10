export class Spread {

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
            distribution: (n => n)
        };

        Object.assign(this, { ...defaults, ...options });

        this.flatData = [];
        this.data = this.getData(this.count, this.bounds, this.dimensions);

    }

    getData() {

        const ndArray = this.ndArray(this.getDimensionCounts());

        const fillRange = (range, dim, accumulation) => {

            const bounds = this.getBounds(dim);
            const anchor = this.getAnchor(dim);
            const distribution = this.getDistribution(dim);

            const units = (bounds[1] - bounds[0]) / (range.length);

            for (let i = 0; i < range.length; i++) {

                const clone = [...accumulation];

                let value;

                switch (anchor) {
                    case 'spacing': value = distribution(bounds[0] + units * (i + 0.5), { d: dim, i }); break;
                    case 'endpoints': value = distribution(bounds[0] + units * i, { d: dim, i }); break;
                    default: throw new Error('Anchor type not valid. Choose from (spacing, endpoints).'); break;
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

        }

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