### DEPENDENCIES ###
Promise = require 'bluebird'
flash 		= require 'connect-flash'	# flash
express		= require 'express' # express
mongo		= require 'mongodb'
MongoStore	= require('connect-mongo')(express) # mongo auth store
passport	= require 'passport'	# passport
LocalStrategy = require('passport-local').Strategy
# LocalStrategy: basic auth

### Knocking this out until we use it
FacebookStrategy = require('passport-facebook').Strategy,
// App ID/Secret
FACEBOOK_APP_ID = "1436345559910277",
FACEBOOK_APP_SECRET = "54b38ae41d350af4e506b1218feb17ee",
###

app = express()

users = require './routes/users'
images = require './routes/images'
videos = require './routes/videos'
levels = require './routes/levels'
blocks = require './routes/blocks'
login	= require './routes/login'
register = require './routes/register'


openDatabase = new Promise (resolve, reject)->
	Server = mongo.Server
	Db = mongo.Db
	BSON = mongo.BSONPure
	server = new Server 'localhost', 27017, auto_reconnect: true
	db = new Db 'abstractapi', server, safe: false
	db.open (err, db) ->
		if err
			reject new Error 'Could not open connection to database: '+err
		else
			resolve db

openDatabase
.done (db)->

	findSessionUserById = (id, fn) ->
		# facebook
		db.collection "sessions", (err, collection) ->
			collection.findOne _id: new BSON.ObjectID(id), (err, item) ->
				fn null, item
			return

	findUserByUsername = (username, fn) ->
		db.collection "users", (err, collection) ->
			collection.findOne username: username, (err, item) ->
				console.log "FindByUsername: " + item
				fn null, item
			return

	# PASSPORT - LOCAL STRATEGY 
	passport.use new LocalStrategy (username, password, done) ->
		console.log "LOGIN CHECK: user " + username + " pass " + password
		process.nextTick ->
			
			# Find user by username. If none found, or password
			# is incorrect, set user to false to indicate failure and
			# send flash message. Otherwise, return to authed 'user'.
			findUserByUsername username, (err, user) ->
				if err
					return done err
				if !user
					return done null, false, message: "Invalid user"
				if user.password != password
					return done null, false, message: "Invalid password"
				done null, user
			return
		return


	### PASSPORT - FACEBOOK 
	passport.use new FacebookStrategy
		clientID: FACEBOOK_APP_ID
		clientSecret: FACEBOOK_APP_SECRET
		callbackURL: "http://devnode.vmception.com:3002/auth/facebook/callback"
	, (accessToken, refreshToken, profile, done) ->
		console.log profile
		done null, profile
	###

	### PASSPORT USER SERIALIZATION ###
	passport.serializeUser (user, done) ->
		console.log "SESSION: Serialize user..."
		done null, user
		return

	passport.deserializeUser (id, done) ->
		console.log "SESSION: Deserialize user (" + id + ")"
		findSessionUserById id, (err, obj) ->
			console.log "findSessionUserById (" + id + ": found: " + obj
			done err, obj
			return
		return

		
	### SERVER CONFIG ###
	app.configure ->
		app.use express.logger()
		app.use express.cookieParser "abstractsecret"
		app.use express.bodyParser()
		app.use express.methodOverride()
		app.use express.compress()
		app.use express.session
			secret: "abstractsecret"
			store: new MongoStore
				db: "abstractapi"
				collection: "sessions"
			, ->
				console.log "MongoStore session db connection OK."
				return
		app.use flash()
		
		# Initialize passport and use sessions
		app.use passport.initialize()
		app.use passport.session()
		app.use app.router
		app.use express.static __dirname + "/public"
		return


	### ROUTES ###
	###
	# Test route: /restricted
	app.get "/restricted", ensureAuthenticated, (req, res) ->
		# TODO: some response for authed users
	###

	# /login

	app.post "/login", passport.authenticate("local"), (req, res) ->
		# If this is called, authentication was successful.
		res.json _id: req.user._id
		return

	# /logout
	app.get "/logout", (req, res) ->
		req.logout()
		res.redirect "/"
		return

	### ENSURE AUTH 
		Use this route on any protected resource, will be allowed
		if authenticated otherwise redirect to login.
	###
	ensureAuthenticated = (req, res, next) ->
		if req.isAuthenticated()
			return next()
		res.redirect "/login"
		return

	# /auth

	### facebook
	app.get('/auth/facebook',
		passport.authenticate('facebook'),
		function(req, res) {
			// Request will redirect to FB for auth, this will not be hit
		}
		
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', { failureRedirect: '/login' }),
		function (req, res) {
			res.send('Logged in'
		}
	###

	app.post '/authfail', login.loginFailed
	app.post '/authok', login.loggedIn

	# /users
	app.get '/users/login/:username', users.findUsername
	app.get '/users', users.findAll
	app.get '/users/:id', users.findById
	app.post '/users', users.addUser
	app.put '/users/:id', users.updateUser
	app.delete '/users/:id', users.deleteUser

	# /images
	app.get '/images', images.findAll
	app.get '/images/:id', images.findById
	app.post '/images', images.addImage
	app.put '/images/:id', images.updateImage
	app.delete '/images/:id', images.deleteImage

	# /videos
	app.get '/videos', videos.findAll
	app.get '/videos/:id', videos.findById
	app.post '/videos', videos.addVideo
	app.put '/videos/:id', videos.updateVideo
	app.delete '/videos/:id', videos.deleteVideo

	# /levels
	app.get '/user/:userid/levels', levels.findByUserId
	app.get '/levels', levels.findAll
	app.get '/levels/:id', levels.findById
	app.post '/levels', levels.addLevel
	app.put '/levels/:id', levels.updateLevel
	app.delete '/levels/:id', levels.deleteLevel

	# /blocks
	app.get '/user/:userid/blocks', blocks.findByUserId
	app.get '/blocks', blocks.findAll
	app.get '/blocks/:id', blocks.findById
	app.post '/blocks', blocks.addBlock
	app.put '/blocks/:id', blocks.updateBlock
	app.delete '/blocks/:id', blocks.deleteBlock

	### SERVER INIT ###
	app.listen 3002
	console.log 'API: INIT [OK]'
