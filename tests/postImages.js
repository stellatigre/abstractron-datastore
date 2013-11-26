var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var AT = require('./lib/testHelpers.js');		// for both of these,
var conf = require('./lib/testConfig.json');  	// same directory plz

describe ("POST /images - ", function () {

	var path = '/images';
	var responseData;

	var testName = 'testCat';
	var testUrl  = 'http://i.telegraph.co.uk/multimedia/archive/02351/cross-eyed-cat_2351472k.jpg';

	var waitForResponseData = function(done) {
   		if (responseData !== undefined){ done(); }
   		else setTimeout( function(){ waitForResponseData(done) }, 20 );
	 }

	before( function getData(done) {                        // get response once
        	req({
		    	uri : conf.baseUrl+path, 
		    	method : "POST", 
		    	form : {
		       		name : testName,
		        	url : testUrl
				}	
			}, function (err, res, body){
            	if (err) done(err);                         // test after we save it
           		responseData = JSON.parse(body);    // save it here
			assert.equal(res.statusCode, 200);  // Make sure we get a 200 OK
        	});
        	waitForResponseData(done);		// don't test until we get the response
	});
	

	it('should return a new Object "_id", a string', function (done) {	
		assert.isString(responseData['_id']);	// we get an Object back ?	
		done();
	});

	it('should produce a response that has "name" and "url" fields which match our input', function(done) { 
	
		assert.equal(responseData['name'], testName);
		assert.equal(responseData['url'] , testUrl);
	
		done();
	});		

});
