// Load required packages
var AccessFonction = require('../models/accessFonction');
var authController = require('../controllers/authController');
var mongoose       = require('mongoose');

module.exports = {
    postAccessFonction : function(req, res) {
        var uid = mongoose.Types.ObjectId();
        var accessFonction = new AccessFonction({
            header_db: {
                owner     : req.body.owner,
                app       : req.body.app,
                entity_id : req.body.entity_id,
                statut    : req.body.statut
            },
            profil_id         : req.body.profil_id,
            method_name       : req.body.method_name,
            read_permission   : req.body.read_permission,
            create_permission : req.body.create_permission,
            edit_permission   : req.body.edit_permission,
            delete_permission : req.body.delete_permission
        });
        accessFonction.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'new accessFonction added' });
        });
    },

    getAccessFonction : function(req, res) {
        AccessFonction.find(function(err, accessFonctions) {
            if (err){
                res.send(err);
            }
            res.json(accessFonctions);
        });
    }

}

