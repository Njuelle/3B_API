var Profil         = require('../models/profil');
var mongoose       = require('mongoose');
var crudController = require('../controllers/crudController');

module.exports = {
    
    postProfil : function(req, res) {
        crudController.postObject(Profil, req, res);
    },

    getProfil : function(req, res) {
        crudController.getAllObjects(Profil, req, res);
    },

    getProfilById : function(req, res) {
        crudController.getObjectById(Profil, req, res);  
    },

    putProfil : function(req, res) {
        crudController.putObject(Profil, req, res);
    }
}

