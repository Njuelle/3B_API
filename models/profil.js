// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ProfilSchema = new mongoose.Schema({
	header_db: {
		uid       : String,
		timestamp : Timestamp,
		owner     : String,
		app       : String,
		entity_id : String,
		statut    : String,
	}
    name : String,
});

// Export the Mongoose model
module.exports = mongoose.model('Profil', ProfilSchema);

