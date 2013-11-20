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
			
			}
		});
	}
});

exports.loggedIn = function (req, res) {
	res.json({ login: 'fail' });
};

exports.loginFailed = function (req, res) {
	res.json({ login: 'ok' });
};