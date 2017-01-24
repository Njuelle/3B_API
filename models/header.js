var mongoose = require('mongoose');

var HeaderSchema = new mongoose.Schema({
	uid : {
		type : mongoose.Schema.Types.ObjectId,
	},
	timestamp : { 
		type: Date, 
	},
	owner       : String,
	app         : String,
	statut      : String,
	emetteur_id : String,
});

module.exports = HeaderSchema;