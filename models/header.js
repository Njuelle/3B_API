var mongoose = require('mongoose');

var HeaderSchema = new mongoose.Schema({
	uid : {
		type : String,
		default : mongoose.Types.ObjectId()
	},
	timestamp : { 
		type: Date, 
		default: Date.now
	},
	owner     : String,
	app       : String,
	statut    : String,
	entity_id : String
});

module.exports = HeaderSchema;