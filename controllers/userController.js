// Load required packages
var User = require('../models/user');
var authController = require('../controllers/authController');

module.exports = {
    
    postUser : function(req, res) {
        var user = new User({
            username: req.body.username,
            password: req.body.password
        });
        user.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new user added' });
        });
    },

    getUser : function(req, res) {
        var token = req.headers['x-access-token'];
        var isAuth = authController.isAuth(token);
        
        if (token && isAuth) {
            User.find(function(err, users) {
                if (err){
                    res.send(err);
                }
                res.json(users);
            });
        } else {
            res.json({ message: 'error' });
        }
       
    }

}

