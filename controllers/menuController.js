var Menu           = require('../models/menu');
var User           = require('../models/user');
var Profil         = require('../models/profil');
var mongoose       = require('mongoose');

var crudController = require('../controllers/crudController');
var userController = require('../controllers/userController');
var self           = require('../controllers/menuController');

module.exports = {
    
    postMenu : function(req, res) {
        crudController.postObject(Menu, req, res);
    },

    getMenu : function(req, res) {
        crudController.getAllObjects(Menu, req, res);
    },

    getMenuCurrentUser : function(req, res) {
        var userId = userController.getUserIdFromToken(req);
        if (userId) {
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
                    var listMenuId = Array();
                    profils.forEach(function(profil){
                        profil.permissions_menu.forEach(function(perm) { 
                            listMenuId.push(
                                mongoose.Types.ObjectId(perm.menu_id)
                            );
                        });    
                    });
                    Menu.find({'header_db.uid': { $in: listMenuId}}, function(err, menus){
                        if (err  || !menus) {
                            res.status(401);
                            res.json({ success: false, message: 'No menus founds' });
                            return;
                        }
                        res.status(200);
                        res.json(menus);
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

    getMenuByUser : function(req, res) {
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
                var listMenuId = Array();
                profils.forEach(function(profil){
                    profil.permissions_menu.forEach(function(perm) { 
                        listMenuId.push(
                            mongoose.Types.ObjectId(perm.menu_id)
                        );
                    });    
                });
                Menu.find({'header_db.uid': { $in: listMenuId}}, function(err, menus){
                    if (err  || !menus) {
                        res.status(401);
                        res.json({ success: false, message: 'No menus founds' });
                        return;
                    }
                    res.status(200);
                    res.json(menus);
                    return;
                });
            });
        });
    },

    getMenuById : function(req, res) {
        crudController.getObjectById(Menu, req, res);
    },

    putMenu : function(req, res) {
        crudController.putObject(Menu, req, res);
    },

    deleteMenu : function(req, res) {
        crudController.deleteObject(Menu, req, res);
    }


}

