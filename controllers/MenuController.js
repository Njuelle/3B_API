var Menu         = require('../models/menu');
var mongoose       = require('mongoose');
var crudController = require('../controllers/crudController');

module.exports = {
    
    postMenu : function(req, res) {
        crudController.postObject(Menu, req, res);
    },

    getMenu : function(req, res) {
        crudController.getAllObjects(Menu, req, res);
    },

    getMenuById : function(req, res) {
        crudController.getObjectById(Menu, req, res);  
    },

    putMenu : function(req, res) {
        crudController.putObject(Menu, req, res);
    }

    deleteMenu : function(req, res) {
        crudController.deleteObject(Menu, req, res);
    }
}

