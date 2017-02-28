 // Load required packages
var Route          = require('../models/route');
var User           = require('../models/user');
var Profil         = require('../models/profil');
var crudController = require('../controllers/crudController');
var userController = require('../controllers/userController');
var mongoose       = require('mongoose');

module.exports = {
    
    postRoute : function(req, res) {
        Route.findOne({
                'route'  : req.body.route, 
                'method' : req.body.method
            },
            function(err, perm) {
                if (err) {
                    res.status(404);
                    res.json({ success: false, message: err });
                    return;
                }
                if(perm) {
                    res.status(400);
                    res.json({ success: false, message: 'duplicate route or method' });
                    return;
                }
                crudController.postObject(Route, req, res);
            }
        );        
    },

    getRoute : function(req, res) {
        crudController.getAllObjects(Route, req, res);
    },

    getRouteById : function(req, res) {
        crudController.getObjectById(Route, req, res);  
    },

    getRouteCurrentUser : function(req, res) {
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
                    Route.find({'header_db.uid': { $in: listRoutesId}}, function(err, routes){
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

    getRouteByUser : function(req, res) {
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
                Route.find({'header_db.uid': { $in: listRoutesId}}, function(err, routes){
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

    putRoute : function(req, res) {
        crudController.putObject(Route, req, res);
    },

    deleteRoute : function(req, res) {
        crudController.deleteObject(Route, req, res);
    }
}

