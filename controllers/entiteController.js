// Load required packages
var Entite = require('../models/entite');
var authController = require('../controllers/authController');

module.exports = {
    
    postEntite : function(req, res) {
        var entite = new Entite({
            username: req.body.username,
            password: req.body.password
        });
        entite.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new entite added' });
        });
    },

    getEntite : function(req, res) {
        var token = req.headers['x-access-token'];
        var isAuth = authController.isAuth(token);
        
        if (token && isAuth) {
            Entite.find(function(err, entites) {
                if (err){
                    res.send(err);
                }
                res.json(entites);
            });
        } else {
            res.json({ message: 'error' });
        }
       
    }

}

