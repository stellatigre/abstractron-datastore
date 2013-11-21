var assert  = require('chai').assert,
	async   = require('async'),
	mocha   = require('mocha'),
	request = require('request-json');

var conf = require('./testConfig.json');  	// same directory plz

var req = request.newClient(conf.host)
 
describe('GET /users - ' , function () {
		
	var responseData = [];
	var response;

	before( function getData() {						// get response once
		req.get('/users', function (err, res, body){
			if (err) throw err;							// test after we save it
			response = res;
			responseData = body;
		});
	});

	it('has 3 fields per entry : _id, email, username', function (done) {
		async.forEach(responseData, function (item) {
			assert.isDefined(item['_id']);
			assert.isDefined(item['email']);
			assert.isDefined(item['username']);
		});
		done();
	});

	it('has all fields as Strings', function (done) {
		async.forEach(responseData, function (item) {
			assert.isString(item['_id']);
			assert.isString(item['email']);
			assert.isString(item['username']);
		});
		done();
	});
});	
		


