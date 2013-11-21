var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('abstractapi', server);

db.open(function (err, db) {
	if (!err) {
		db.collection('videos', { strict: true }, function (err, collection) {
			if (err) {
				console.log('Videos collection does not exist, creating from sample data.');
				populateDB();
			}
		});
		console.log('videos: Connection opened (videos).');
	}
});

exports.findAll = function (req, res) {
	db.collection('videos', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.findById = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving video: ' + id);
	db.collection('videos', function (err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function (err, item) {
			res.send(item);
		});
	});
};

exports.addVideo = function (req, res) {
	var video = req.body;
	console.log('Adding video: ' + JSON.stringify(video));
	
	db.collection('videos', function (err, collection) {
		collection.insert(video, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'An error occurred on video insert.'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateVideo = function (req, res) {
	var id = req.params.id;
	var video = req.body;
	
	console.log('Updating video: ' + id);
	console.log(JSON.stringify(video));
	
	db.collection('videos', function (err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, video, {safe:true}, function (err, result) {
			if (err) {
				console.log('Error updating video: ' + err);
				res.send({'error':'An error occurred on video update.'});
			} else {
				console.log('' + result + ' document(s) updated.');
				res.send(video);
			}
		});
	});
}

exports.deleteVideo = function (req, res) {
	var id = req.params.id;
	
	console.log('Deleting video: ' + id);
	db.collection('videos', function (err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error occurred on video delete.'});
			} else {
				console.log('' + result + ' document(s) deleted.');
				res.send(req.body);
			}
		});
	});
}

/* SAMPLE DATA */
var populateDB = function() {
	
	var videos = [
	{
		name: 'Bill Gates',
		url: 'http://www.geofffox.com/wp-content/uploads/2010/09/bill_gates.jpg'
	},
	{
		name: 'Emilio Estevez',
		url:  'http://2.bp.blogspot.com/-HnxvM6zP6kw/Te7oO9wWntI/AAAAAAAAADc/TNJiKL5lf1M/s320/md1.jpg'
	}
	];
	
	db.collection('videos', function (err, collection) {
		collection.insert(videos, {safe:true}, function (err, result) {});
	});
};