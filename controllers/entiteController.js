var Entite           = require('../models/entite');
var User             = require('../models/user');
var mongoose         = require('mongoose');
var crudController   = require('../controllers/crudController');
var userController   = require('../controllers/userController');
var headerController = require('../controllers/headerController');


module.exports = {
    
    postEntite : function(req, res) {
        crudController.postObject(Entite, req, res);
    },

    postAvatar : function(req, res) {
        console.log(req.files);
    },

    postMembre : function(req, res) {
        var self = require('../controllers/entiteController');
        if (self.checkIsMembre(req)){
            crudController.postObject(Entite, req, res);    
        } else {
            res.status(400);
            res.json({ success: false, message: 'Entite is not Membre' });
        }
    },

    postNonMembre : function(req, res) {
        var self = require('../controllers/entiteController');
        if (self.checkIsNonMembre(req)){
            crudController.postObject(Entite, req, res);    
        } else {
            res.status(400);
            res.json({ success: false, message: 'Entite is not Non-Membre' });
        }
    },

    postPersonneMorale : function(req, res) {
        var self = require('../controllers/entiteController');
        if (self.checkIsMorale(req)){
            crudController.postObject(Entite, req, res);    
        } else {
            res.status(400);
            res.json({ success: false, message: 'Entite is not Personne-Morale' });
        }
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

    getMembres : function(req, res) {
        Entite.find({'header_db.statut' : 'current', 'common.entity_type' : 'membre'}, function(err, objects) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
            }
            res.status(200);
            res.json(objects);
        });
    },

    getOthers : function(req, res) {
        Entite.find({'header_db.statut' : 'current', 'common.entity_type': {'$ne':'membre' }}, function(err, objects) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
            }
            res.status(200);
            res.json(objects);
        });
    },

    getContactUrgence : function(req, res) {
        var uid = req.params.uid;
        Entite.find({'header_db.statut' : 'current', 'header_db.uid' : uid}, function(err, entite) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
            }

            var contactId = entite.sanitaire.contact_urgence;
            Entite.find({'header_db.statut' : 'current', 'header_db.uid' : contactId}, function(err, contact) {
                var jsonArray        = new Array();
                jsonArray['nom']     = contact.etat_civil.nom;
                jsonArray['prenom']  = contact.etat_civil.prenom;
                jsonArray['contact'] = contact.contact;
                var jsonObject = Object.assign({}, jsonArray);
                res.status(200);
                res.json(jsonObject);
                return;
            });
        });
    },

    getVoyagePersonnelCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.voyages_personels');
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

    putVoyagePersonnelCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.voyages_personels', req, res, 'entity_id');
    },

    getAutreAsso : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.autre_association', req, res);
    },

    putAutreAsso : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.autre_association', req, res);
    },

    getAutreAssoCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.autre_association');
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

    putAutreAssoCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.autre_association', req, res, 'entity_id');
    },

    getCompetences : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.competences', req, res);
    },

    putCompetences : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.competences', req, res);
    },

    getCompetencesCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.competences');
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

    putCompetencesCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.competences', req, res, 'entity_id');
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
        crudController.putObjectChildCurrentUser(Entite, 'etat_civil', req, res, 'entity_id');
    },

    getContact : function(req, res) {
        crudController.getObjectChild(Entite, 'contact', req, res);
    },

    putContact : function(req, res) {
        crudController.putObjectChild(Entite, 'contact', req, res);
    },

    getContactCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'contact');
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

    putContactCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'contact', req, res, 'contact');
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

    getAdministrationCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.administration');
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

    putAdministrationCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.administration', req, res, 'entity_id');
    },

    getMobilite : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.mobilite', req, res);
    },

    putMobilite : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.mobilite', req, res);
    },

    getMobiliteCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.mobilite');
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

    putMobiliteCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.mobilite', req, res, 'entity_id');
    },

    getSanitaire : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.sanitaire', req, res);
    },

    putSanitaire : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.sanitaire', req, res);
    },

    getSanitaireCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.sanitaire');
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

    putSanitaireCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.sanitaire', req, res, 'entity_id');
    },

    getPere : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.pere', req, res);
    },

    putPere : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.parents.pere', req, res);
    },

    getPereCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.parents.pere');
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

    putPereCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.parents.pere', req, res, 'entity_id');
    },

    getMere : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.mere', req, res);
    },

    putMere : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.parents.mere', req, res);
    },

    getMereCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.parents.mere');
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

    putMereCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.parents.mere', req, res, 'entoty_id');
    },

    getRepLegal : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.responsable_legal_autre', req, res);
    },

    putRepLegal : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.parents.responsable_legal_autre', req, res);
    },

    getRepLegalCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.parents.responsable_legal_autre');
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

    putRepLegalCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.parents.responsable_legal_autre', req, res, 'entity_id');
    },

    getScolarite : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.scolarite', req, res);
    },

    putScolarite : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.scolarite', req, res);
    },

    getScolariteCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.scolarite');
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

    putScolariteCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.scolarite', req, res, 'entity_id');
    },

    getLangueVivante : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.langues_vivantes', req, res);
    },

    putLangueVivante : function(req, res) {
        crudController.putObjectChild(Entite, 'infos_asso.langues_vivantes', req, res);
    },

    getLangueVivanteCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, function(entite){
            var value = self.getProperty(entite, 'infos_asso.langues_vivantes');
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

    putLangueVivanteCurrentUser : function(req, res) {
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.langues_vivantes', req, res, 'entity_id');
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
    },

    checkIsMembre : function(req) {
        var isMembre = true;
        if(req.body.common.entity_type != 'membre') {
            isMembre = false;
        }
        if(req.body.etat_civil.raison_sociale) {
            isMembre = false
        }
        if(req.body.relation) {
            isMembre = false
        }
        return isMembre;
    },

    checkIsNonMembre : function(req) {
        var isNonMembre = true;
        if(req.body.common.entity_type != 'non-membre') {
            isNonMembre = false;
        }
        if(req.body.etat_civil.raison_sociale) {
            isNonMembre = false;
        }
        if(req.body.relation.activite) {
            isNonMembre = false;
        }
        if(req.body.relation.representant_id) {
            isNonMembre = false;
        }
        if(req.body.infos_asso) {
            isNonMembre = false;
        }
        return isNonMembre;
    },

    checkIsMorale : function(req) {
        var isMorale = true;
        if(req.body.common.entity_type != 'morale') {
            isMorale = false;
        }
        if(req.body.etat_civil.titre) {
            isMorale = false;
        }
        if(req.body.etat_civil.nom) {
            isMorale = false;
        }
        if(req.body.etat_civil.prenom) {
            isMorale = false;
        }
        if(req.body.etat_civil.sexe) {
            isMorale = false;
        }
        if(req.body.etat_civil.date_naissance) {
            isMorale = false;
        }
        if(req.body.etat_civil.lieu_naissance) {
            isMorale = false;
        }
        if(req.body.etat_civil.dpt_naissance) {
            isMorale = false;
        }
        if(req.body.etat_civil.statut_marital) {
            isMorale = false;
        }
        if(req.body.infos_asso) {
            isMorale = false;
        }
        return isMorale;
    }
    
}

