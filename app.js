/* DEPENDENCIES */
var express  	= require('express'),	// express
	// mongoose 	= require('mongoose'),	// mongoose
	// Schema  	= mongoose.Schema,
	passport	= require('passport'),	// passport
	LocalStrategy = require('passport-local').Strategy,
	flash 		= require('connect-flash'),	// flash
	
	app      	= express(),	
	
	// route modules
    users = require('./routes/users'),
	images = require('./routes/images'),
	levels = require('./routes/levels'),
	blocks = require('./routes/blocks');

// Test user records
var userList = [
	{ id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
	{ id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];	

// User methods
function findUserById(id, fn) {
	var idx = id - 1;
	if (userList[idx]) {
		fn(null, userList[idx]);
	} else {
		fn(new Error('User ' + id + ' does not exist'));
	}
}

function findUserByUsername(username, fn) {
	for (var i = 0, len = userList.length; i < len; i++) {
		var user = userList[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	
	return fn(null, null);
}

/* PASSPORT USER SERIALIZATION */
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findUserById(id, function(err, user) {
		done(err, user);
	});
});

/* PASSPORT - LOCAL STRATEGY */
passport.use(new LocalStrategy(
	function(username, password, done) {
		process.nextTick(function() {
			
			// Find user by username. If none found, or password
			// is incorrect, set user to false to indicate failure and
			// send flash message. Otherwise, return to authed 'user'.
			findUserByUsername(username, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				
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
	app.use(express.session({ cookie: { maxAge: 60000 }}));
	app.use(flash());
	// Initialize passport and use sessions
	app.use(passport.initialize());
	app.use(passport.session());
	//app.use(app.router);
});

/* ROUTES */

// /login
app.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	function(req, res) {
		res.redirect('/');
});

// /logout
/*
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
*/

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
app.get('/user/:id/levels', levels.findByUserId);
app.get('/levels', levels.findAll);
app.get('/levels/:id', levels.findById);
app.post('/levels', levels.addLevel);
app.put('/levels/:id', levels.updateLevel);
app.delete('/levels/:id', levels.deleteLevel);

// /blocks
app.get('/user/:id/blocks', blocks.findByUserId);
app.get('/blocks', blocks.findAll);
app.get('/blocks/:id', blocks.findById);
app.post('/blocks', blocks.addBlock);
app.put('/blocks/:id', blocks.updateBlock);
app.delete('/blocks/:id', blocks.deleteBlock);

/* SERVER INIT */
app.listen(3002);
console.log('API: INIT [OK]');
