DB = require '../DB'
Promise = require 'bluebird'

mongo = require("mongodb")
BSON = mongo.BSONPure

DB.collection('videos', strict: true)
.catch(->
	console.log "Videos collection does not exist, creating from sample data."
	populateDB()
	Promise.resolve()
)
.done(->
	console.log "videos: Connection opened (videos)."
)

urlRegex = new RegExp("https?://(?:www.|(?!www))[^s.]+.[^s]{2,}|www.[^s]+.[^s]{2,}")
validateVideoData = (video, res, callback) ->
	validated = undefined
	if video
		if urlRegex.test(video["url"]) is false
			res.statusCode = 400
			res.send error: "URL value appears to not be valid."
			validated = false
		else if video["name"] is (`undefined` or "")
			res.statusCode = 400
			res.send error: "Video lacks a name, please add one"
			validated = false
		else
			validated = true
		if validated
			callback video, res #console.log('validated callback success');
		else #console.log ('callback being called with no arguments');
			callback()
	return

addVideoInternal = (video, res) ->
	if video
		console.log "Adding video: " + JSON.stringify(video)
		DB.collection('videos').done (collection)->
			collection.insert video,
				safe: true
			, (err, result) ->
				if err
					res.send error: "An error occurred on video insert."
				else
					console.log "Success: " + JSON.stringify(result[0])
					res.send result[0]
				return
			return
	return

exports.findAll = (req, res) ->
	DB.collection('videos').done (collection)->
		collection.find().toArray (err, items) ->
			res.send items
			return

		return

	return

exports.findById = (req, res) ->
	id = req.params.id
	console.log "Retrieving video: " + id
	DB.collection('videos').done (collection)->
		collection.findOne
			_id: new BSON.ObjectID(id)
		, (err, item) ->
			res.send item
			return

		return

	return

exports.addVideo = (req, res) -> # validate, then add on callback
	validateVideoData req.body, res, addVideoInternal
	return

exports.updateVideo = (req, res) ->
	id = req.params.id
	video = req.body
	console.log "Updating video: " + id
	console.log JSON.stringify(video)
	DB.collection('videos').done (collection)->
		collection.update
			_id: new BSON.ObjectID(id)
		, video,
			safe: true
		, (err, result) ->
			if err
				console.log "Error updating video: " + err
				res.send error: "An error occurred on video update."
			else
				console.log "" + result + " document(s) updated."
				res.send video
			return

		return

	return

exports.deleteVideo = (req, res) ->
	id = req.params.id
	console.log "Deleting video: " + id
	DB.collection('videos').done (collection)->
		collection.remove
			_id: new BSON.ObjectID(id)
		,
			safe: true
		, (err, result) ->
			if err
				res.send error: "An error occurred on video delete."
			else
				console.log "" + result + " document(s) deleted."
				res.send req.body
			return

		return

	return


# SAMPLE DATA 
populateDB = ->
	videos = [
		{
			name: "Bill Gates"
			url: "http://www.geofffox.com/wp-content/uploads/2010/09/bill_gates.jpg"
		}
		{
			name: "Emilio Estevez"
			url: "http://2.bp.blogspot.com/-HnxvM6zP6kw/Te7oO9wWntI/AAAAAAAAADc/TNJiKL5lf1M/s320/md1.jpg"
		}
	]
	DB.collection('videos').done (collection)->
		collection.insert videos,
			safe: true
		, (err, result) ->

		return

	return