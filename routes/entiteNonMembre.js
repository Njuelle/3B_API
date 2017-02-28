var express                   = require('express');
var router                    = express.Router();
var EntiteNonMembre           = require('../models/entiteNonMembre');
// var authentification       = require("./middlewares/authentification");
var entiteNonMembreController = require('../controllers/entiteNonMembreController');

router.route('').post(entiteNonMembreController.post);
module.exports = router;