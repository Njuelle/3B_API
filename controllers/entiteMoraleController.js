var EntiteMorale   = require('../models/entiteMorale');
var User           = require('../models/user');
var Beer           = require('../models/beer');
var mongoose       = require('mongoose');
var crudController = require('../controllers/crudController');

module.exports = {
	post : function(req,res) {
		crudController.postObject(EntiteMembre, req, res);
	}
}