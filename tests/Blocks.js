var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var help = require('./lib/testHelpers.js');		// for both of these,
var conf = require('./lib/testConfig.json');  	// same directory plz

var path = '/blocks';

describe ("Block Routes / Operations", function () {

	var responseData;

	describe("\n    GET ", function() {
		describe(path, function () {
			
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

			it('should return Objects with 4 fields as strings : userid, name, url, _id', function(done) { 
				
				async.forEach(responseData, function (item, callback) {		
					
					assert.isString(item['_id']);				// verify fields
					assert.isString(item['name']);
					assert.isString(item['userid']);
					assert.isString(item['url']);
					
					callback();	
				},
					help.errFunction
				);
				done();
			});	
		});	

		describe(path+'/:id', function() {
			
			it('should find / return blocks by their unique ":id" string if in the DB, status 200 OK', function (done) {
			
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

	describe('POST', function () {
		describe(path+', params : "name", "url", & "userid"', function () {
			
			var postResponseData;

			before( function getData(done) {                        // get response once
					req({
						uri : conf.baseUrl+path, 
						method : "POST", 
						form : {
							name : help.testName,
							url : help.testUrl,
							userid: help.testId
						}	
					}, function (err, res, body){
						if (err) done(err);                         
						postResponseData = JSON.parse(body);    
						assert.equal(res.statusCode, 200);  		// Make sure we get a 200 OK
						help.waitForData(postResponseData, done);		// don't test until we get the response
					});
			});
			

			it('should return a new Object "_id", a string', function (done) {	
				assert.isString(postResponseData['_id']);	// we get an Object back ?	
				done();
			});

			it('should produce a response that has "name", "url", & "userid" fields which match our input', function(done) { 
			
				assert.equal(postResponseData['name'], help.testName);
				assert.equal(postResponseData['url'] , help.testUrl);
				assert.equal(postResponseData['userid'] , help.testId);
			
				done();
			});		

			it('should return an informative error & a 400 status code if the name is missing', function (done) {	

				req({
					uri: conf.baseUrl+path,
					method : "POST",
					form : { 
						name : "",
						url : "http://valid.com",
						userid : help.testId
					}
				},	function(err, res, body) {
						if (err) done(err);
						var data = JSON.parse(body);

						assert.equal (res.statusCode , 400);
						assert.equal('Block lacks a name, please add one', data['error']);		
						done();
					}
				);
			});
			
			it('should return an informative error & 400 status code if the URL seems invalid', function (done) {	

				req({
					uri: conf.baseUrl+path,
					method : "POST",
					form : { 
						name : "",
						url : "http:/invalid.m",
						userid : help.testId
					}
				},	function(err, res, body) {
						if (err) done(err);
						var data = JSON.parse(body);
						
						assert.equal (res.statusCode , 400);
						assert.equal('URL value appears to not be valid.', data['error']);		
						done();
					}
				);
			});
		});	
	});
	
	describe('PUT ', function() {
		describe(path+'/:id ', function() {

			it('Should update a record using the _id, and return a 200 OK + updated record', function(done) {
				var first = responseData[0];

				req({
					uri: conf.baseUrl+path+'/'+first._id ,
					method : "PUT",
					form : { 
						name : first.name+'_updated',
						url : first.url+'/update',
						userid : first.userid
					}
				},	function(err, res, body) {
						if (err) done(err);
						var data = JSON.parse(body);

						assert.equal(200, res.statusCode);
						assert.equal(data.name, first.name+'_updated');
						assert.equal(data.url, first.url+'/update');
						assert.equal(data.userid, first.userid)
						
						done();
				});
			});
		});
	});

	describe('DELETE ', function() {
		describe(path+'/:id ', function() {

			it('Should delete a record using the _id, and return a 200 OK + updated record', function(done) {

				req({
					uri: conf.baseUrl+path+'/'+responseData[(responseData.length-1)]._id ,
					method : "DELETE"
				},	
					function(err, res, body) {
						if (err) done(err);
						
						assert.equal(200, res.statusCode);
						assert.equal(body, "{}");
				});
				
				req.get({
					uri: conf.baseUrl+path+'/'+responseData[(responseData.length-1)]._id ,
				},	
					function(err, res, body) {
						if (err) done(err);

						assert.equal(200, res.statusCode);
						assert.equal(body, '');
						done();
				});
			});
		});
	});
});
