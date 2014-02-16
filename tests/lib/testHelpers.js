var async = require("async");
var assert = require("chai").assert;


var waitForData = function(variable, done) {
            if (variable !== undefined){ done(); }
            else setTimeout( function(){ waitForData(variable, done) }, 10 );
        }

var errFunction = function (err) { if (err) throw err; }

var testName = 'testCat';
var testUrl  = 'http://i.telegraph.co.uk/multimedia/archive/02351/cross-eyed-cat_2351472k.jpg';
var testId = '52873ddc77ca9dc430000004';


module.exports.testName = testName;					// Shared test variables go here
module.exports.testUrl = testUrl;
module.exports.testId = testId;

module.exports.errFunction = errFunction;			// Actual functions go down here
module.exports.waitForData = waitForData;
