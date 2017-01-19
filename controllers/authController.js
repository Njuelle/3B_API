var jwt            = require('jsonwebtoken');
var mongoose       = require('mongoose');
var User         = require('../models/user');

module.exports = {

    authenticate : function(req, res) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { 
                res.json({ success: false, message: err });
            }
            // No user found with that username
            if (!user) { 
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            // Make sure the password is correct
            user.verifyPassword(req.body.password, function(err, isMatch) {
                if (err) { 
                    res.json({ success: false, message: err });
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
                    token: token
                });
            });
        });
    }
}

