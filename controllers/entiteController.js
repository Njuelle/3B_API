var Entite         = require('../models/entite');
var mongoose       = require('mongoose');
var crudController = require('../controllers/crudController');

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
    }    
    
}

