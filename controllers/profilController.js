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
            res.status(200);
            res.json(listProfilId);
            return;
        });
    },

    getProfilByUser : function(req, res) {
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
            res.status(200);
            res.json(listProfilId);
            return;
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
    }
}

