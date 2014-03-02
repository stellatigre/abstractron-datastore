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

	collection: (collectionName, options={})=>
		@open().then (db)->
			new Promise (resolve, reject)=>
				db.collection collectionName, options, (err, data)->
					if err
						reject err
					else
						resolve data



module.exports = new DB