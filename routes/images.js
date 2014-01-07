var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('abstractapi', server, {safe: true});


db.open(function (err, db) {
	if (!err) {
		db.collection('images', { strict: true }, function (err, collection) {
			if (err) {
				console.log('Images collection does not exist, creating from sample data.');
				populateDB();
			}
		});
		console.log('images: Connection opened (images).');
	}
});

exports.findAll = function (req, res) {
	db.collection('images', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.findById = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving image: ' + id);
	db.collection('images', function (err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function (err, item) {
			res.send(item);
		});
	});
};


// We're gonna use this below, just didn't want to re-construct it all the time
var urlRegex = new RegExp('https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}');

var validateImageData = function(image, res, callback) {

	var validated;

	if (image) {
		if(urlRegex.test(image['url']) == false) {
			res.statusCode = 400;
			res.send({'error':'URL value appears to not be valid.'});
			validated = false;
		}
		else if(image['name'] == (undefined || "")) {
			res.statusCode = 400;
			res.send({'error':'Image lacks a name, please add one'});
			validated = false;
		} 
		else { validated = true; }
		
		if (validated) { 
			callback(image, res);     //console.log('validated callback success');
		}
		else { callback(); }  //console.log ('callback being called with no arguments'); 
	}
}

var addImageInternal = function (image, res) {

	if (image) {
		console.log('Adding image: ' + JSON.stringify(image));
		
		db.collection('images', function (err, collection) {
			collection.insert(image, {safe:true}, function (err, result) {

				if (err) {
					res.send({'error':'An error occurred on image insert.'});
				} else {
					console.log('Success: ' + JSON.stringify(result[0]));
					res.send(result[0]);
				}
			});
		});
	}
}

exports.addImage = function (req, res) {

	validateImageData(req.body, res, addImageInternal);
}

exports.updateImage = function (req, res) {
	var id = req.params.id;
	var image = req.body;
	
	console.log('Updating image: ' + id);
	console.log(JSON.stringify(image));
	
	db.collection('images', function (err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, image, {safe:true}, function (err, result) {
			if (err) {
				console.log('Error updating image: ' + err);
				res.send({'error':'An error occurred on image update.'});
			} else {
				console.log('' + result + ' document(s) updated.');
				res.send(image);
			}
		});
	});
}

exports.deleteImage = function (req, res) {
	var id = req.params.id;
	
	console.log('Deleting image: ' + id);
	db.collection('images', function (err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error occurred on image delete.'});
			} else {
				console.log('' + result + ' document(s) deleted.');
				res.send(req.body);
			}
		});
	});
}

/* SAMPLE DATA */
var populateDB = function() {
	
	var images = require('./sample_data/images.json');
	
	db.collection('images', function (err, collection) {
		collection.insert(images, {safe:true}, function (err, result) {});
	});
};
