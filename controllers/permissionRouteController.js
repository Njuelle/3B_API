// Load required packages
var PermissionRoute = require('../models/permissionRoute');
var authController  = require('../controllers/authController');
var crudController  = require('../controllers/crudController');
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

    putPermissionRoute : function(req, res) {
        crudController.putObject(PermissionRoute, req, res);
    }

    deletePermissionRoute : function(req, res) {
        crudController.deleteObject(PermissionRoute, req, res);
    }
}

