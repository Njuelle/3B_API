var jwt           = require('jsonwebtoken');
var mongoose      = require('mongoose');
var Membre          = require('../models/membre');

mongoose.connect('mongodb://localhost:27017/3bdb');

module.exports = {

    authenticate : function(req, res) {
        Membre.findOne({ username: req.body.username }, function (err, membre) {
            if (err) { 
                throw err;
            }
            // No membre found with that username
            if (!membre) { 
                res.json({ success: false, message: 'Authentication failed. Membre not found.' });
            }
            // Make sure the password is correct
            membre.verifyPassword(req.body.password, function(err, isMatch) {
                if (err) { 
                    throw err;
                }
                // Password did not match
                if (!isMatch) { 
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                }
                // Success
                var token = jwt.sign(membre, 'secret', {
                    expiresIn : 60*60*24
                });
                
                res.json({
                    success: true,
                    token: token
                });
            });
        });
    },

    verifyToken: function(token) {
        try {
            return verifiedToken = jwt.verify(token, 'secret');
        } catch(err) {
            return false; 
        }
    },

    isAuth: function(token) {
        var verifiedToken = this.verifyToken(token);
        if (verifiedToken) {
            var membre = this.getMembreFromToken(verifiedToken);
            if (membre) {
                return true;
            }
        }
        return false;
    },

    getMembreFromToken: function(verifiedToken) {
        return Membre.findOne({ id: verifiedToken._doc._id }, function (err, membre) {
            if (err) { 
                throw err;
            }
            if (membre) { 
                return membre;
            }
        });
    }
}

