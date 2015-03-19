require("../src/integrals");
require("../src/derivate");
var math = require('mathjs');

describe('Numerical methods', function() {

    describe('Integrate', function () {
        var f = math.eval('f(x) = 2 + sin(2 * sqrt(x))');

        it('Simpson rule', function () {
            var result = Integrals.integrate(f, 1, 6, 5, "simpson");
            result.should.be.approximately(8.18301550, 10e-8);
        });

        it('Trapezoidal rule', function () {
             var result = Integrals.integrate(f, 1, 6, 10, "trapezium");
             result.should.be.approximately(8.19385457, 10e-7);
        });
    });

    describe('Derivate', function () {
        // Take it from page 341, Cap 6
         it('1st Derivate O(h^2)', function () {
             var x = [0.79, 0.8, 0.81];
             var y = math.cos(x);
             var result = Derivate.derivate(x, y, 1, 1, 0.01, 2);
             result.should.be.approximately(-0.717344150, 10e-7);
         });

        it('1st Derivate O(h^4)', function () {
            var x =  [0.78, 0.79, 0.8, 0.81, 0.82];
            var y = math.cos(x);
            var result = Derivate.derivate(x, y, 2, 1, 0.01, 4);
            result.should.be.approximately(-0.717356108, 10e-7);
        });

        // Take it from page 357, Cap 6
        it('2nd Derivate O(h^2)', function () {
            var x = [0.79, 0.8, 0.81];
            var y = math.cos(x);
            var result = Derivate.derivate(x, y, 1, 2, 0.01, 2);
            result.should.be.approximately(-0.69669, 10e-5);
        });

        // Take it from page 359, Cap 6
        it('2nd Derivate O(h^4)', function () {
            var x =  [0.78, 0.79, 0.8, 0.81, 0.82];
            var y = math.cos(x);
            var result = Derivate.derivate(x, y, 2, 2, 0.01, 4);
            result.should.be.approximately(-0.696705958, 10e-5);
        });


        it('3rd Derivate O(h^2)', function () {
            var x = [0.78, 0.79, 0.8, 0.81, 0.82];
            var y = math.cos(x);
            var result = Derivate.derivate(x, y, 2, 3, 0.01, 2);
            result.should.be.approximately(0.717356, 10e-5);
        });

        it('3rd Derivate O(h^4)', function () {
            var x =  [0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83];
            var y = math.cos(x);
            var result = Derivate.derivate(x, y, 3, 3, 0.01, 4);
            result.should.be.approximately(0.717356, 10e-5);
        });


        it('4rd Derivate O(h^2)', function () {
            var x = [0.78, 0.79, 0.8, 0.81, 0.82];
            var y = math.cos(x);
            var result = Derivate.derivate(x, y, 2, 4, 0.01, 2);
            result.should.be.approximately(0.696707, 10e-5);
        });

        it('4rd Derivate O(h^4)', function () {
            var x =  [0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83];
            var y = math.cos(x);
            var result = Derivate.derivate(x, y, 3, 4, 0.01, 4);
            result.should.be.approximately(0.696707, 10e-5);
        });
    });

});