var req = require("request");
var async = require("async");
var assert = require("chai").assert;

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

	// This next section is about error handling
	it('should return a descriptive error if the name is missing', function (done) {	

		req({
			uri: conf.baseUrl+path,
			method : "POST",
			form : { 
				name : "",
				url : "http://invalid.com",
			}
		},	function(err, res, body) {
				if (err) done(err);
				var data = JSON.parse(body)
				assert.equal('Image lacks a name, please add one', data['error']);		
				done();
			});
	});
	
	it('should return a descriptive error if the URL seems invalid', function (done) {	

		req({
			uri: conf.baseUrl+path,
			method : "POST",
			form : { 
				name : "",
				url : "http:/invalid.m",
			}
		},	function(err, res, body) {
				if (err) done(err);
				var data = JSON.parse(body)
				assert.equal('URL value appears to not be valid.', data['error']);		
				done();
			});
	});


});


