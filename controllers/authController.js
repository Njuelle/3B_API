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
        // console.log(req.body.username);
        // console.log(req.body.password);
        var self = require('./authController');
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { 
                res.json({ success: false, message: err });
            }
            // No user found with that username
            if (!user) { 
                res.status(401);
                res.json({ success: false, message: 'Authentication failed. User not found.' });
                return;
            }
            
            // Make sure the password is correct
            if (self.verifyPassword(req.body.password, user.password)){
                var token = jwt.sign(user, 'secret', {
                    expiresIn : 60*60*24
                });
                res.status(200);
                res.json({
                    success: true,
                    token: token
                });
                return;
            } else {
                res.status(401);
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                return;
            }
        });    
    },

    verifyPassword : function(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}

