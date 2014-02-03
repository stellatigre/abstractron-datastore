var async = require("async");
var assert = require("chai").assert;


var waitForData = function(variable, done) {
            if (variable !== undefined){ done(); }
            else setTimeout( function(){ waitForData(variable, done) }, 10 );
        }

var errFunction = function (err) { if (err) throw err; }

module.exports.errFunction = errFunction;
module.exports.waitForData = waitForData;
