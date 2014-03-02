DB = require '../DB'

DB.collection('users', strict: true)
.catch(->
)
.done(->
	console.log "register: Connection opened (users)."
)



# No routes needed yet.