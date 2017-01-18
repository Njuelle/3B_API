// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var AccessFunctionSchema = new mongoose.Schema({
	header_db: [HeaderSchema],
    profil_id : String,
    method_name : String,
    read_permission : Boolean,
    create_permission : Boolean,
    edit_permission : Boolean,
    delete_permission : Boolean
});

// Export the Mongoose model
module.exports = mongoose.model('AccessFunction', AccessFunctionSchema);