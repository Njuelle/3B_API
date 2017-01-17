var jwt           = require('jsonwebtoken');
var mongoose      = require('mongoose');
var User          = require('../models/user');

mongoose.connect('mongodb://localhost:27017/3bdb');

module.exports = {

    authenticate : function(req, res) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { 
                throw err;
            }
            // No user found with that username
            if (!user) { 
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            // Make sure the password is correct
            user.verifyPassword(req.body.password, function(err, isMatch) {
                if (err) { 
                    throw err;
                }
                // Password did not match
                if (!isMatch) { 
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                }
                // Success
                var token = jwt.sign(user, 'secret', {
                    expiresIn : 60*60*24
                });
                
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            });
        });
    },

    verifyToken: function(token) {
        try {
            var verifiedToken = jwt.verify(token, 'secret');
            return true;
        } catch(err) {
            return false; 
        }
    }


}
