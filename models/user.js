// Load required packages
var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var jwt          = require('jsonwebtoken');
var HeaderSchema = require('./header');

// Define our user schema
var UserSchema = new mongoose.Schema({
    header_db: HeaderSchema,
    username: String,
    password: String,
    entite_id: Moo,
    profils: [{ profil_id : String }]
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);