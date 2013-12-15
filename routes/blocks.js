var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('abstractapi', server, {safe: true});

db.open(function (err, db) {
	if (!err) {
		db.collection('blocks', { strict: true }, function (err, collection) {
			if (err) {
				console.log('Blocks collection does not exist, creating from sample data.');
				populateDB();
			}
		});
		console.log('users: Connection opened (blocks).');
	}
});

// NOTE: Levels by userid may not work yet, but blocks are fine.
exports.findByUserId = function (req, res) {
	var userid = req.params.userid;
	console.log('Retrieving blocks for user: ' + userid);
	db.collection('blocks', function (err, collection) {
		collection.find({'userid':userid}).toArray(function (err, items) {
			console.log('Found ' + items.length + ' block(s) for user ' + userid);
			res.send(items);
		});
	});
};


exports.findAll = function (req, res) {
	db.collection('blocks', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.findById = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving block: ' + id);
	db.collection('blocks', function (err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function (err, item) {
			res.send(item);
		});
	});
};

exports.addBlock = function (req, res) {
	var block = req.body;
	console.log('Adding block: ' + JSON.stringify(block));
	
	db.collection('blocks', function (err, collection) {
		collection.insert(block, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'An error occurred on block insert.'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateBlock = function (req, res) {
	var id = req.params.id;
	var block = req.body;
	
	console.log('Updating block: ' + id);
	console.log(JSON.stringify(block));
	
	db.collection('blocks', function (err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, block, {safe:true}, function (err, result) {
			if (err) {
				console.log('Error updating block: ' + err);
				res.send({'error':'An error occurred on block update.'});
			} else {
				console.log('' + result + ' document(s) updated.');
				res.send(block);
			}
		});
	});
}

exports.deleteBlock = function (req, res) {
	var id = req.params.id;
	
	console.log('Deleting block: ' + id);
	db.collection('blocks', function (err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error occurred on block delete.'});
			} else {
				console.log('' + result + ' document(s) deleted.');
				res.send(req.body);
			}
		});
	});
}

/* SAMPLE DATA */
var populateDB = function() {
	
	var blocks = [
	{
		name: 'Bill Gates',
		url: 'http://www.geofffox.com/wp-content/uploads/2010/09/bill_gates.jpg',
		userid: "52873ddc77ca9dc430000004"
	},
	{
		name: 'Emilio Estevez',
		url:  'http://2.bp.blogspot.com/-HnxvM6zP6kw/Te7oO9wWntI/AAAAAAAAADc/TNJiKL5lf1M/s320/md1.jpg',
		userid: "52873ddc77ca9dc430000004"
	}
	];
	
	db.collection('blocks', function (err, collection) {
		collection.insert(blocks, {safe:true}, function (err, result) {});
	});
};