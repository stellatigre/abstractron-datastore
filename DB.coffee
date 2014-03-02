mongo		= require 'mongodb'
Promise = require 'bluebird'

class DB
	constructor: ->
		Server = mongo.Server
		Db = mongo.Db
		BSON = mongo.BSONPure
		server = new Server 'localhost', 27017, auto_reconnect: true
		db = new Db 'abstractapi', server, safe: false
		@openPromise = new Promise (resolve, reject)->
			db.open (err, db) ->
				if err
					reject new Error 'Could not open connection to database: '+err
				else
					resolve db

	open: -> @openPromise

	collection: (collectionName)->
		new Promise (resolve, reject)=>
			@open()
			.then (db)->
				db.collection "users", {strict: true}, (err, data)->
					if err
						reject err
					else
						resolve data



module.exports = new DB