var express                   = require('express');
var router                    = express.Router();
// var authentification          = require("./middlewares/authentification");
// var entiteNonMembreController            = require('./controllers/entiteNonMembreController');
var mainController            = require('../controllers/mainController');
router.route('/entite/poil').get(mainController.index);
module.exports = router;