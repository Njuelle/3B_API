// Load required packages
var User = require('../models/user');
var authController = require('../controllers/authController');
var bcrypt       = require('bcrypt-nodejs');

module.exports = {
    
    postUser : function(req, res) {
        var controller = require('../controllers/userController');
        //first, hash password
        if (req.body.password){
            req.body.password = controller.hashPassword(req.body.password);
        }
        
        User.collection.insert(req.body,function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new user added' });
        });
    },

    getUser : function(req, res) {
        User.find(function(err, entites) {
            if (err){
                res.send(err);
            }
            res.json(entites);
        });
    },

    hashPassword : function(password) {
        var salt = bcrypt.genSaltSync(5);
        return bcrypt.hashSync(password, salt);
    }

}

