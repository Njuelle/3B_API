// Load required packages
var User             = require('../models/user');
var headerController = require('../controllers/headerController');
var crudController   = require('../controllers/crudController');
var bcrypt           = require('bcrypt-nodejs');
var mongoose         = require('mongoose');
var jwt              = require('jsonwebtoken');

module.exports = {
    
    postUser : function(req, res) {
        var self = require('../controllers/userController');
        //first, hash password
        if (req.body.password){
            req.body.password = self.hashPassword(req.body.password);
        }
        // create user from json object with db header        
        var jsonObject = headerController.makeJsonObject(req);
        if(jsonObject.success == false) {
            res.status(400);
            res.json({ success: false, message: jsonObject.message });
            return;
        }
        var user = new User(jsonObject);
        user.save(function(err) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
            }
            res.status(201);
            res.json({ success: true, id: jsonObject.header_db.uid });
        });
    },
    
    getUserById : function(req, res) {
        crudController.getObjectById(User, req, res);
    },

    getUser : function(req, res) {
        crudController.getAllObjects(User, req, res);
    },

    getCurrentUser : function(req, res) {
        var self = require('../controllers/userController');
        var userId = self.getUserIdFromToken(req);
        User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
            }
            user.password = undefined;
            res.status(200);
            res.json(user);
        });
    },

    putUser : function(req, res) {
        crudController.putObject(User, req, res);
    },

    deleteUser : function(req, res) {
        crudController.deleteObject(User, req, res);
    },

    hashPassword : function(password) {
        return bcrypt.hashSync(password);
    },

    getUserIdFromToken : function(req) {
        var verifiedToken = jwt.verify(req.headers['x-access-token'], 'secret');
        return verifiedToken._doc.header_db.uid;
    }
}

