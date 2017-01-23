// Load required packages
var User             = require('../models/user');
var headerController = require('../controllers/headerController');
var bcrypt           = require('bcrypt-nodejs');

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
                res.send(err);
            }
            res.json({ message: 'new profil added' });
        });
    },

    getUser : function(req, res) {
        User.find(function(err, users) {
            if (err){
                res.send(err);
            }
            res.json(users);
        });
    },

    hashPassword : function(password) {
        return bcrypt.hashSync(password);
    }
}

