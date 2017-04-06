/**
 * Class for generating random numbers.
 */
Random = function() {
    /**
     * Returns a uniformly distributed random value.
     *
     * @param min Minimum of the distribution.
     * @param max Maximum of the distribution.
     * @returns {number} Random value.
     */
    this.uniform = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    /**
     * Returns an exponentially distributed random value.
     *
     * @param lambda Rate parameter.
     * @returns {number} Random value.
     */
    this.exponential = function (lambda) {
        return -Math.log(Math.random()) / lambda;
    };

    /**
     * Returns a Pareto distributed random value.
     *
     * @param xMin Scale parameter.
     * @param alpha Shape parameter.
     * @returns {number} Random value.
     */
    this.pareto = function(xMin, alpha) {
        return xMin / Math.pow(Math.random(), 1/alpha);
    };

    /**
     * Returns a bounded Pareto distributed random value.
     *
     * @param low Lower boundary.
     * @param high Upper boundary.
     * @param alpha Shape parameter.
     * @returns {number} Random value.
     */
    this.paretoBounded = function(low, high, alpha) {
        var l = Math.pow(low, alpha);
        var h = Math.pow(high, alpha);
        var u = Math.random();
        return Math.pow((h+u*(l-h))/(l*h), -1 / alpha);
    };

    /**
     * Custom (arbitrary) distribution.
     * This is an implementation of the alias table method:
     * Source: http://www.keithschwarz.com/darts-dice-coins/
     */
    this.custom = {
        /**
         * Parameters of the generator: population, biased coins and aliases.
         */
        _n: 0,
        _prob: [],
        _alias: [],

        /**
         * Initializes alias table with the given weights.
         * Weigts need not to be normalized.
         *
         * @param weights Weights to use in the alias table.
         */
        init: function(weights) {
            // Single element
            if (weights.length == 0 || !(weights instanceof Array)) {
                this._prob = [0];
                this._alias = [0];
                return;
            }

            // Get sum (for normalization)
            this._n = weights.length;
            var sum = 0;
            for (var i=0; i<this._n; i++)
                sum += weights[i];

            // Fill up small and large work lists
            var p = [];
            var small = [];
            var large = [];
            for (i = 0; i<this._n; i++) {
                p.push(this._n * weights[i] / sum);
                if (p[i] < 1.0)
                    small.push(i);
                else
                    large.push(i);
            }

            // Init tables
            this._prob = [];
            this._alias = [];
            for (i = 0; i<this._n; i++) {
                this._prob.push(1.0);
                this._alias.push(i);
            }

            // Fill up alias table
            var s = 0,
                l = 0;
            while (small.length > 0 && large.length > 0) {
                s = small.shift();
                l = large.shift();

                this._prob[s] = p[s];
                this._alias[s] = l;

                p[l] += p[s] - 1.0;
                if( p[l] < 1.0 )
                    small.push(l);
                else
                    large.push(l);
            }
            while (large.length > 0)
            {
                l = large.shift();
                this._prob[l] = 1.0;
                this._alias[l] = l;
            }
            while (small.length > 0)
            {
                s = small.shift();
                this._prob[s] = 1.0;
                this._alias[s] = s;
            }
        },

        /**
         * Returns an integer value according to the current alias table.
         *
         * @returns {number} Random integer.
         */
        sample: function() {
            if (this._n <= 1) {
                return 0;
            }

            var i = Math.floor(Math.random() * this._n);
            if (Math.random() < this._prob[i])
                return i;
            else
                return this._alias[i];
        }
    };

    /**
     * Shuffles an array using the Fisher--Yates algorithm.
     *
     * @param x Array to shuffle.
     */
    this.shuffle = function(x) {
        var i, temp, l = x.length;
        while (l) {
            i = Math.floor(Math.random() * l--);
            temp = x[l];
            x[l] = x[i];
            x[i] = temp;
        }
    }
};
