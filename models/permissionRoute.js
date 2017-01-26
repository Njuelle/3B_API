// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var PermissionRoute = new mongoose.Schema({
    header_db: HeaderSchema,
      route: {type: String, required: true},
      method: {type: String, required: true},
      permission: {type: Boolean, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('PermissionRoute', PermissionRouteSchema);