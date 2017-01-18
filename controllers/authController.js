var jwt            = require('jsonwebtoken');
var mongoose       = require('mongoose');
var Entite         = require('../models/entite');
var Profil         = require('../models/profil');
var AccessFonction = require('../models/accessFonction');

mongoose.connect('mongodb://localhost:27017/3bdb');

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
    },

    verifyToken: function(token) {
        try {
            return verifiedToken = jwt.verify(token, 'secret');
        } catch(err) {
            // no need to show error here, only return false
            return false; 
        }
    },

    isAuth: function(res, req, callback) {
        //first, veify token
        var self = this;
        var verifiedToken = this.verifyToken(req.headers['x-access-token']);
        if (verifiedToken) {
            //Second, check user from token
            Entite.findOne({ _id: verifiedToken._doc._id }, function (err, entite) {
                if (err  || !entite) {
                  res.json({ success: false, message: 'Authentication failed.' });
                  return;
                } 
                //third, check access fonction
                AccessFonction.findOne({ 'profil_id': entite.profil_id, 'method_name': req.path}, function (err, accessFonction) {
                    if (err || !accessFonction) {
                        res.json({ success: false, message: 'No access for this method.' });
                        return;
                    }    
                    var isAuth = self.checkAuth(accessFonction, req);
                    if (isAuth) {
                        callback(res);
                    }else{
                        res.json({ success: false, message: 'No access for this method.' });
                    }
                    
                });

            });
        } else {
            res.json({ success: false, message: 'Authentication failed.' });
        }
        
    },

    checkAuth: function(accessFonction, req) {
        switch(req.method) {
            case 'GET':
                if (accessFonction.read_permission) {
                    return true;
                }
                break;
            case 'POST':
                if (accessFonction.create_permission) {
                    return true;
                }
                break;
            case 'PUT':
                if (accessFonction.edit_permission) {
                    return true;
                }
                break;
            case 'DELETE':
                if (accessFonction.delete_permission) {
                    return true;
                }
                break; 
            default:
                return false
                
        }
        return false;
    }


}

