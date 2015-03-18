require("../src/fit");
require("../src/solutionLinearSystem");
require("../src/integrals");
require("../src/interpolate");
require("../src/nonLinearEquations");
require("../src/derivate");
var math = require('../lib/math');
var should = require('should');

var assert = require("assert");

describe('Numerical methods', function() {

    describe('Fit', function() {

        it('Linear fit', function() {
            var x = math.matrix([-1, 0, 1, 2, 3, 4, 5, 6]);
            var y = math.matrix([10, 9, 7, 5, 4, 3, 0, -1]);
            var result = Fit.linearFit(x, y);
            result.A.should.be.approximately(-1.6071429, 10e-7);
            result.B.should.be.approximately(8.6428571, 10e-7);
        });

        it('Potential fit', function () {
            var x = math.matrix([0.2, 0.4, 0.6, 0.8, 1.0]);
            var y = math.matrix([0.1960, 0.7850, 1.7665, 3.1405, 4.9075]);
            var result = Fit.potentialFit(x, y, 2);
            result.should.be.approximately(4.9073, 10e-5);
        });

        it('Linearization', function () {
            var x = math.matrix([0, 1, 2, 3, 4]);
            var y = math.matrix([1.5, 2.5, 3.5, 5.0, 7.5]);
            var result = Fit.linearization(x, y);
            result.A.should.be.approximately(0.3912023, 10e-7);
            result.C.should.be.approximately(1.579910, 10e-7);
        });

        it('Polynomial fit', function () {
            var x = math.matrix([-3, 0, 2, 4]);
            var y = math.matrix([3, 1, 1, 3]);
            var result = Fit.polynomialFit(x, y, 2);
            var expected = [0.850519, -0.192495, 0.178462];
            for(var i = 0; i < expected.length; ++i) {
                math.subset(result, math.index(i, 0)).should.be.approximately(expected[i], 10e-6);
            }
        });

    });

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

    describe('Solution linear system', function () {

         it('Back substitution', function () {
             var A = math.matrix([[4, -1, 2, 3],
                                 [0, -2, 7, -4],
                                 [0, 0, 6, 5],
                                 [0, 0, 0, 3]]);
             var B = math.matrix([[20],
                                  [-7],
                                  [4],
                                  [6]]);
             var result = SolutionLinearSystem._backSubstitution(A, B);
             var solutions = [3, -4, -1, 2];
             for(var i = 0; i < solutions.length; ++i) {
                 math.subset(result, math.index(i, 0)).should.be.approximately(solutions[i], 10e-7);
             }
         });

         it('Solve system', function () {
              var A = math.matrix([[24.14, -1.210],
                                    [1.133, 5.281]]);
              var B = math.matrix([[22.93], [6.414]]);
              var result = SolutionLinearSystem.solve(A, B);
              for(var i = 0; i < 2; ++i) {
                  math.subset(result, math.index(i, 0)).should.be.approximately(1, 10e-7);
              }
         });
    });

    describe('Interpolate', function () {

         it('Lagrange', function () {
             var x = math.matrix([0.0, 1.2]);
             var y = math.matrix([1.0, 0.362358]);
             var f = Interpolate.lagrange(x, y);

             x = [0.1, 0.3, 0.5, 0.7, 0.9, 1.1];
             var answers = [0.946863, 0.840589, 0.734316, 0.628042, 0.521768, 0.415495];
             for(var i = 0; i < answers.length; ++i) {
                 f(x[i]).should.be.approximately(answers[i], 10e-6);
             }
         });

         it('Newton', function () {
              var x = math.matrix([0, 1, 2, 3, 4]);
              var y = math.matrix([1, 0.54030223, -0.4161468, -0.9899925, -0.6536436]);
              var coefficients = Interpolate.newton(x, y);

              var solutions = [1.0, -0.4596977, -0.2483757, 0.1465592, -0.0146568];
              for(var i = 0; i < solutions.length; ++i) {
                  math.subset(coefficients, math.index(i)).should.be.approximately(solutions[i], 10e-7);
              }
         });
    });

    describe('Non-linear Equations', function () {
         var f1 = math.eval("f(x) = x * sin(x) - 1");

         it('Bisection method', function () {
              var result = NonLinearEquations.bisectionMethod(f1, 0, 2, 10e-7);
              result.should.be.approximately(1.114157141, 10e-7);
         });

         it('False position', function () {
             var result = NonLinearEquations.falsePositionMethod(f1, 0, 2, 10e-7, 10e-7, 500);
             result.should.be.approximately(1.114157141, 10e-7);
         });

         var f2 = math.eval("f(x) = 1980 * (1 - exp(-x / 10)) - 98*x");
         var f2prime = math.eval("f(x) = 198 * exp(-x / 10) - 98");

         it('Newton method', function () {
             var result = NonLinearEquations.newtonMethod(f2, f2prime, 16, 10-7, 10-7, 500);
             result.should.be.approximately(16.20957798, 10e-3);
         });

         var f3 = math.eval("f(x) = x^3 - 3*x + 2");

        // Take it from page 89 - 90, Cap 2
         it('Secant method', function () {
             var result = NonLinearEquations.secantMethod(f3, -2.6, -2.4, 10e-7, 10e-7, 500);
             result.should.be.approximately(-2, 10e-5);
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