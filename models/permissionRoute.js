// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var PermissionRouteSchema = new mongoose.Schema({
	header_db: HeaderSchema,
    route : String,
    method : String,
    permission : Boolean,
});

// Export the Mongoose model
module.exports = mongoose.model('PermissionRoute', PermissionRouteSchema);