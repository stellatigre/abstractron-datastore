var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var help = require('./lib/testHelpers.js');		// for both of these,
var conf = require('./lib/testConfig.json');  	// same directory plz

var path = '/videos';

describe ("Videos Routes / Operations", function () {
	describe("\n    GET ", function() {

		var responseData;

		describe ("/videos", function() {
			
			before( function getData(done) {                        // get response once
					req.get(conf.baseUrl+path, function (err, res, body){
						if (err) done(err);                         // test after we save it
						responseData = JSON.parse(body);    // save it here
						assert.equal(res.statusCode, 200);  // Make sure we get a 200 OK
						help.waitForData(responseData, done);		// don't test until we get the response
					});
			});

			it('should return Objects ', function (done) {	
				async.forEach(responseData, assert.isObject, help.errFunction);	// we get Objects ?	
				done();
			});

			it('each object returned has 3 fields populated with strings :  name, url, _id', function(done) { 
				
				async.forEach(responseData, function (item, callback) {		
					
					assert.isString(item['_id']);				// verify fields
					assert.isString(item['name']);
					assert.isString(item['url']);
					callback();	

				}, help.errFunction);
				done();
			});		
		});
		
		describe('/videos/:id  : ', function() {
			
			it('should find & return videos by their unique :id string if in the DB, and return a 200 OK', function (done) {
			
				req({
					uri : conf.baseUrl+path+'/'+responseData[0]['_id'],
					method: "GET"
				}, function (err, res, body) {
						if (err) done(err);
						var data = JSON.parse(body);

						assert.equal(200, res.statusCode);          // 200 OK ?
						assert.equal(data['_id'], responseData[0]['_id']);  // did we get the id we asked for ? 
						done();
					}
				);
			});

		});
	});

	describe ("\n    POST ", function () {

		var postResponseData;

		var testName = 'testCat';
		var testUrl  = 'http://i.telegraph.co.uk/multimedia/archive/02351/cross-eyed-cat_2351472k.jpg';

		before( function getData(done) {                        // get response before tests
				req({
					uri : conf.baseUrl+path, 
					method : "POST", 
					form : {
						name : testName,
						url : testUrl
					}	
				}, function (err, res, body){
					if (err) done(err);                         
					postResponseData = JSON.parse(body);    
					assert.equal(res.statusCode, 200);  // Make sure we get a 200 OK
					help.waitForData(postResponseData, done);		// don't test until we get the response
				});
		});
		
		describe('/videos , params: "name" & "url"', function() {

			it('should return a new Object "_id", a string', function (done) {	
				assert.isString(postResponseData['_id']);	// we get an Object back ?	
				done();
			});

			it('should produce a response that has "name" and "url" fields which match our input', function(done) { 
				assert.equal(postResponseData['name'], testName);
				assert.equal(postResponseData['url'] , testUrl);
				done();
			});		
			
			it('should return a 400 status code & a descriptive error if "name" is missing', function (done) {	

				req({
					uri: conf.baseUrl+path,					// This section is checking error handling
					method : "POST",
					form : { 
						name : "",
						url : "http://valid.com",
					}
				},	function(err, res, body) {
						if (err) done(err);
						var data = JSON.parse(body)

						assert.equal(400, res.statusCode);		// make sure we send the proper HTTP status code
						assert.equal('Video lacks a name, please add one', data['error']);		
						done();
					});
			});
			
			it('should return a 400 status code & descriptive error if the URL seems invalid', function (done) {	

				req({
					uri: conf.baseUrl+path,
					method : "POST",
					form : { 
						name : "",
						url : "http:/invalid.m",
					}
				},	function(err, res, body) {
						if (err) done(err);
						var data = JSON.parse(body);

						assert.equal(400, res.statusCode);
						assert.equal('URL value appears to not be valid.', data['error']);		
						done();
					});
			});
			
		});
	});
});


