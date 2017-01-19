// Load required packages
var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var jwt          = require('jsonwebtoken');
var HeaderSchema = require('./header');

// Define our user schema
var UserSchema = new mongoose.Schema({
    header_db: [HeaderSchema],
    login: String,
    password: String,
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
    var user = this;
    // Break out if the password hasn't changed
    if (!user.isModified('password')){
        return callback();
    }    
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err){
            return callback(err);  
        } 
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err){
                return callback(err);
            } 
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err){
            return callback(err);  
        } 
        callback(null, isMatch);
    });
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);