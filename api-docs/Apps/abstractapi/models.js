module.exports = {
    "Users":{
      "id":"Users",
      "properties":{
        "tags":{
          "items":{
            "$ref":"Tag"
          },
          "type":"Array"
        },
        "id":{
          "type":"long"
        },
        "username":{
          "description":"Username",
          "type":"string"
        },
        "email":{
			"description":"User E-mail address",
			"type":"string"
        }
      }
    }
  }
