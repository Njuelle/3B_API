var mongoose        = require('mongoose');
var User            = require('../models/user');
var Profil          = require('../models/profil');
var PermissionRoute = require('../models/permissionRoute');
var jwt             = require('jsonwebtoken');


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
                	res.json({ success: false, message: 'Authentication failed. No user founds' });
                 	return;
                }
                
                //get profils of current user
                var listProfilId = self.getListProfilId(user);

                Profil.find({'header_db.uid': { $in: listProfilId}}, function(err, profils){
                    if (err  || !profils) {
                        res.json({ success: false, message: 'Authentication failed. No profil founds' });
                        return;
                    }
                    
                    listPermsId = self.getListPermId(profils);
                    PermissionRoute.find({'header_db.uid': { $in: listPermsId}}, function(err, permissions){
                        if (err  || !permissions) {
                            res.json({ success: false, message: 'Authentication failed. No permission founds' });
                            return;
                        }
                        if (self.checkIsAuth(permissions)){
                            callback();
                        } else {
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

    getListPermId: function(profils) {
        listPermsId = Array();
        profils.forEach(function(profil) { 
            profil.permissions.forEach(function(perms) { 
                listPermsId.push(
                    mongoose.Types.ObjectId(perms.permission_id)
                );     
            });   
        });
        return listPermsId;
    },

    checkIsAuth: function(permissions) {
        var isAuth = false;
        permissions.forEach(function(permission) { 
            if(permission.permission) {
                isAuth = true;
            }    
        });
        return isAuth;
    }
}