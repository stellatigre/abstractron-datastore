var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var AT = require('./lib/testHelpers.js');	// for both of these,
var conf = require('./lib/testConfig.json');  	// same directory plz

describe ("GET /users - ", function () {

	var path = '/users';
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

	it('each object have 3 fields populated with strings : username, email, _id', function(done) { 
		
		async.forEach(responseData, function (item, callback) {		
			assert.isString(item['_id']);				// verify fields
			assert.isString(item['email']);
			assert.isString(item['_id']);
			callback();	
			},
			AT.errFunction
		);
		done();
	});		

});
