var assert  = require('chai').assert,
	async   = require('async'),
	mocha   = require('mocha'),
	request = require('request-json');

var conf = require('./testConfig.json');  	// same directory plz

var req = request.newClient(conf.host)
 
describe('GET /blocks - ' , function () {
		
	var responseData = [];
	var fields = ['_id', 'name', 'url' , 'userid']

	before( function getData() {						// get response once
		req.get('/users', function (err, res, body){
			if (err) throw err;							// test after we save it
			responseData = body;
		});
	});

	it('has 3 fields per entry : _id, url, userid, name', function (done) {
		async.forEach(responseData, function (item) {
			aync.forEach(fields, function (field) {
				assert.isDefined(item[field]);
			});
		});
		done();
	});

	it('has all fields as Strings', function (done) {
		async.forEach(responseData, function (item) {
			async.forEach(fields, function (field) {
				assert.isString(item[field]);
			});
		});
		done();
	});
});	
		


