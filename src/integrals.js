var math = require("../lib/math");

Integrals = {
	/*
	 * Function that calculates the integral given the simpson or trapezium
	 * method.
	 * 
	 * @param {Function} f - Function that we want to calculate the integral
	 * @param {Number|BigNumber} a - Lower limit of the integral
	 * @param {Number|BigNumber} b - Higher limit of the integral.
	 * @param {Number|BigNumber} M - Number of partitions to calculate the integral.
	 * @param {String} method - Method by which we want to calculate the integral (must be "trapezium" or "simpson").
	 * @return {Number|BigNumber} Integral - The result of the integral.
	 * 
	 * */
	integrate : function(f, a, b, M, method) {
		switch(method) {
			case "simpson":
				return this.simpsonRule(f, a, b, M);
			case "trapezium":
				return this.trapezoidalRule(f, a, b, M);
			default:
				throw "There is no " + method + " method for integrals";
		}
	},
	
	/*
	 * Function that calculates the integral through the composite trapezoidal rule
	 * with a given M subintervals.
	 * 
	 * @param {Function} f - Function that we want to calculate the integral
     * @param {Number|BigNumber} a - Lower limit of the integral
     * @param {Number|BigNumber} b - Higher limit of the integral.
     * @param {Number} M - Number of partitions to calculate the integral.
	 * @return {Number|BigNumber} integral - Result of the integral by the compose trapezium rule
	 * */
	
	trapezoidalRule : function(f, a, b, M) {
		var h = math.divide(math.add(b, -a), M);
		var sum = 0;
		for(var k = 1; k < M; ++k) {
			var x = math.add(a, math.multiply(h, k));
			sum = math.add(sum, f(x));
		}
		var firstTerm = math.divide(math.multiply(h, math.add(f(a), f(b))), 2);
		var secondTerm = math.multiply(h, sum);
		return math.add(firstTerm, secondTerm);
	},
	
	/*
	 *
	 * Function that calculate the integral through the composite Simpson rule
	 * with a given M subintervals (M must be odd).
	 * 
     * @param {Function} f - Function that we want to calculate the integral
     * @param {Number|BigNumber} a - Lower limit of the integral
     * @param {Number|BigNumber} b - Higher limit of the integral.
     * @param {Number} M - Number of partitions to calculate the integral (must be odd).
     * @return {Number|BigNumber} integral - Result of the integral by the compose trapezium rule
	 * 
	 * */
	
	simpsonRule : function(f, a, b, M) {
		if(M % 2 == 0) {
			throw "the simpson rule requires an odd number of subintervals";
		}
		var h = math.divide(math.add(b, -a), math.multiply(2, M));
		var sum1 = 0;
		var sum2 = 0;
		for(var k = 1; k <= M; ++k) {
			var x = math.add(a, math.multiply(h, 2 * k - 1));
			sum1 = math.add(sum1, f(x));
			if(k != M) {
				x = math.add(a, math.multiply(h, 2 * k));
				sum2 = math.add(sum2, f(x));
			}
		}
		var firstSum = math.add(f(a), f(b));
		var secondSum = math.multiply(4, sum1);
		var thirdSum = math.multiply(2, sum2);
		var numerator = math.multiply(h, math.add(firstSum, math.add(secondSum, thirdSum)));
		return math.divide(numerator, 3);
	}
};