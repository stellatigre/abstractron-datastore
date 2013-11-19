var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('abstractapi', server);

db.open(function (err, db) {
	if (!err) {
		console.log('Connected to users.');
		db.collection('users', { strict: true }, function (err, collection) {
			if (err) {
				console.log('Users collection does not exist, creating from sample data.');
				populateDB();
			}
		});
	}
});

exports.findUsername = function (req, res) {
	var username = req.params.username;
	
	db.collection('users', function (err, collection) {
		collection.findOne({'username': username }, function (err, item) {
			res.send(item);
		});
	});
};

exports.findAll = function (req, res) {
	db.collection('users', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.findById = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving user: ' + id);
	db.collection('users', function (err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function (err, item) {
			res.send(item);
		});
	});
};

exports.addUser = function (req, res) {
	var user = req.body;
	console.log('Adding user: ' + JSON.stringify(user));
	
	db.collection('users', function (err, collection) {
		collection.insert(user, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'An error occurred on user insert.'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateUser = function (req, res) {
	var id = req.params.id;
	var user = req.body;
	
	console.log('Updating user: ' + id);
	console.log(JSON.stringify(user));
	
	db.collection('users', function (err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function (err, result) {
			if (err) {
				console.log('Error updating user: ' + err);
				res.send({'error':'An error occurred on user update.'});
			} else {
				console.log('' + result + ' document(s) updated.');
				res.send(user);
			}
		});
	});
}

exports.deleteUser = function (req, res) {
	var id = req.params.id;
	
	console.log('Deleting user: ' + id);
	db.collection('users', function (err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error occurred on user delete.'});
			} else {
				console.log('' + result + ' document(s) deleted.');
				res.send(req.body);
			}
		});
	});
}

/* SAMPLE DATA */
var populateDB = function() {
	
	var users = [
	{
		username: 'user1',
		email: 'user1@example.com'
	},
	{
		username: 'user2',
		email: 'user2@example.com'
	},
	{
		username: 'user3',
		email: 'user3@example.com'
	}
	];
	
	db.collection('users', function (err, collection) {
		collection.insert(users, {safe:true}, function (err, result) {});
	});
};