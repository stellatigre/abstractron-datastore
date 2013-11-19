var sw = require("../../Common/node/swagger.js");
var param = require("../../Common/node/paramTypes.js");
var url = require("url");
var swe = sw.errors;

var petData = require("./usersData.js");

function writeResponse (res, data) {
	sw.setHeaders(res);
  res.send(JSON.stringify(data));
}

exports.findById = {
  'spec': {
	"basePath":"http://localhost:3002/users",
    "description" : "Operations about users",
    "path" : "/users/{userId}",
    "notes" : "Returns a user based on ID",
    "summary" : "Find user by ID",
    "method": "GET",
    "params" : [param.path("userId", "ID of user that needs to be fetched", "string")],
    "responseClass" : "Users",
    "errorResponses" : [swe.invalid('id'), swe.notFound('user')],
    "nickname" : "findById"
  },
  'action': function (req,res) {
    if (!req.params.petId) {
      throw swe.invalid('id'); }
    var id = parseInt(req.params.petId);
    var pet = usersData.getPetById(id);

    if(pet) res.send(JSON.stringify(user));
    else throw swe.notFound('user');
  }
};

exports.findAll = {
  'spec': {
    "description" : "Retrieve user list",  
    "path" : "/users",
    "notes" : "",
    "summary" : "Retrieve all users",
    "method": "GET",
    "responseClass" : "List[Users]",
    "nickname" : "findAll"
  },  
  'action': function (req,res) {
    var output = usersData.findById(statusString);
    res.send(JSON.stringify(output));
  }
};

/*
exports.findByTags = {
  'spec': {
    "path" : "/pet.{format}/findByTags",
    "notes" : "Multiple tags can be provided with comma-separated strings. Use tag1, tag2, tag3 for testing.",
    "summary" : "Find pets by tags",
    "method": "GET",    
    "params" : [param.query("tags", "Tags to filter by", "string", true, true)],
    "responseClass" : "List[Pet]",
    "errorResponses" : [swe.invalid('tag')],
    "nickname" : "findPetsByTags"
  },
  'action': function (req,res) {
    var tagsString = url.parse(req.url,true).query["tags"];
    if (!tagsString) {
      throw swe.invalid('tag'); }
    var output = petData.findPetByTags(tagsString);
    writeResponse(res, output);
  }
};

exports.addPet = {
  'spec': {
    "path" : "/pet.{format}",
    "notes" : "adds a pet to the store",
    "summary" : "Add a new pet to the store",
    "method": "POST",
    "params" : [param.body("Pet", "Pet object that needs to be added to the store", "Pet")],
    "errorResponses" : [swe.invalid('input')],
    "nickname" : "addPet"
  },  
  'action': function(req, res) {
    var body = req.body;
    if(!body || !body.id){
      throw swe.invalid('pet');
    }
    else{
	    petData.addPet(body);
	    res.send(200);
	  }  
  }
};

exports.updatePet = {
  'spec': {
    "path" : "/pet.{format}",
    "notes" : "updates a pet in the store",
    "method": "PUT",    
    "summary" : "Update an existing pet",
    "params" : [param.body("Pet", "Pet object that needs to be updated in the store", "Pet")],
    "errorResponses" : [swe.invalid('id'), swe.notFound('pet'), swe.invalid('input')],
    "nickname" : "addPet"
  },  
  'action': function(req, res) {
    var body = req.body;
    if(!body || !body.id){
      throw swe.invalid('pet');
    }
    else {
	    petData.addPet(body);
	    res.send(200);
	  }
  }
};

exports.deletePet = {
  'spec': {
    "path" : "/pet.{format}/{id}",
    "notes" : "removes a pet from the store",
    "method": "DELETE",
    "summary" : "Remove an existing pet",
    "params" : [param.path("id", "ID of pet that needs to be removed", "string")],
    "errorResponses" : [swe.invalid('id'), swe.notFound('pet')],
    "nickname" : "deletePet" 
  },  
  'action': function(req, res) {
    var id = parseInt(req.params.id);
    petData.deletePet(id)
    res.send(200);
  }
};
*/
