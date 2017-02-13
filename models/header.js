var mongoose = require('mongoose');

var HeaderSchema = new mongoose.Schema({
	_id : false,
	uid : {
		type : mongoose.Schema.Types.ObjectId,
	},
	timestamp : { 
		type: Date, 
	},
	app         : String,
	statut      : String,
	emetteur_id : String,
});

module.exports = HeaderSchema;