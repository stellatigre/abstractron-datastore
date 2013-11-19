var tags = {
  1: {id: 1, name: "tag1"},
  2: {id: 2, name: "tag2"},
  3: {id: 3, name: "tag3"},
  4: {id: 4, name: "tag4"}};

var users = {
  1: {id: 1, 
		username: 'chris',
		email: 'chris@abstractron.com'
	},
  2: {id: 2, 
		username: 'stella',
		email: 'stella@abstractron.com'
	}
};

exports.findById = function findById(id) {
  return users[id];
}

exports.findAll = function findAll() {
	return users;
}

exports.addUser = function addUser(pet){
  users[user.id] = user;
}

exports.deleteUser = function deleteUser(id) {
  delete users[id];
}