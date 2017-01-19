var jwt            = require('jsonwebtoken');
var mongoose       = require('mongoose');
var Entite         = require('../models/entite');
var Profil         = require('../models/profil');
var AccessFonction = require('../models/accessFonction');



module.exports = {

    authenticate : function(req, res) {
        Entite.findOne({ username: req.body.username }, function (err, entite) {
            if (err) { 
                throw err;
            }
            // No entite found with that username
            if (!entite) { 
                res.json({ success: false, message: 'Authentication failed. Entite not found.' });
            }
            // Make sure the password is correct
            entite.verifyPassword(req.body.password, function(err, isMatch) {
                if (err) { 
                    throw err;
                }
                // Password did not match
                if (!isMatch) { 
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                }
                // Success
                var token = jwt.sign(entite, 'secret', {
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

