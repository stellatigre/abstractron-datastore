var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('abstractapi', server, {safe: true});

db.open(function (err, db) {
	if (!err) {
		db.collection('users', { strict: true }, function (err, collection) {
			if (err) {
				console.log('Levels collection does not exist, creating from sample data.');
				populateDB();
			}
		});
		db.collection('levels', { strict: true }, function (err, collection) {
			if (err) {
				console.log('Levels collection does not exist, creating from sample data.');
				populateDB();
			}
		});
		console.log('levels: Connection opened (users, levels).');
	}
});

// NOTE: This is just returning all records for now, when none contain
//  	 a userid property.
exports.findByUserId = function (req, res) {
	var userid = req.params.userid;
	
	console.log('Retrieving levels for user: ' + userid);
	db.collection('levels', function (err, collection) {
		collection.find(/*{"userid":userid}*/).toArray(function (err, items) {
			console.log('Found ' + items.length + ' level(s) for user ' + userid);
			res.send(items);
		});
	});
};

exports.findAll = function (req, res) {
	db.collection('levels', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.findById = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving level: ' + id);
	db.collection('levels', function (err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function (err, item) {
			res.send(item);
		});
	});
};

exports.addLevel = function (req, res) {
	var level = req.body;
	console.log('Adding level...');
	
	db.collection('levels', function (err, collection) {
		collection.insert(level, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'An error occurred on level insert.'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateLevel = function (req, res) {
	var id = req.params.id;
	var level = req.body;
	
	console.log('Updating level: ' + id);
	console.log(JSON.stringify(level));
	
	db.collection('levels', function (err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, level, {safe:true}, function (err, result) {
			if (err) {
				console.log('Error updating level: ' + err);
				res.send({'error':'An error occurred on level update.'});
			} else {
				console.log('' + result + ' document(s) updated.');
				res.send(level);
			}
		});
	});
}

exports.deleteLevel = function (req, res) {
	var id = req.params.id;
	
	console.log('Deleting level: ' + id);
	db.collection('levels', function (err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error occurred on level delete.'});
			} else {
				console.log('' + result + ' document(s) deleted.');
				res.send(req.body);
			}
		});
	});
}

/* SAMPLE DATA */
var populateDB = function() {
	
	var levels = require('../tests/lib/OneGoodLevel.json'); 
	
	db.collection('levels', function (err, collection) {
		collection.insert(levels, {safe:true}, function (err, result) {});
	});
};
