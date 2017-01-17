// Load required packages
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jsonwebtoken');

// Define our membre schema
var MembreSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Execute before each membre.save() call
MembreSchema.pre('save', function(callback) {
    var membre = this;
    // Break out if the password hasn't changed
    if (!membre.isModified('password')){
        return callback();
    }    
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err){
            return callback(err);  
        } 
        bcrypt.hash(membre.password, salt, null, function(err, hash) {
            if (err){
                return callback(err);
            } 
            membre.password = hash;
            callback();
        });
    });
});

MembreSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err){
            return callback(err);  
        } 
        callback(null, isMatch);
    });
};

// Export the Mongoose model
module.exports = mongoose.model('Membre', MembreSchema);