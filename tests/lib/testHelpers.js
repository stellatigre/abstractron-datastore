var async = require("async");
var assert = require("chai").assert;

var responseData;

var stringCheck = function(arg, callback) {
    assert.isString(arg);
    callback();
}

var arrayCheck = function(arg, callback) {
    assert.isArray(arg);
    callback();
}

var errFunction = function (err) { if (err) throw err; }

module.exports.arrayCheck = arrayCheck;
module.exports.stringCheck = stringCheck;
module.exports.errFunction = errFunction;
