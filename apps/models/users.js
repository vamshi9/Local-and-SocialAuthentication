var mongoose =  require('mongoose');
var bcrypt = require('bcrypt-nodejs');

 var userSchema = mongoose.Schema({
 	local : {
 		email :String,
 		password :String
 	},
     
    facebook : {
    	id : String,
    	token : String,
    	email : String,
    	name : String
    },

    twitter : {
    	id : String,
    	token : String,
    	displayName : String,
    	name: String
    },

    google : {
    	id : String,
    	token :String ,
    	email : String,
    	name : String
    }

 }); 


//generating a hash
 userSchema.methods.generateHash = function(password){
 	return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
 };

//validating password
 userSchema.methods.validPassword = function(password){
 	return bcrypt.compareSync(password,this.local.password);
 }; 




 module.exports = mongoose.model('User',userSchema)