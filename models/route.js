// Load required packages
var mongoose = require('mongoose');

var HeaderSchema = require('./header');

// Define our beer schema
var RouteSchema = new mongoose.Schema({
    header_db: HeaderSchema,
    com: String,
    path: {
        type: String,
        required: true,
        match: [/^[/][a-z/]{1,200}$/, '"Path" fields provided not valid']
    },
    method: {
        type: String,
        required: true,
        enum:[ 'GET', 'POST', 'PUT', 'DELETE' ]
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Route', RouteSchema);