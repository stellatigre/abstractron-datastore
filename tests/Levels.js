var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var AT = require('./lib/testHelpers.js');		// for both of these,
var conf = require('./lib/testConfig.json');  	// same directory plz

describe ("GET /levels - ", function () {

	var path = '/levels';
	var responseData;

	var waitForResponseData = function(done) {
   		if (responseData !== undefined){ done(); }
   		else setTimeout( function(){ waitForResponseData(done) }, 20 );
	 }

	before( function getData(done) {                        // get response once
        	req.get(conf.baseUrl+path, function (err, res, body){
            	if (err) done(err);                         // test after we save it
           		responseData = JSON.parse(body);    // save it here
			assert.equal(res.statusCode, 200);  // Make sure we get a 200 OK
        	});
        	waitForResponseData(done);		// don't test until we get the response
	});
	

	it('should return Objects ', function (done) {	
		async.forEach(responseData, assert.isObject, AT.errFunction);	// we get Objects ?	
		done();
	});

	it('each object have 2 fields populated with strings : name & _id', function(done) { 
		
		async.forEach(responseData, function (item, callback) {		
			
			assert.isString(item['_id']);				// verify fields
			assert.isString(item['name']);	
			
			callback();	
		},
			AT.errFunction
		);
		done();
	});

	it('the field "rooms" is an array, entries in rooms have a blocks array', function (done) {
	
		async.forEach(responseData, function (item, callback) {

			assert.isArray(item['rooms'][0]['blocks']);
			callback();
		},
			AT.errFunction
		);
		done();
	});

	it('"blocks" == array, each member has x,y,z, type, image numbers', function (done) {
	
		var testBlocks = responseData[0]['rooms'][0]['blocks'];		// our blocks array

		assert.isArray(testBlocks);

		async.forEach(testBlocks, function (item, callback) {		
			
			assert.isNumber(+item['x']);		// + converts string to numbers	
			assert.isNumber(+item['y']);			
			assert.isNumber(+item['z']);		// Verify all these are numbers
			assert.isNumber(+item['type']);
			assert.isNumber(+item['image']);

			callback();
		},
			AT.errFunction
		);
		done();
	});
		
});
