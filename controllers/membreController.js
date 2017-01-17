// Load required packages
var Membre = require('../models/membre');
var authController = require('../controllers/authController');

module.exports = {
    
    postMembre : function(req, res) {
        var membre = new Membre({
            username: req.body.username,
            password: req.body.password
        });
        membre.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new membre added' });
        });
    },

    getMembre : function(req, res) {
        var token = req.headers['x-access-token'];
        var isAuth = authController.isAuth(token);
        
        if (token && isAuth) {
            Membre.find(function(err, membres) {
                if (err){
                    res.send(err);
                }
                res.json(membres);
            });
        } else {
            res.json({ message: 'error' });
        }
       
    }

}

