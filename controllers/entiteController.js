// Load required packages
var Entite = require('../models/entite');
var authController = require('../controllers/authController');

module.exports = {
    
    postEntite : function(req, res) {
        var entite = new Entite({
            username  : req.body.username,
            password  : req.body.password,
            profil_id : req.body.profil_id
        });
        entite.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new entite added' });
        });
    },

    getEntite : function(req, res) {
        authController.isAuth(res, req, function(res){
            Entite.find(function(err, entites) {
                if (err){
                    res.send(err);
                }
                res.json(entites);
            });
        });
    }

}

