// Load required packages
var User             = require('../models/user');
var headerController = require('../controllers/headerController');
var crudController   = require('../controllers/crudController');
var bcrypt           = require('bcrypt-nodejs');
var mongoose         = require('mongoose');

module.exports = {
    
    postUser : function(req, res) {
        var self = require('../controllers/userController');
        //first, hash password
        if (req.body.password){
            req.body.password = self.hashPassword(req.body.password);
        }
        
        // create user from json object with db header        
        var jsonObject = headerController.makeJsonObject(req.body);
        var user = new User(jsonObject);
        user.save(function(err) {
            if (err){
                res.json({ success: false, message: err });
            }
            res.json({ success: true, id: jsonObject.header_db.uid });
        });
    },
    
    getUserById : function(req, res) {
        crudController.getObjectById(User, req, res);
    },

    getUser : function(req, res) {
        User.find(function(err, users) {
            if (err){
                res.send(err);
            }
            res.json(users);
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
    }
}

