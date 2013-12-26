var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var AT = require('./lib/testHelpers.js');		// plz do not change directory structure
var conf = require('./lib/testConfig.json');  	
var goodTestLevel = require('./lib/OneGoodLevel.json');

describe ("POST /levels - ", function () {

	var path = '/levels';
	var responseData;

	var waitForResponseData = function(done) {
   		if (responseData !== undefined){ done(); }
   		else setTimeout( function(){ waitForResponseData(done) }, 10 );
	 }

	before( function getData(done) {                        // get response once
        	req({
		    	uri : conf.baseUrl+path, 
		    	method : "POST", 
		    	form : goodTestLevel
			}, function (err, res, body){
            	if (err) done(err);                         // test after we save it
           		responseData = JSON.parse(body);    // save it here
				assert.equal(res.statusCode, 200);  // Make sure we get a 200 OK
				
				console.log(responseData);
        	});
        	waitForResponseData(done);		// don't test until we get the response
	});
	
	it('should return a new Object "_id", a string', function (done) {	
		assert.isString(responseData['_id']);	// we get an Object back ?	
		done();
	});

	it('should return an informative error & a 400 status code if the name is missing', function (done) {	

		var badNameLevel = goodTestLevel;
		badNameLevel.name = "";
	
		req({
			uri: conf.baseUrl+path,
			method : "POST",
			form : badNameLevel
		},	function(err, res, body) {
				if (err) done(err);
				var data = JSON.parse(body);

				assert.equal (res.statusCode , 400);
				assert.equal('Level lacks a name, please add one', data['error']);		
				done();
			}
		);
	});
	
	it('inserted object should then be retrievable via GET /levels/:id', function (done) {	

		req({
			uri: conf.baseUrl+path+'/'+responseData._id,
			method : "GET"
		},	function(err, res, body) {
				if (err) done(err);
				var data = JSON.parse(body);
				
				assert.equal(responseData._id , data._id);		
				done();
			}
		);
	});

});


