var jwt      = require('jsonwebtoken');
var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User     = require('../models/user');

module.exports = {
    /**
     * Generate token after check user and password
     * 
     * @param  req {[request]}
     * @param  res {[response]}
     */
    getToken : function(req, res) {
        var self = require('./authController');
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { 
                res.json({ success: false, message: err });
            }
            // No user found with that username
            if (!user) { 
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            // Make sure the password is correct
            if (self.verifyPassword(req.body.password, user.password)){
                var token = jwt.sign(user, 'secret', {
                    expiresIn : 60*60*24
                });
                 
                res.json({
                    success: true,
                    token: token
                });
            } else {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }
        });    
    },

    verifyPassword : function(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}

