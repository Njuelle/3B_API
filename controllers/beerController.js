var Beer            = require('../models/beer');
var mongoose        = require('mongoose');
var crudController  = require('../controllers/crudController');
module.exports = {
	post : function(req,res) {
		crudController.postObject(Beer, req, res);
	},

	postTest : function(req,res) {
		crudController.postObjectChild(Beer, 'test', req, res);
	},

	getTest : function(req,res) {
		crudController.getObjectChildRow(Beer, 'test', req, res);
	},

	deleteTest : function(req,res) {
		crudController.deleteObjectChildRow(Beer, 'test', req, res);
	},

	putTest : function(req,res) {
		crudController.putObjectChildRow(Beer, 'test', req, res);
	}

}