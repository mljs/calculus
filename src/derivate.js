var math = require("../lib/math");

Derivate = {
	/* 
	 * 
	 * This function recieves the X's and Y's vectors of the same size, the
	 * position of the vector that we want to derivate, the degree of the derivative,
	 * the h coefficient of the centered differences and the formula we want.
	 *
	 * Return the derivate at the selected point in the vector.
	 * 
	 * @param {Vector} X - Vector of the x positions of the points.
	 * @param {Vector} Y - Vector of the y positions of the points.
	 * @param {Number} position - Position at the vector that we want the derivative.
	 * @param {Number} derivate - Degree of derivative, must be a number in range 1 to 4.
	 * @param {Number} h - h coefficient of the centered differences formula.
	 * @param {Number} formula - exponent coefficient of the centered differences formula, must be 2 or 4.
	 * @return {Number|BigNumber} derivate - Derivate at the point position in the vectors X's and Y's.
	 * 
	 * */	
	derivate : function(X, Y, position, derivate, h, formula) {
		switch(formula) {
			case 2:
				return this.centeredDifferencesH2(X, Y, position, derivate, h);
			case 4:
				return this.centeredDifferencesH4(X, Y, position, derivate, h);
			default:
				throw "there is no formula for O(h" + formula + ").";
		}
	},
	/*
	 *
	 * Function that returns a vector with the needed positions to make the derivative
	 * with the centered differences formula.
	 *
	 * @param {Vector} X - Vector of the x positions of the points.
     * @param {Vector} Y - Vector of the y positions of the points.
     * @param {Number} position - Position at the vector that we want the derivative.
     * @param {Number} h - h coefficient of the centered differences formula.
     * @return {Vector} values - Values needed to calculate the centered differences formula.
	 * 
	 * */	
	_getPositions : function(X, Y, position, h) {
		var values = [null, null, null, math.subset(Y, math.index(position)), null, null, null];
		var size = math.subset(math.size(Y), math.index(0));
		var valueAtPosition = math.subset(X, math.index(position));
		var otherH = h;
		var pos = 3;
		for(var i = position - 1; i >= 0 && pos != -1; --i) {
			var actualValue = math.subset(X, math.index(i));
			var value = math.abs(math.add(valueAtPosition , -actualValue));
			if(math.equal(value, otherH)) {
				values[--pos] = math.subset(Y, math.index(i));
				otherH = math.add(otherH, h);
			}
		}
		var otherH = h;
		var pos = 3;
		for(var i = position + 1; i < size && pos != 7; ++i) {
			var actualValue = math.subset(X, math.index(i));
			var value = math.abs(math.add(valueAtPosition , -actualValue));
			if(math.equal(value, otherH)) {
				values[++pos] = math.subset(Y, math.index(i));
				otherH = math.add(otherH, h);
			}
		}
		return values;
	},
	/*
	 * This function recieves the X's and Y's vectors of the same size, the
     * position of the vector that we want to derivate, the degree of the derivative,
     * the h coefficient of the centered differences.
     *
     * Returns the derivative at the point position with the
     * O(h^2) centered differences formula.
     *
	 * @param {Vector} X - Vector of the x positions of the points.
	 * @param {Vector} Y - Vector of the y positions of the points.
	 * @param {Number} position - Position at the vector that we want the derivative.
	 * @param {Number} derivate - Degree of derivative, must be a number in range 1 to 4.
	 * @param {Number} h - h coefficient of the centered differences formula.
	 * @return {Number|BigNumber} detivate - Derivate at the point position in the vectors X's and Y's.
	 *
	 * */
	centeredDifferencesH2 : function(X, Y, position, derivate, h) {
		var size = math.subset(math.size(Y), math.index(0));
		if(position < 0 || position >= size) {
			throw "Invalid position " + position;
		}
		
		var values = this._getPositions(X, Y, position, h);
		var numerator;
		var denominator;
		switch(derivate) {
			case 1:
				if(!values[2] && !values[4]) {
					throw "f(-1) and f(+1) is not defined for h = " + h;
				}
				numerator = math.add(values[4], -values[2]);
				denominator = math.multiply(2, h);
				break;
			case 2:
				if(!values[2] && !values[4]) {
					throw "f(-1) and f(+1) is not defined for h = " + h;
				}
				numerator = math.add( math.add(values[4], -math.multiply(2, values[3])), values[2]);
				denominator = math.pow(h, 2);
				break;
			case 3:
                // Message doesn't work
				if(!values[1] && !values[2] && !values[4] && !values[5]) {
					throw "the f(-2), f(-1), f(+1) and f(+2) is not defined for h = " + h;
				}
				numerator = math.add( values[5], math.add( math.multiply(2, -values[4]), math.subtract( math.multiply(2, values[2]), values[1] ) ) );
				denominator = math.multiply(2, math.pow(h, 3));
				break;
			case 4:
				if(!values[1] && !values[2] && !values[4] && !values[5]) {
					throw "f(-2), f(-1), f(+1) and f(+2) is not defined for h = " + h;
				}
				var firstSum = math.add(values[5], -math.multiply(4, values[4]));
				var secondSum = math.add( math.multiply(6, values[3]), -math.multiply(4, values[2]) );
				numerator = math.add(firstSum, math.add(secondSum, values[1]));
				denominator = math.pow(h, 4);
				break;
			default:
				throw "there is no implementation for derivatives greater than 4";
		}
		return math.divide(numerator, denominator);
	},
	
	/*
     * This function recieves the X's and Y's vectors of the same size, the
     * position of the vector that we want to derivate, the degree of the derivative,
     * the h coefficient of the centered differences.
     *
     * Returns the derivative at the point position with the
     * O(h^4) centered differences formula.
     *
     * @param {Vector} X - Vector of the x positions of the points.
     * @param {Vector} Y - Vector of the y positions of the points.
     * @param {Number} position - Position at the vector that we want the derivative.
     * @param {Number} derivate - Degree of derivative, must be a number in range 1 to 4.
     * @param {Number} h - h coefficient of the centered differences formula.
     * @return {Number|BigNumber} detivate - Derivate at the point position in the vectors X's and Y's.
	 * */
	
	centeredDifferencesH4 : function(X, Y, position, derivate, h) {
		var size = math.subset(math.size(Y), math.index(0));
		if(position < 0 || position >= size) {
			throw "Invalid position " + position;
		}
		
		var values = this._getPositions(X, Y, position, h);
		var numerator;
		var denominator;
		switch(derivate) {
			case 1:
				if(!values[1] && !values[2] && !values[4] && !values[5]) {
					throw "f(-2), f(-1), f(+1) and f(+2) is not defined for h = " + h;
				}
				var firstSum = math.add(-values[5], math.multiply(values[4], 8));
				var secondSum = math.add(-math.multiply(8, values[2]), values[1]);
				numerator = math.add(firstSum, secondSum);
				denominator = math.multiply(12, h);
				break;
			case 2:
				if(!values[1] && !values[2] && !values[4] && !values[5]) {
					throw "f(-2), f(-1), f(+1) and f(+2) is not defined for h = " + h;
				}
				var firstSum = math.add(-values[5], math.multiply(16, values[4]));
				var secondSum = math.add(math.multiply(-30, values[3]), math.multiply(16, values[2]));
				numerator = math.add(firstSum, math.add(secondSum, -values[1]));
				denominator = math.multiply(12, math.pow(h, 2));
				break;
			case 3:
				if(!values[0] && !values[1] && !values[2] && !values[4] && !values[5] && !values[6] ) {
					throw "f(-3), f(-2), f(-1), f(+1), f(+2) and f(+3) is not defined for h = " + h;
				}
				var firstSum = math.add(-values[6], math.multiply(8, values[5]));
				var secondSum = math.add(math.multiply(-13, values[4]), math.multiply(13, values[2]));
				var thirdSum = math.add(math.multiply(-8, values[1]), values[0]);
				numerator = math.add(firstSum, math.add(secondSum, thirdSum));
				denominator = math.multiply(8, math.pow(h, 3));
				break;
			case 4:
				if(!values[0] && !values[1] && !values[2] && !values[4] && !values[5] && !values[6] ) {
					throw "f(-3), f(-2), f(-1), f(+1), f(+2) and f(+3) is not defined for h = " + h;
				}
				var firstSum = math.add(-values[6], math.multiply(12, values[5]));
				var secondSum = math.add(math.multiply(-39, values[4]), math.multiply(56, values[3]));
				var thirdSum = math.add(math.multiply(-39, values[2]), math.multiply(12, values[1]));
				numerator = math.add(firstSum, math.add(secondSum, math.add(thirdSum, -values[0])));
				denominator = math.multiply(6, math.pow(h, 4));
				break;
			default:
				throw "there is no implementation for derivatives greater than 4";
		}
		return math.divide(numerator, denominator);
	}
};