var Profil         = require('../models/profil');
var User           = require('../models/user');
var mongoose       = require('mongoose');
var crudController = require('../controllers/crudController');
var userController = require('../controllers/userController');

module.exports = {
    
    postProfil : function(req, res) {
        crudController.postObject(Profil, req, res);
    },

    getProfil : function(req, res) {
        crudController.getAllObjects(Profil, req, res);
    },

    getProfilCurrentUser : function(req, res) {
        var userId = userController.getUserIdFromToken(req);
        if(userId) {
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
                    if (err){
                        res.status(404);
                        res.json({ success: false, message: err });
                    }
                    res.status(200);
                    res.json(profils);
                    return;
                });
            });    
        } else {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }
        
    },

    getProfilByUser : function(req, res) {
        var userId = req.params.uid;
        User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
            }
            if (!user) {
                res.status(404);
                res.json({ success: false, message: 'User not found' });
            }
            var listProfilId = Array();
            user.profils.forEach(function(profil) { 
                listProfilId.push(
                    mongoose.Types.ObjectId(profil.profil_id)
                );
            });
            Profil.find({'header_db.uid': { $in: listProfilId}}, function(err, profils){
                if (err){
                    res.status(404);
                    res.json({ success: false, message: err });
                }
                res.status(200);
                res.json(profils);
                return;
            });
            
        });
    },

    getProfilById : function(req, res) {
        crudController.getObjectById(Profil, req, res);  
    },

    putProfil : function(req, res) {
        crudController.putObject(Profil, req, res);
    },

    deleteProfil : function(req, res) {
        crudController.deleteObject(Profil, req, res);
    },

    postRoute : function(req,res) {
        crudController.postObjectChild(Profil, 'permissions_routage', req, res);
    },

    getRoute : function(req,res) {
        crudController.getObjectChildRow(Profil, 'permissions_routage', req, res);
    },

    deleteRoute : function(req,res) {
        crudController.deleteObjectChildRow(Profil, 'permissions_routage', req, res);
    },

    putRoute : function(req,res) {
        crudController.putObjectChildRow(Profil, 'permissions_routage', req, res);
    },

    postMenu : function(req,res) {
        crudController.postObjectChild(Profil, 'permissions_menu', req, res);
    },

    getMenu : function(req,res) {
        crudController.getObjectChildRow(Profil, 'permissions_menu', req, res);
    },

    deleteMenu : function(req,res) {
        crudController.deleteObjectChildRow(Profil, 'permissions_menu', req, res);
    },

    putMenu : function(req,res) {
        crudController.putObjectChildRow(Profil, 'permissions_menu', req, res);
    }
}

