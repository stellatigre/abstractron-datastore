var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('abstractapi', server);

db.open(function (err, db) {
	if (!err) {
		db.collection('users', { strict: true }, function (err, collection) {
			if (err) {
			
			}
		});
		console.log('register: Connection opened (users).');
	}
});

// No routes needed yet.