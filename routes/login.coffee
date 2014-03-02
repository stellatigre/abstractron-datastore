DB = require '../DB'

DB.collection('users')
.catch(->
)
.done(->
	console.log "login: Connection opened (users)."
)

exports.loggedIn = (req, res) ->
	res.json login: "ok"
	return

exports.loginFailed = (req, res) ->
	res.json login: "fail"
	return