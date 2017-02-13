// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var PermissionRouteSchema = new mongoose.Schema({
    header_db: HeaderSchema,
    route: {
        type: String,
        required: true,
        unique: false,
        match: [/^[/][a-z/]{1,200}$/, '"Route" fields provided not valid']
    },
    method: {
        type: String,
        required: true,
        enum:[ 'GET', 'POST', 'PUT', 'DELETE' ]
    },
});

// Export the Mongoose model
module.exports = mongoose.model('PermissionRoute', PermissionRouteSchema);