var mongoose       = require('mongoose');
var User         = require('../models/user');
var Profil         = require('../models/profil');
var AccessFonction = require('../models/accessFonction');
var jwt            = require('jsonwebtoken');


module.exports = {

    authentification: function(req, res, callback){
        //no need authentification for /auth route
        if (req.path === '/auth') {
            callback();
            return;
        }

        var self = this;
    	var middlewares = require("./authentification");    
        
        //first, veify token
        var verifiedToken = middlewares.verifyToken(req,res);
        if (verifiedToken) {
            //Second, check user from token
            User.findOne({ _id: verifiedToken._doc._id }, function (err, user) {
                if (err  || !user) {
                	res.json({ success: false, message: 'Authentication failed.' });
                 	return;
                } 
                //third, check access fonction
                AccessFonction.findOne({ 'profil_id': user.profil_id, 'method_name': req.path}, function (err, accessFonction) {
                    if (err || !accessFonction) {
                        res.json({ success: false, message: 'No access for this method.' });
                        return;
                    }
                    if (middlewares.checkAuth(req, accessFonction)) {
                        callback();
                    }else{
                        res.json({ success: false, message: 'No access for this method.' });
                        return;
                    }
                });
            });
        } else {
            res.json({ success: false, message: 'Authentication failed.' });
            return;
        }
    },

    verifyToken: function(req,res){
    	try {
            return jwt.verify(req.headers['x-access-token'], 'secret');
        } catch(err) {
            res.json({ success: false, message: err });
        }
    },

    checkAuth: function(req, accessFonction) {
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
    	        return false;
    	        
    	}
    }

}