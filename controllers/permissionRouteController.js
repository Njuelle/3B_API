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
        PermissionRoute.find(function(err, accessFonctions) {
            if (err){
                res.send(err);
            }
            res.json(accessFonctions);
        });
    }

}

