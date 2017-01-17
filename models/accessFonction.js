// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var AccessFunctionSchema = new mongoose.Schema({
	header_db: {
		uid       : String,
		timestamp : Timestamp,
		owner     : String,
		app       : String,
		entity_id : String,
		statut    : String,
	}
    profile_id : String,
    method_name : String,
    read_permission : Bool,
    create_permission : Bool,
    edit_permission : Bool,
    delete_permission : Bool,

});

// Export the Mongoose model
module.exports = mongoose.model('AccessFunction', AccessFunctionSchema);

