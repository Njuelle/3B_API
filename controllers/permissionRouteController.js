// Load required packages
var PermissionRoute = require('../models/permissionRoute');
var User            = require('../models/user');
var Profil          = require('../models/profil');
var crudController  = require('../controllers/crudController');
var userController  = require('../controllers/userController');
var mongoose        = require('mongoose');

module.exports = {
    
    postPermissionRoute : function(req, res) {
        PermissionRoute.findOne({
                'route'  : req.route, 
                'method' : req.method
            },
            function(err, perm) {
                if (err) {
                    res.status(404);
                    res.json({ success: false, message: err });
                    return;
                }
                if(!perm) {
                    res.status(400);
                    res.json({ success: false, message: 'duplicate route or method' });
                    return;
                } 
                crudController.postObject(PermissionRoute, req, res);
            }
        );        
    },

    getPermissionRoute : function(req, res) {
        crudController.getAllObjects(PermissionRoute, req, res);
    },

    getPermissionRouteById : function(req, res) {
        crudController.getObjectById(PermissionRoute, req, res);  
    },

    getPermissionRouteCurrentUser : function(req, res) {
        var userId = userController.getUserIdFromToken(req);
        if (userId) {
            User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
                if (err) {
                    res.status(404);
                    res.json({ success: false, message: err });
                    return;
                }
                if (!user) {
                    res.status(401);
                    res.json({ success: false, message: 'Invalid token' });
                    return;
                }
                if (!user.profils) {
                    res.status(401);
                    res.json({ success: false, message: 'No profil founds' });
                    return;
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
                        profil.permissions_routage.forEach(function(perm) { 
                            listRoutesId.push(
                                mongoose.Types.ObjectId(perm.routage_id)
                            ); 
                        });    
                    });
                    PermissionRoute.find({'header_db.uid': { $in: listRoutesId}}, function(err, routes){
                        if (err  || !routes) {
                            res.status(401);
                            res.json({ success: false, message: 'No routes founds' });
                            return;
                        }
                        res.status(200);
                        res.json(routes);
                        return;
                    });        
                });
            });
        } else {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }    
    },

    getPermissionRouteByUser : function(req, res) {
        var userId = req.params.uid;
        User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
                return;
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
                    profil.permissions_routage.forEach(function(perm) {
                        listRoutesId.push(
                            mongoose.Types.ObjectId(perm.routage_id)
                        );    
                    });
                }); 
                PermissionRoute.find({'header_db.uid': { $in: listRoutesId}}, function(err, routes){
                    if (err  || !routes) {
                        res.status(401);
                        res.json({ success: false, message: 'No routes founds' });
                        return;
                    }
                    res.status(200);
                    res.json(routes);
                    return;
                }); 
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

