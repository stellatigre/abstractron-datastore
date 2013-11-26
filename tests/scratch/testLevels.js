var assert  = require('chai').assert,
	async   = require('async'),
	mocha   = require('mocha'),
	request = require('request-json');

var conf = require('./testConfig.json');  	// same directory plz

var req = request.newClient(conf.host)
 
describe('GET /levels - ' , function () {
		
	var responseData = [];
	var fields = ['_id', 'name', 'url' , 'userid']

	before( function getData() {						// get response once
		req.get('/users', function (err, res, body){
			if (err) throw err;							// test after we save it
			responseData = body;
		});
	});

	it('has 3 fields per entry : _id, name, rooms', function (done) {
		async.forEach(responseData, function (item) {
			aync.eachSeries(fields, function (field) {
				assert.isDefined(item[field]);
			});
		});
		done();
	});

	it('has all _id & name values as Strings', function (done) {
		async.eachSeries(responseData, function (item) {
				assert.isString(item['_id']);
				assert.isString(item['name']);
			});
		done();
	});

	it('rooms is an array, each entry in rooms has a blocks array', function (done) {
	
		async.forEach(responseData, function (item) {
			async.eachSeries(item['rooms'], function(room) {
				assert.isArray(room);
				assert.isArray(room['blocks']);
			});
		});
		
		done();
	});
});	
		


