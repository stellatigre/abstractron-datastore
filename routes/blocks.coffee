DB = require './DB'
Promise = require 'bluebird'

mongo = require("mongodb")
BSON = mongo.BSONPure

DB.collection('blocks')
.catch(->
	console.log "Blocks collection does not exist, creating from sample data."
	populateDB()
	Promise.resolve()
)
.done(->
	console.log "users: Connection opened (blocks)."
)

# used below
urlRegex = new RegExp("https?://(?:www.|(?!www))[^s.]+.[^s]{2,}|www.[^s]+.[^s]{2,}")
validateBlockData = (block, res, callback) ->
	validated = undefined
	if block
		if urlRegex.test(block["url"]) is false
			res.statusCode = 400
			res.send error: "URL value appears to not be valid."
			validated = false
		else if block["name"] is (`undefined` or "")
			res.statusCode = 400
			res.send error: "Block lacks a name, please add one"
			validated = false
		else
			validated = true
		if validated
			callback block, res
		else
			callback()
	return

addBlockInternal = (block, res) ->
	if block
		console.log "Adding block: " + JSON.stringify(block)
		DB.collection('blocks').done (collection)->
			collection.insert block,
				safe: true
			, (err, result) ->
				if err
					res.send error: "An error occurred on block insert."
				else
					console.log "Success: " + JSON.stringify(result[0])
					res.send result[0]
				return
			return
	return


# NOTE: Levels by userid may not work yet, but blocks are fine.
exports.findByUserId = (req, res) ->
	userid = req.params.userid
	console.log "Retrieving blocks for user: " + userid
	DB.collection('blocks').done (collection)->
		collection.find(userid: userid).toArray (err, items) ->
			console.log "Found " + items.length + " block(s) for user " + userid
			res.send items
			return
		return
	return

exports.findAll = (req, res) ->
	DB.collection('blocks').done (collection)->
		collection.find().toArray (err, items) ->
			res.send items
			return
		return
	return

exports.findById = (req, res) ->
	id = req.params.id
	console.log "Retrieving block: " + id
	DB.collection('blocks').done (collection)->
		collection.findOne
			_id: new BSON.ObjectID(id)
		, (err, item) ->
			res.send item
			return
		return
	return

exports.addBlock = (req, res) ->
	validateBlockData req.body, res, addBlockInternal
	return

exports.updateBlock = (req, res) ->
	id = req.params.id
	block = req.body
	console.log "Updating block: " + id
	console.log JSON.stringify(block)
	DB.collection('blocks').done (collection)->
		collection.update
			_id: new BSON.ObjectID(id)
		, block,
			safe: true
		, (err, result) ->
			if err
				console.log "Error updating block: " + err
				res.send error: "An error occurred on block update."
			else
				console.log "" + result + " document(s) updated."
				res.send block
			return
		return
	return

exports.deleteBlock = (req, res) ->
	id = req.params.id
	console.log "Deleting block: " + id
	DB.collection('blocks').done (collection)->
		collection.remove
			_id: new BSON.ObjectID(id)
		,
			safe: true
		, (err, result) ->
			if err
				res.send error: "An error occurred on block delete."
			else
				console.log "" + result + " document(s) deleted."
				res.send req.body
			return
		return
	return


# SAMPLE DATA 
populateDB = ->
	blocks = require("./sample_data/blocks.json")
	DB.collection('blocks').done (collection)->
		collection.insert blocks,
			safe: true
		, (err, result) ->
		return
	return
