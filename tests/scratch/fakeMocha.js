var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var AT = require('./testHelpers.js');

var baseUrl = "http://stellatigre.com:3002";

var collection = ["foo","bar","baz"];

var testArrays = [[] ,[] , []];


describe ("GET /users - ", function () {

	var path = '/users';
	var responseData;

	var waitForResponseData = function(done) {
   		if (responseData !== undefined){ done(); }
   		else setTimeout( function(){ waitForResponseData(done) }, 42 );
	 }

	before( function getData(done) {                        // get response once
        	req.get(baseUrl+path, function (err, res, body){
            	if (err) done(err);                         // test after we save it
           		responseData = JSON.parse(body);
        	});
        	waitForResponseData(done);
	});
	
	/*
	it('should come thru with the fake patois - STRINGS', function (done) {
		async.forEach(collection, AT.stringCheck, AT.errFunction);
		done();
	});

	it('should come thru with the fake patois - ARRAYS', function (done) {
		async.forEach(testArrays, AT.arrayCheck, AT.errFunction);
		done();
	});
	*/

	it('should return JSON objects', function(done) { 
		console.log(responseData);

		async.forEach(responseData, assert.isObject, AT.errFunction);	
		async.forEach(responseData, assert.isObject, AT.errFunction);
		done();
	});		

});
