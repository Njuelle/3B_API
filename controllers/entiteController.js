var Entite         = require('../models/entite');
var User           = require('../models/user');
var mongoose       = require('mongoose');
var crudController = require('../controllers/crudController');
var userController = require('../controllers/userController');


module.exports = {
    
    postEntite : function(req, res) {
        crudController.postObject(Entite, req, res);
    },

    getEntite : function(req, res) {
        crudController.getAllObjects(Entite, req, res);
    },

    getEntiteById : function(req, res) {
        crudController.getObjectById(Entite, req, res);  
    },

    putEntite : function(req, res) {
        crudController.putObject(Entite, req, res);
    },

    deleteEntite : function(req, res) {
        crudController.deleteObject(Entite, req, res);
    },

    getVoyagePersonnel : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.voyages_personels', req, res);
    },

    putVoyagePersonnel : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.voyages_personels', req, res);
    },

    getAutreAsso : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.autre_association', req, res);
    },

    putAutreAsso : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.autre_association', req, res);
    },

    getCompetences : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.competences', req, res);
    },

    putCompetences : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.competences', req, res);
    },

    getContact : function(req, res) {
        crudController.getObjectChild(Entite, 'contact', req, res);
    },

    putContact : function(req, res) {
        crudController.putObjectChild(Entite, 'contact', req, res);
    },

    getAdresse : function(req, res) {
        crudController.getObjectChild(Entite, 'adresse', req, res);
    },

    putAdresse : function(req, res) {
        crudController.putObjectChild(Entite, 'adresse', req, res);
    },

    getEtatCivil : function(req, res) {
        crudController.getObjectChild(Entite, 'etat_civil', req, res);
    },

    putEtatCivil : function(req, res) {
        crudController.putObjectChild(Entite, 'etat_civil', req, res);
    },

    getEtatCivilCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'etat_civil');
            if (value) {
                res.status(200);
                res.json(value);
                return;
            } else {
                res.status(404);
                res.json({ success: false, message: 'Value not found' });
                return;
            }
        });
    },

    putEtatCivilCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'etat_civil');
            if (value) {
                res.status(200);
                res.json(value);
                return;
            } else {
                res.status(404);
                res.json({ success: false, message: 'Value not found' });
                return;
            }
        });
    },

    getContact : function(req, res) {
        crudController.getObjectChild(Entite, 'contact', req, res);
    },

    putContact : function(req, res) {
        crudController.putObjectChild(Entite, 'contact', req, res);
    },

    getRelationAsso : function(req, res) {
        crudController.getObjectChild(Entite, 'relation', req, res);
    },

    putRelationAsso : function(req, res) {
        crudController.putObjectChild(Entite, 'relation', req, res);
    },

    getAdministration : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.administration', req, res);
    },

    putAdministration : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.administration', req, res);
    },

    getMobilite : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.mobilite', req, res);
    },

    putMobilite : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.mobilite', req, res);
    },

    getSanitaire : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.sanitaire', req, res);
    },

    putSanitaire : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.sanitaire', req, res);
    },

    getPere : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.pere', req, res);
    },

    putPere : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.parents.pere', req, res);
    },

    getMere : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.mere', req, res);
    },

    putMere : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.parents.mere', req, res);
    },

    getRepLegal : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.responsable_legal_autre', req, res);
    },

    putRepLegal : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.parents.responsable_legal_autre', req, res);
    },

    getScolarite : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.scolarite', req, res);
    },

    putScolarite : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.scolarite', req, res);
    },

    getLangueVivante : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.langues_vivantes', req, res);
    },

    putLangueVivante : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.langues_vivantes', req, res);
    },

    getGroupe : function(req, res) {
        crudController.getObjectChild(Entite, 'common.groupe', req, res);
    },

    putGroupe : function(req, res) {
        crudController.putObjectChild(Entite, 'common.groupe', req, res);
    },

    getEntiteFromCurrentUser : function(req, callback) {
        var userId = userController.getUserIdFromToken(req);
        if (userId) {
            User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
                if (err){
                    res.status(404);
                    res.json({ success: false, message: err });
                    return;
                }
                if (!user) {
                    res.status(400);
                    res.json({ success: false, message: 'Invalid token' });
                    return;        
                }
                Entite.findOne({'header_db.uid' : user.entity_id, 'header_db.statut' : 'current'}, function(err, entite) {
                    if (err){
                        res.status(404);
                        res.json({ success: false, message: err });
                        return;
                    }
                    if (!entite) {
                        res.status(400);
                        res.json({ success: false, message: 'No Entite found for this user' });
                        return;
                    }
                    callback(entite);
                    return;
                }); 
            });    
        } else {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }
    },

    getProperty : function(object, path) {
        var props = path.split(".");
        var obj = object;
        for (var i = 0; i < props.length; i++) {
            obj = obj[props[i]];
        }
        return obj;
    } 
    
}

