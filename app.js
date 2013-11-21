/* DEPENDENCIES */
var flash 		= require('connect-flash'),	// flash
	express  	= require('express'),	// express
	mongo		= require('mongodb'),
	mongoose 	= require('mongoose'),	// mongoose
	Schema  	= mongoose.Schema,
	passport	= require('passport'),	// passport
	LocalStrategy = require('passport-local').Strategy,
	
	app      	= express(),	
	
	// route modules
    users = require('./routes/users'),
	images = require('./routes/images'),
	levels = require('./routes/levels'),
	blocks = require('./routes/blocks'),
	login  = require('./routes/login'),
	register = require('./routes/register');

// Test user records
var userList = [
	{ _id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
	{ _id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' },
	{ _id: 3, username: 'chris', password: 'chris', email: 'chris@abstractron.com' }
];	

// User methods
function findUserById(id, fn) {
	var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('abstractapi', server);
	
	db.open(function (err, db) {
		if (err) {
			//sys.puts(err);
		} else {
			db.collection('users', function (err, collection) {
				collection.findOne({_id: id }, function (err, item) {
					console.log('FindById: ' + item);
					return fn(null, item);
				});
			});
		}
	});	
	
	fn(new Error('User ' + id + ' does not exist'));
}

function findUserByUsername(username, fn) {
	
	// Return joe only
	//var user = userList[1];
	//return fn(null, user);
	
	var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('abstractapi', server);
	
	db.open(function (err, db) {
		if (err) {
			//sys.puts(err);
		} else {
			db.collection('users', function (err, collection) {
				collection.findOne({username: username }, function (err, item) {
					console.log('FindByUsername: ' + item);
					return fn(null, item);
				});
			});
		}
	});	
	
	// Bad login (crashes)
	//return fn(null, null);
}

/* PASSPORT USER SERIALIZATION */
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	findUserById(id, function(err, user) {
		done(err, user);
	});
});

/* PASSPORT - LOCAL STRATEGY */
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log("LOGIN CHECK: user " + username + " pass " + password);
		process.nextTick(function() {
			
			// Find user by username. If none found, or password
			// is incorrect, set user to false to indicate failure and
			// send flash message. Otherwise, return to authed 'user'.
			findUserByUsername(username, function(err, user) {
				if (err) { 
					return done(err); 
				}
				if (!user) { 
					return done(null, false, { message: 'Invalid user' }); 
				}
				if (user.password != password) {
					return done(null, false, { message: 'Invalid password' }); 
				}
				
				return done(null, user);
			});
		});
	}
));
	
/* PASSPORT - ENSURE AUTH */
/*
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
}
*/
	
/* SERVER CONFIG */
app.configure(function () {
	app.use(express.logger());
	app.use(express.cookieParser('abstractsecret'));
	app.use(express.bodyParser());
	//app.use(express.session({ cookie: { maxAge: 60000 }}));
	app.use(flash());
	// Initialize passport and use sessions
	app.use(passport.initialize());
	app.use(passport.session());
	//app.use(app.router);
});

/* ROUTES */

// /login

app.post('/login',
		passport.authenticate('local'),
		function (req, res) {
			// If this is called, authentication was successful.
			res.json({"_id":req.user._id});
		}
);

// /logout
/*
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
*/

app.post('/authfail', login.loginFailed);
app.post('/authok', login.loggedIn);

// /users
app.get('/users/login/:username', users.findUsername);
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

// /images
app.get('/images', images.findAll);
app.get('/images/:id', images.findById);
app.post('/images', images.addImage);
app.put('/images/:id', images.updateImage);
app.delete('/images/:id', images.deleteImage);

// /levels
app.get('/user/:userid/levels', levels.findByUserId);
app.get('/levels', levels.findAll);
app.get('/levels/:id', levels.findById);
app.post('/levels', levels.addLevel);
app.put('/levels/:id', levels.updateLevel);
app.delete('/levels/:id', levels.deleteLevel);

// /blocks
app.get('/user/:userid/blocks', blocks.findByUserId);
app.get('/blocks', blocks.findAll);
app.get('/blocks/:id', blocks.findById);
app.post('/blocks', blocks.addBlock);
app.put('/blocks/:id', blocks.updateBlock);
app.delete('/blocks/:id', blocks.deleteBlock);

/* SERVER INIT */
app.listen(3002);
console.log('API: INIT [OK]');
