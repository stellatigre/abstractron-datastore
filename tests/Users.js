var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var help = require('./lib/testHelpers.js');	// for both of these,
var conf = require('./lib/testConfig.json');  	// same directory plz

var path = '/users';

describe ("User Routes / Operations", function () {
	describe("\n    GET ", function () {
 
		var responseData;

		describe(path, function () {

			before( function getData(done) {                        // get response once
					req.get(conf.baseUrl+path, function (err, res, body){
						if (err) done(err);                         // test after we save it
						responseData = JSON.parse(body);    // save it here
						assert.equal(res.statusCode, 200);  // Make sure we get a 200 OK
						help.waitForData(responseData, done);
					});
			});
			
			it('should return Objects ', function (done) {	
				async.forEach(responseData, assert.isObject, help.errFunction);	// we get Objects ?	
				done();
			});

			it('each object should have 3 fields filled with strings : username, email, _id', function(done) { 
				
				async.forEach(responseData, function (item, callback) {		
					assert.isString(item['_id']);				
					assert.isString(item['email']);
					assert.isString(item['_id']);
					callback();	
					},
					help.errFunction
				);
				done();
			});
		});		

		describe(path+'/:id ', function () {

			it('should return the user Object that has the "_id" requested', function (done) {

				req.get(conf.baseUrl+path+'/'+responseData[0]._id, function (err, res, body) {
					var data = JSON.parse(body);
					
					assert.deepEqual(responseData[0], data);
					done();
				});
			});
		});
	
		describe(path+'/login/:username ', function () {

			it('should return the "_id" of the requested username', function (done) {

				req.get(conf.baseUrl+path+'/login/'+responseData[0].username, function (err, res, body) {
					var data = JSON.parse(body);
					
					assert.equal(responseData[0]._id, data._id);
					done();
				});
			});
		});

	});
});
