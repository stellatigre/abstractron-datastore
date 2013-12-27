var req = require("request");
var async = require("async");
var assert = require("chai").assert;

var conf = require('./lib/testConfig.json');  	// same directory plz

var paths = ['/images', '/levels', '/blocks'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

describe ("Content Encoding - any route : ", function () {

	var index = getRandomInt(0,2);
	var path = paths[index];			// which collection we choose is mostly arbitrary

	it('should return uncompressed JSON data if no "Accept-Encoding" header is supplied', function(done) {
		
		req.get(conf.baseUrl+path, function (err, res, body) {
		
			assert.isUndefined(res.headers['content-encoding']);
			done();	
		});
		
	});

	it('should return gzip-compressed JSON data if the "Accept-Encoding" header\'s value is "gzip"', function(done) {
		
		req.get({
				uri : conf.baseUrl+path,
				headers : {
					'Accept-Encoding' : 'gzip'
				}
			},	function (err, res, body) {
				
				assert.equal(res.headers['content-encoding'], 'gzip');
				done();
		});
		
	});

});
