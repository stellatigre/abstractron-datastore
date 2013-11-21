/* DEPENDENCIES */
var flash 		= require('connect-flash'),	// flash
	express  	= require('express'),	// express
	mongo		= require('mongodb'),
	MongoStore  = require('connect-mongo')(express), // mongo auth store
	mongoose 	= require('mongoose'),	// mongoose
	Schema  	= mongoose.Schema,
	passport	= require('passport'),	// passport
	LocalStrategy = require('passport-local').Strategy,
	// LocalStrategy: basic auth
	
	FacebookStrategy = require('passport-facebook').Strategy,
	// App ID/Secret
	FACEBOOK_APP_ID = "1436345559910277",
	FACEBOOK_APP_SECRET = "54b38ae41d350af4e506b1218feb17ee",

	app      	= express(),	
	
	// route modules
    users = require('./routes/users'),
	images = require('./routes/images'),
	videos = require('./routes/videos'),
	levels = require('./routes/levels'),
	blocks = require('./routes/blocks'),
	login  = require('./routes/login'),
	register = require('./routes/register');

// User methods
function findUserById(id, fn) {
	var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('abstractapi', server, {safe: false});
	
	db.open(function (err, db) {
		if (err) {
			fn(new Error('Err: ' + err));
		} else {
			// local
			db.collection('users', function (err, collection) {
				collection.findOne({_id: new BSON.ObjectID(id) }, function (err, item) {
					return fn(null, item);
				});
			});
		}
	});	
	fn(new Error('User ' + id + ' does not exist'));
}

function findSessionUserById(id, fn) {
	var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('abstractapi', server, {safe: false});
	
	db.open(function (err, db) {
		if (err) {
			fn(new Error('Err: ' + err));
		} else {
			// facebook
			db.collection('sessions', function (err, collection) {
				collection.findOne({_id: new BSON.ObjectID(id) }, function (err, item) {
					return fn(null, item);
				});
			});
		}
	});	

	fn(new Error('User ' + id + ' does not exist'));
}

function findUserByUsername(username, fn) {
	
	var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('abstractapi', server, {safe: false});
	
	db.open(function (err, db) {
		if (err) {
			return fn(new Error('Err: ' + err));
		} else {
			db.collection('users', function (err, collection) {
				collection.findOne({username: username }, function (err, item) {
					console.log('FindByUsername: ' + item);
					return fn(null, item);
				});
			});
		}
	});	
}

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

/* PASSPORT - FACEBOOK */
passport.use(new FacebookStrategy({
	clientID: FACEBOOK_APP_ID,
	clientSecret: FACEBOOK_APP_SECRET,
	callbackURL: "http://devnode.vmception.com:3002/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		
		
		return done(null, profile);
	}
));

/* PASSPORT USER SERIALIZATION */
passport.serializeUser(function(user, done) {
	console.log("SESSION: Serialize user...");
	
	

	done(null, user);
});

passport.deserializeUser(function(id, done) {
	console.log("SESSION: Deserialize user (" + id + ")");
	
	findSessionUserById(id, function(err, obj) {
		console.log('findSessionUserById (' + id + ': found: ' + obj);
		
		done(err, obj);
	});
});
	
/* SERVER CONFIG */
app.configure(function () {
	app.use(express.logger());
	app.use(express.cookieParser('abstractsecret'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ 
		secret: 'abstractsecret', 
		store: new  MongoStore({
			db: 'abstractapi',
			collection: 'sessions',
			
		}, function() {
			console.log('MongoStore session db connection OK.');
		})
	}));
	app.use(flash());
	// Initialize passport and use sessions
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

/* ROUTES */
/*
// Test route: /restricted
app.get('/restricted', ensureAuthenticated, function(req, res) {
	// TODO: some response for authed users
});
*/

// /login

app.post('/login',
		passport.authenticate('local'),
		function (req, res) {
			// If this is called, authentication was successful.
			res.json({"_id":req.user._id});
		}
);

// /logout
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

/* ENSURE AUTH 
	Use this route on any protected resource, will be allowed
	if authenticated otherwise redirect to login.
*/
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
}

// /auth

/// facebook
app.get('/auth/facebook',
	passport.authenticate('facebook'),
	function(req, res) {
		// Request will redirect to FB for auth, this will not be hit
	});
	
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function (req, res) {
		res.send('Logged in');
	});

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

// /videos
app.get('/videos', videos.findAll);
app.get('/videos/:id', videos.findById);
app.post('/videos', videos.addVideo);
app.put('/videos/:id', videos.updateVideo);
app.delete('/videos/:id', videos.deleteVideo);

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
