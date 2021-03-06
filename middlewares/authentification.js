var mongoose = require('mongoose');
var User     = require('../models/user');
var Profil   = require('../models/profil');
var Route    = require('../models/route');
var jwt      = require('jsonwebtoken');


module.exports = {
    /**
     * Main authentification middleware function
     * for router, called before each routes function 
     * 
     * @param  req {[request]}
     * @param  res {[response]}
     * @param  callback {Function}
     */
    authentification: function(req, res, callback){
        //no need authentification for /auth route
        if (req.path === '/auth') {
            callback();
            return;
        }

    	var self = require("./authentification");     
        
        //first, verify token
        var verifiedToken = self.verifyToken(req,res);
        if (verifiedToken) {
            //Second, check user from token
            User.findOne({ 'header_db.uid': verifiedToken._doc.header_db.uid }, function (err, user) {
                if (err  || !user) {
                    res.status(401);
                	res.json({ success: false, message: 'Authentication failed. No user founds' });
                 	return;
                }
                
                //get profils of current user
                var listProfilId = self.getListProfilId(user);
                Profil.find({'header_db.uid': { $in: listProfilId}}, function(err, profils){
                    if (err  || !profils) {
                        res.status(401);
                        res.json({ success: false, message: 'Authentication failed. No profil founds' });
                        return;
                    }
                    listPermsId = self.getListRouteId(profils);

                    Route.find({'header_db.uid': { $in: listPermsId}}, function(err, permissions){
                        if (err  || !permissions) {
                            res.status(401);
                            res.json({ success: false, message: 'Authentication failed. No permission founds' });
                            return;
                        }

                        if (self.checkIsAuth(permissions, req)){
                            callback();
                        } else {
                            res.status(403);
                            res.json({ success: false, message: 'Authentication failed. No authorisations founds' });
                        }
                    });
                });
               
            });
        } else {
            res.json({ success: false, message: 'Authentication failed. No token provided' });
            return;
        }
    },

    /**
     * Verify token from request
     * 
     * @param  req {[request]}
     * @param  res {[response]}
     * @return decoded token
     */
    verifyToken: function(req,res){
    	try {
            return jwt.verify(req.headers['x-access-token'], 'secret');
        } catch(err) {
            res.json({ success: false, message: err });
        }
    },

    getListProfilId: function(user) {
        var listProfilId = Array();
        user.profils.forEach(function(profil) {
            listProfilId.push(
                mongoose.Types.ObjectId(profil.profil_id)
            );
        });
        return listProfilId;
    },

    getListRouteId: function(profils) {
        listPermsId = Array();
        profils.forEach(function(profil) { 
            profil.permissions_routage.forEach(function(perms) { 
                listPermsId.push(
                    mongoose.Types.ObjectId(perms.routage_id)
                );     
            });   
        });
        return listPermsId;
    },

    checkIsAuth: function(routes, req) {
        var method = req.method;
        var originalUrl = req.originalUrl;
        var url = originalUrl.replace(/[0-9a-fA-F]{24}/g, ':uid');
        var url = url.replace('/api', '');
        var isAuth = false;
        routes.forEach(function(route) { 
            if(route.path == url && route.method == method) {
                isAuth = true;
            }    
        });
        return isAuth;
    }
}