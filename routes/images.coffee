DB = require '../DB'
Promise = require 'bluebird'

mongo = require("mongodb")
BSON = mongo.BSONPure

DB.collection('images', strict: true)
.catch(->
	console.log "Images collection does not exist, creating from sample data."
	populateDB()
	Promise.resolve()
)
.done(->
	console.log "images: Connection opened (images)."
)

exports.findAll = (req, res) ->
	DB.collection('images').done (collection)->
		collection.find().toArray (err, items) ->
			res.send items
			return
		return
	return

exports.findById = (req, res) ->
	id = req.params.id
	console.log "Retrieving image: " + id
	DB.collection('images').done (collection)->
		collection.findOne
			_id: new BSON.ObjectID(id)
		, (err, item) ->
			res.send item
			return
		return
	return


# We're gonna use this below, just didn't want to re-construct it all the time
urlRegex = new RegExp("https?://(?:www.|(?!www))[^s.]+.[^s]{2,}|www.[^s]+.[^s]{2,}")
validateImageData = (image, res, callback) ->
	validated = undefined
	if image
		if urlRegex.test(image["url"]) is false
			res.statusCode = 400
			res.send error: "URL value appears to not be valid."
			validated = false
		else if !image.name
			res.statusCode = 400
			res.send error: "Image lacks a name, please add one"
			validated = false
		else
			validated = true
		if validated
			callback image, res #console.log('validated callback success')
		else #console.log ('callback being called with no arguments')
			callback()
	return

addImageInternal = (image, res) ->
	if image
		console.log "Adding image: " + JSON.stringify(image)
		DB.collection('images').done (collection)->
			collection.insert image,
				safe: true
			, (err, result) ->
				if err
					res.send error: "An error occurred on image insert."
				else
					console.log "Success: " + JSON.stringify(result[0])
					res.send result[0]
				return
			return
	return

exports.addImage = (req, res) ->
	validateImageData req.body, res, addImageInternal
	return

exports.updateImage = (req, res) ->
	id = req.params.id
	image = req.body
	console.log "Updating image: " + id
	console.log JSON.stringify(image)
	DB.collection('images').done (collection)->
		collection.update
			_id: new BSON.ObjectID(id)
		, image,
			safe: true
		, (err, result) ->
			if err
				console.log "Error updating image: " + err
				res.send error: "An error occurred on image update."
			else
				console.log "" + result + " document(s) updated."
				res.send image
			return
		return
	return

exports.deleteImage = (req, res) ->
	id = req.params.id
	console.log "Deleting image: " + id
	DB.collection('images').done (collection)->
		collection.remove
			_id: new BSON.ObjectID(id)
		,
			safe: true
		, (err, result) ->
			if err
				res.send error: "An error occurred on image delete."
			else
				console.log "" + result + " document(s) deleted."
				res.send req.body
			return
		return
	return


# SAMPLE DATA
populateDB = ->
	images = require("./sample_data/images.json")
	DB.collection('images').done (collection)->
		collection.insert images,
			safe: true
		, (err, result) ->
		return
	return
