var Entite         = require('../models/entite');
var mongoose       = require('mongoose');
var crudController = require('../controllers/crudController');

module.exports = {
    
    postEntite : function(req, res) {
        crudController.postObject(Entite, req, res);
    },

    getEntite : function(req, res) {
        crudController.getAllObjects(Entite, req, res);
    },

    getEntiteById : function(req, res) {
        crudController.getObjectById(Entite, req, res);  
    },

    putEntite : function(req, res) {
        crudController.putObject(Entite, req, res);
    },

    deleteEntite : function(req, res) {
        crudController.deleteObject(Entite, req, res);
    },

    getVoyagePersonnel : function(req, res) {
        crudController.getObjectSubDoc(Entite, 'voyages_personels', req, res);
    },

    putVoyagePersonnel : function(req, res) {
        crudController.getObjectSubDoc(Entite, 'voyages_personels', req, res);
    },
}

