"use strict";

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;

        if ("value" in descriptor) descriptor.writable = true;

        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) { 
    if (protoProps) _defineProperties(Constructor.prototype, protoProps); 
    if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Test =
    /*#__PURE__*/
    function () {
        function Test() {
            _classCallCheck(this, Test);
        }

        _createClass(Test, [{
            key: "method1",
            value: function method1() { }
        }, {
            key: "method2",
            value: function method2() { }
        }, {
            key: "testVar",
            get: function get() {
                return 'test';
            }
        }], [{
            key: "staticMethod",
            value: function staticMethod() { }
        }]);

        return Test;
    }();

var test = new Test();
console.log(Object.getPrototypeOf(test));