// Load required packages
var PermissionRoute = require('../models/permissionRoute');
var User            = require('../models/user');
var Profil          = require('../models/profil');
var crudController  = require('../controllers/crudController');
var userController  = require('../controllers/userController');
var mongoose        = require('mongoose');

module.exports = {
    
    postPermissionRoute : function(req, res) {
        crudController.postObject(PermissionRoute, req, res);
    },

    getPermissionRoute : function(req, res) {
        crudController.getAllObjects(PermissionRoute, req, res);
    },

    getPermissionRouteById : function(req, res) {
        crudController.getObjectById(PermissionRoute, req, res);  
    },

    getPermissionRouteCurrentUser : function(req, res) {
        var userId = userController.getUserIdFromToken(req);
        User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
            }
            var listProfilId = Array();
            user.profils.forEach(function(profil) { 
                listProfilId.push(
                    mongoose.Types.ObjectId(profil.profil_id)
                );
            });
            Profil.find({'header_db.uid': { $in: listProfilId}}, function(err, profils){
                if (err  || !profils) {
                    res.status(401);
                    res.json({ success: false, message: 'No profil founds' });
                    return;
                }
                var listRoutesId = Array();
                profils.forEach(function(profil){
                    profil.permissions_route.forEach(function(perm) { 
                        listRoutesId.push(
                            mongoose.Types.ObjectId(perm.header_db.uid)
                        ); 
                    });    
                });
                res.status(200);
                res.json(listRoutesId);
                return;
            });
        });
    },

    getPermissionRouteByUser : function(req, res) {
        var userId = req.params.uid;
        User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
            }
            var listProfilId = Array();
            user.profils.forEach(function(profil) { 
                listProfilId.push(
                    mongoose.Types.ObjectId(profil.profil_id)
                );
            });
            Profil.find({'header_db.uid': { $in: listProfilId}}, function(err, profils){
                if (err  || !profils) {
                    res.status(401);
                    res.json({ success: false, message: 'No profil founds' });
                    return;
                }
                var listRoutesId = Array();
                profils.forEach(function(profil){
                    profil.permissions_route.forEach(function(perm) { 
                        listRoutesId.push(
                            mongoose.Types.ObjectId(perm.header_db.uid)
                        );
                    });    
                });
                res.status(200);
                res.json(listRoutesId);
                return;
            });
        });
    },

    putPermissionRoute : function(req, res) {
        crudController.putObject(PermissionRoute, req, res);
    },

    deletePermissionRoute : function(req, res) {
        crudController.deleteObject(PermissionRoute, req, res);
    }
}

