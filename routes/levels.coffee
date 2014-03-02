Promise = require 'bluebird'
mongo = require 'mongodb'
BSON = mongo.BSONPure

DB = require '../DB'

# Promise.all([
# 	DB.collection('users')
# ])
DB.collection('levels', strict: true)
.catch(->
	console.log "Levels collection does not exist, creating from sample data."
	populateDB()
	Promise.resolve()
)
.done ->
	console.log "levels: Connection opened (users, levels)."


# NOTE: This is just returning all records for now, when none contain
#		 a userid property.
exports.findByUserId = (req, res) ->
	userid = req.params.userid
	console.log "Retrieving levels for user: " + userid
	DB.collection("levels").done (collection)->
		collection.find().toArray (err, items) -> #{"userid":userid}
			console.log "Found " + items.length + " level(s) for user " + userid
			res.send items
			return
		return
	return

exports.findAll = (req, res) ->
	DB.collection("levels").done (collection) ->
		collection.find().toArray (err, items) ->
			res.send items
			return
		return
	return

exports.findById = (req, res) ->
	id = req.params.id
	console.log "Retrieving level: " + id
	DB.collection("levels").done (collection)->
		collection.findOne
			_id: new BSON.ObjectID(id)
		, (err, item) ->
			res.send item
			return
		return
	return

exports.addLevel = (req, res) ->
	level = req.body
	console.log "Adding level..."
	DB.collection("levels").done (collection)->
		collection.insert level,
			safe: true
		, (err, result) ->
			if err
				res.send error: "An error occurred on level insert."
			else
				console.log "Success: " + JSON.stringify(result[0])
				res.send result[0]
			return
		return
	return

exports.updateLevel = (req, res) ->
	id = req.params.id
	level = req.body
	console.log "Updating level: " + id
	console.log JSON.stringify(level)
	DB.collection("levels").done (collection)->
		collection.update
			_id: new BSON.ObjectID(id)
		, level,
			safe: true
		, (err, result) ->
			if err
				console.log "Error updating level: " + err
				res.send error: "An error occurred on level update."
			else
				console.log "" + result + " document(s) updated."
				res.send level
			return

		return

	return

exports.deleteLevel = (req, res) ->
	id = req.params.id
	console.log "Deleting level: " + id
	DB.collection("levels").done (collection)->
		collection.remove
			_id: new BSON.ObjectID(id)
		,
			safe: true
		, (err, result) ->
			if err
				res.send error: "An error occurred on level delete."
			else
				console.log "" + result + " document(s) deleted."
				res.send req.body
			return

		return

	return


# SAMPLE DATA
populateDB = ->
	levels = [
		name: "TestLevel"
		rooms: [blocks: [
			{
				x: "1"
				y: "1"
				z: "1"
				type: "2"
				image: "2"
			}
			{
				x: "0"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "0"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "1"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "2"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "3"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "4"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "5"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "6"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "7"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "8"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "9"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "10"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "11"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "12"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "13"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "14"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "0"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "1"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "2"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "3"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "4"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "5"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "6"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "7"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "8"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "9"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "10"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "11"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "12"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "13"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "14"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "0"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "1"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "2"
				z: "15"
				type: "16"
				image: "16"
			}
			{
				x: "15"
				y: "3"
				z: "15"
				type: "16"
				image: "16"
			}
		]]
	]
	DB.collection("levels").done (collection) ->
		collection.insert levels,
			safe: true
		, (err, result) ->

		return

	return