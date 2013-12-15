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
			
			}
		});
		console.log('login: Connection opened (users).');
	}
});

exports.loggedIn = function (req, res) {
	res.json({ login: 'ok' });
};

exports.loginFailed = function (req, res) {
	res.json({ login: 'fail' });
};