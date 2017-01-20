// Load required packages
var PermissionRoute = require('../models/permissionRoute');
var authController = require('../controllers/authController');
var mongoose       = require('mongoose');

module.exports = {
    postPermissionRoute : function(req, res) {
        PermissionRoute.collection.insert(req.body,function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new permission added' });
        });
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

