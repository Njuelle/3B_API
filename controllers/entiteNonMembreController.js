var EntiteNonMembre = require('../models/entiteNonMembre');
var User            = require('../models/user');
var Beer            = require('../models/beer');
var mongoose        = require('mongoose');
var crudController  = require('../controllers/crudController');
module.exports = {
	post : function(req,res) {
		crudController.postObject(EntiteNonMembre, req, res);
	}
}