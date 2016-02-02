/*
  If you are using a local Mongo instance then we have to export this module into our "app.js"

  else we have to use cloud database services like Modulus or MongoLab

  and then create db.js which should contain

  module.exports = {
       'url' : 'mongodb://<dbuser>:<dbpassword>@novus.modulusmongo.net:27017/<dbName>'
  }

*/

module.exports = {
	'url' : 'mongodb://localhost/db_drakle' 
}