var Entite           = require('../models/entite');
var User             = require('../models/user');
var mongoose         = require('mongoose');
var crudController   = require('../controllers/crudController');
var userController   = require('../controllers/userController');
var headerController = require('../controllers/headerController');
var mime             = require('mime-types');


module.exports = {
    getBaselog : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
            var jsonArray = new Array();
            jsonArray['nom'] = entite.etat_civil.nom;
            jsonArray['prenom'] = entite.etat_civil.prenom;
            jsonArray['aka'] = entite.infos_asso.aka;
            var jsonObject = Object.assign({}, jsonArray);
            res.status(200);
            res.json(jsonObject);
        });
    },    

    getAvatarCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
            if(entite.common.image) {
                res.sendFile('/uploads/' + entite.common.image);
                return;
            } else {
                res.status(404);
                res.json({ success: false, message: 'No avatar for this Entite' });
                return;   
            }
        });
    },

    getAvatar : function(req, res) {
        Entite.findOne({'header_db.uid' : req.params.uid, 'header_db.statut' : 'current'}, function(err, entite) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            if(entite.common.image) {
                res.sendFile('/uploads/' + entite.common.image);
                return;
            } else {
                res.status(404);
                res.json({ success: false, message: 'No avatar for this Entite' });
                return;   
            }
        });
    },

    putAvatarCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);

        if (!req.files.file) {
            res.status(400);
            res.send('No files were uploaded.');
            return;
        }
        var file = req.files.file;
        var ext = file.name.slice(-4);
        if (ext != '.jpg') {
            if(ext != '.png') {
                if(file.mimetype != mime.lookup('.jpg')){
                    if(file.mimetype != mime.lookup('.png')){
                        res.status(400);
                        res.send('file extension incorrect');
                        return;
                    }
                }
            }
        }
        self.getEntiteFromCurrentUser(req, res, function(entite){
            var mimeExt = mime.extension(file.mimetype);
            var nameId = mongoose.Types.ObjectId();
            var fileName = nameId + '.' + mimeExt;
            file.mv('./uploads/' + fileName, function(err){
                if(err){
                    res.status(500);
                    res.send('Error uploading file');
                    return;
                }
                entite.common.image = fileName;
                crudController.putObjectFileCurrentUser(Entite, 'common.image', fileName, req, res, 'entity_id');
            });      
        });
    },

    putAvatar : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        if (!req.files.file) {
            res.status(400);
            res.send('No files were uploaded.');
            return;
        }
        var file = req.files.file;
        var ext = file.name.slice(-4);
        if (ext != '.jpg') {
            if(ext != '.png') {
                if(file.mimetype != mime.lookup('.jpg')){
                    if(file.mimetype != mime.lookup('.png')){
                        res.status(400);
                        res.send('file extension incorrect');
                        return;
                    }
                }
            }
        }
        Entite.findOne({'header_db.uid' : req.params.uid, 'header_db.statut' : 'current'}, function(err, entite) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            var mimeExt = mime.extension(file.mimetype);
            var nameId = mongoose.Types.ObjectId();
            var fileName = nameId + '.' + mimeExt;
            file.mv('./uploads/' + fileName, function(err){
                if(err){
                    res.status(500);
                    res.send('Error uploading file');
                    return;
                }
                entite.common.image = fileName;
                crudController.putObjectFile(Entite, 'common.image', fileName, req, res);
            });      
        });
        
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObject(Entite, req, res);
    },

    deleteEntite : function(req, res) {
        crudController.deleteObject(Entite, req, res);
    },

    getVoyagePersonnel : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.voyages_personels', req, res);
    },

    putVoyagePersonnel : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.voyages_personels', req, res);
    },

    getFiche : function(req, res) {
        Entite.findOne({'header_db.uid' : req.params.uid, 'header_db.statut' : 'current'}, function(err, entite) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            for (var i = 0; i < entite.infos_asso.fiche_rg.length; i++) {
                if(entite.infos_asso.fiche_rg[i].annee == req.params.year) {
                    res.sendFile('/uploads/' + entite.infos_asso.fiche_rg[i].file);
                    return;
                }
            }
            //here, no year found
            res.status(404);
            res.json({ success: false, message: 'No fiche_rg for this year, for this Entite' });
            return; 

        });
    },

    getFicheCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
            for (var i = 0; i < entite.infos_asso.fiche_rg.length; i++) {
                if(entite.infos_asso.fiche_rg[i].annee == req.params.year) {
                    res.sendFile('/uploads/' + entite.infos_asso.fiche_rg[i].file);
                    return;
                }
            }
            //here, no year found
            res.status(404);
            res.json({ success: false, message: 'No fiche_rg for this year, for this Entite' });
            return; 
        });
    },

    getFiches : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.fiche_rg', req, res);
    },

    getFichesCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
            var value = self.getProperty(entite, 'infos_asso.fiche_rg');
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

    putFiche : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        if (!req.files.file) {
            res.status(400);
            res.send('No files were uploaded.');
            return;
        }
        var file = req.files.file;
        Entite.findOne({'header_db.uid' : req.params.uid, 'header_db.statut' : 'current'}, function(err, entite) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            var mimeExt = mime.extension(file.mimetype);
            var nameId = mongoose.Types.ObjectId();
            var fileName = nameId + '.' + mimeExt;
            file.mv('./uploads/' + fileName, function(err){
                if(err){
                    res.status(500);
                    res.send('Error uploading file');
                    return;
                }
                var fileInfos = Array();
                fileInfos.push({
                    annee: req.params.year,
                    file: fileName
                });
                crudController.putObjectFile(Entite, 'infos_asso.fiche_rg', fileInfos, req, res); 
                
            });      
        });
    },

    putFicheCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        

        if (!req.files.file) {
            res.status(400);
            res.send('No files were uploaded.');
            return;
        }
        var file = req.files.file;
        self.getEntiteFromCurrentUser(req, res, function(entite){
            var mimeExt = mime.extension(file.mimetype);
            var nameId = mongoose.Types.ObjectId();
            var fileName = nameId + '.' + mimeExt;
            file.mv('./uploads/' + fileName, function(err){
                if(err){
                    res.status(500);
                    res.send('Error uploading file');
                    return;
                }
                var fileInfos = Array();
                fileInfos.push({
                    annee: req.params.year,
                    file: fileName
                });
                crudController.putObjectFileCurrentUser(Entite, 'infos_asso.fiche_rg', fileName, req, res, 'entity_id');
            });      
        });
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
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.voyages_personels', req, res, 'entity_id');
    },

    getAutreAsso : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.autre_association', req, res);
    },

    putAutreAsso : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.autre_association', req, res);
    },

    getAutreAssoCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.autre_association', req, res, 'entity_id');
    },

    getCompetences : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.competences', req, res);
    },

    putCompetences : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.competences', req, res);
    },

    getCompetencesCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.competences', req, res, 'entity_id');
    },

    getContact : function(req, res) {
        crudController.getObjectChild(Entite, 'contact', req, res);
    },

    putContact : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'contact', req, res);
    },

    getAdresse : function(req, res) {
        crudController.getObjectChild(Entite, 'adresse', req, res);
    },

    putAdresse : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'adresse', req, res);
    },

    getEtatCivil : function(req, res) {
        crudController.getObjectChild(Entite, 'etat_civil', req, res);
    },

    putEtatCivil : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);

        crudController.putObjectChild(Entite, 'etat_civil', req, res);
    },

    getEtatCivilCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'etat_civil', req, res, 'entity_id');
    },

    getContact : function(req, res) {
        crudController.getObjectChild(Entite, 'contact', req, res);
    },

    putContact : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'contact', req, res);
    },

    getContactCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'contact', req, res, 'contact');
    },

    getRelationAsso : function(req, res) {
        crudController.getObjectChild(Entite, 'relation', req, res);
    },

    putRelationAsso : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'relation', req, res);
    },

    getAdministration : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.administration', req, res);
    },

    putAdministration : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.administration', req, res);
    },

    getAdministrationCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.administration', req, res, 'entity_id');
    },

    getMobilite : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.mobilite', req, res);
    },

    putMobilite : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.mobilite', req, res);
    },

    getMobiliteCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.mobilite', req, res, 'entity_id');
    },

    getSanitaire : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.sanitaire', req, res);
    },

    putSanitaire : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.sanitaire', req, res);
    },

    getSanitaireCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.sanitaire', req, res, 'entity_id');
    },

    getPere : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.pere', req, res);
    },

    putPere : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.parents.pere', req, res);
    },

    getPereCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.parents.pere', req, res, 'entity_id');
    },

    getMere : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.mere', req, res);
    },

    putMere : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.parents.mere', req, res);
    },

    getMereCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.parents.mere', req, res, 'entoty_id');
    },

    getRepLegal : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.parents.responsable_legal_autre', req, res);
    },

    putRepLegal : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.parents.responsable_legal_autre', req, res);
    },

    getRepLegalCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.parents.responsable_legal_autre', req, res, 'entity_id');
    },

    getScolarite : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.scolarite', req, res);
    },

    putScolarite : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.scolarite', req, res);
    },

    getScolariteCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.scolarite', req, res, 'entity_id');
    },

    getLangueVivante : function(req, res) {
        crudController.getObjectChild(Entite, 'infos_asso.langues_vivantes', req, res);
    },

    putLangueVivante : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'infos_asso.langues_vivantes', req, res);
    },

    getLangueVivanteCurrentUser : function(req, res) {
        var self = require('../controllers/entiteController');
        self.getEntiteFromCurrentUser(req, res, function(entite){
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
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChildCurrentUser(Entite, 'infos_asso.langues_vivantes', req, res, 'entity_id');
    },

    getGroupe : function(req, res) {
        crudController.getObjectChild(Entite, 'common.groupe', req, res);
    },

    putGroupe : function(req, res) {
        var self = require('../controllers/entiteController');
        self.checkEntity(req,res);
        
        crudController.putObjectChild(Entite, 'common.groupe', req, res);
    },

    getEntiteFromCurrentUser : function(req, res, callback) {
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
        try {
            var isMembre = true;
            if (req.method == 'POST') {
                if(req.body.common.entity_type != 'membre') {
                    isMembre = false;
                }    
            }
            if(req.body.etat_civil.entreprise) {
                isMembre = false
            }
            if(req.body.relation) {
                isMembre = false
            }
            return isMembre;
        } catch(e) {

        }
        
    },

    checkIsNonMembre : function(req) {
        try {
            var isNonMembre = true;
            if (req.method == 'POST') {
                if(req.body.common.entity_type != 'non-membre') {
                    isNonMembre = false;
                }
            }
            if(req.body.etat_civil.entreprise) {
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
        }catch(e) {

        }
    },

    checkIsMorale : function(req) {
        try{
            var isMorale = true;
            if (req.method == 'POST') {
                if(req.body.common.entity_type != 'morale') {
                    isMorale = false;
                }
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
        } catch(e) {

        }
        
    },

    checkEntity : function(req, res) {
        var self = require('../controllers/entiteController');
        Entite.findOne({ 'header_db.uid': req.params.uid }, 'common.entity_type', function (err, entite) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
                return;
            }
            if(!entite) {
                res.status(404);
                res.json({ success: false, message: 'object not found' });
                return;   
            }
            if(entite.common.entity_type == 'membre' && !self.checkIsMembre(req)) {
                res.status(400);
                res.json({ success: false, message: 'incorrect values' });
                return;       
            }
            if(entite.common.entity_type == 'non-membre' && !self.checkIsNonMembre(req)) {
                res.status(400);
                res.json({ success: false, message: 'incorrect values' });
                return;       
            }
            if(entite.common.entity_type == 'morale' && !self.checkIsMorale(req)) {
                res.status(400);
                res.json({ success: false, message: 'incorrect values' });
                return;       
            }
        });
    }
    
}

