// Load required packages
var Profil = require('../models/profil');
var authController = require('../controllers/authController');
var mongoose = require('mongoose');

module.exports = {
    
    postProfil : function(req, res) {
        var uid = mongoose.Types.ObjectId();
        var profil = new Profil({
            header_db: {
                uid       : uid,
                timestamp : new Date().getTime(),
                owner     : req.body.owner,
                app       : req.body.app,
                entity_id : req.body.entity_id,
                statut    : req.body.statut
            },
            name: req.body.name
        });
        profil.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new profil added' });
        });
    },

    getProfil : function(req, res) {
        Profil.find(function(err, profils) {
            if (err){
                res.send(err);
            }
            res.json(profils);
        });
        
    }
}

