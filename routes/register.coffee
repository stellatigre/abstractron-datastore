DB = require '../DB'

DB.collection('users')
.catch(->
)
.done(->
	console.log "register: Connection opened (users)."
)



# No routes needed yet.