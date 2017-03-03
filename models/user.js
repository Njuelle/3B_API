// Load required packages
var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var jwt          = require('jsonwebtoken');
var HeaderSchema = require('./header');

// Define our user schema
var UserSchema = new mongoose.Schema({
  header_db: HeaderSchema,
  username: {type: String, required: true},
  password: {type: String, required: true},
  entity_id: {type: mongoose.Schema.Types.ObjectId, required: true},
  profils: [{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    profil_id: {type: mongoose.Schema.Types.ObjectId, required: true}
  }],
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);