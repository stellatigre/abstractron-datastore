DB = require '../DB'
Promise = require 'bluebird'

mongo = require("mongodb")
BSON = mongo.BSONPure

DB.collection('users', strict: true)
.catch(->
	console.log "Users collection does not exist, creating from sample data."
	populateDB()
	Promise.resolve()
)
.done(->
	console.log "users: Connection opened."
)

exports.loginUserCheck = (req, res) ->
	DB.collection('users').done (collection)->
		collection.findOne
			username: username
		, (err, item) ->
			res.send item
			return
		return
	return

exports.findUsername = (req, res) ->
	username = req.params.username
	DB.collection('users').done (collection)->
		collection.findOne
			username: username
		, (err, item) ->
			res.json _id: item._id
			return
		return
	return

exports.findAll = (req, res) ->
	DB.collection('users').done (collection)->
		collection.find().toArray (err, items) ->
			res.send items
			return
		return
	return

exports.findById = (req, res) ->
	id = req.params.id
	console.log "Retrieving user: " + id
	DB.collection('users').done (collection)->
		collection.findOne
			_id: new BSON.ObjectID(id)
		, (err, item) ->
			res.send item
			return
		return
	return

exports.addUser = (req, res) ->
	user = req.body
	console.log "Adding user: " + JSON.stringify(user)
	DB.collection('users').done (collection)->
		
		# Fail on existing username
		collection.findOne
			username: user.username
		, (err, item) ->
			res.end "Username is taken."
			return

		
		# Fail on existing email
		collection.findOne
			email: user.email
		, (err, item) ->
			res.end "Email already registered."
			return

		collection.insert user,
			safe: true
		, (err, result) ->
			if err
				res.send error: "An error occurred on user insert."
			else
				console.log "Success: " + JSON.stringify(result[0])
				
				# We only want to return the user id generated.
				res.json _id: result[0]._id
			return
		return
	return

exports.updateUser = (req, res) ->
	id = req.params.id
	user = req.body
	console.log "Updating user: " + id
	console.log JSON.stringify(user)
	DB.collection('users').done (collection)->
		collection.update
			_id: new BSON.ObjectID(id)
		, user,
			safe: true
		, (err, result) ->
			if err
				console.log "Error updating user: " + err
				res.send error: "An error occurred on user update."
			else
				console.log "" + result + " document(s) updated."
				res.send user
			return
		return
	return

exports.deleteUser = (req, res) ->
	id = req.params.id
	console.log "Deleting user: " + id
	DB.collection('users').done (collection)->
		collection.remove
			_id: new BSON.ObjectID(id)
		,
			safe: true
		, (err, result) ->
			if err
				res.send error: "An error occurred on user delete."
			else
				console.log "" + result + " document(s) deleted."
				res.send req.body
			return
		return
	return


# SAMPLE DATA 
populateDB = ->
	users = require("./sample_data/users.json")
	DB.collection('users').done (collection)->
		collection.insert users,
			safe: true
		, (err, result) ->
		return
	return