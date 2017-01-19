var express                  = require('express');
var router                   = express.Router();
var authentification         = require("./middlewares/authentification");

var mainController           = require('./controllers/mainController');
var beerController           = require('./controllers/beerController');
var entiteController         = require('./controllers/entiteController');
var profilController         = require('./controllers/profilController');
var accessFonctionController = require('./controllers/accessFonctionController');
var authController           = require('./controllers/authController');

//use middleware
router.use(authentification.authentification);

router.route('/').get(mainController.index);

router.route('/auth').post(authController.authenticate);

// router.route('/entite').get(authentification.authentification, entiteController.getEntite);
router.route('/entite').get(entiteController.getEntite);
router.route('/entite').post(entiteController.postEntite);

router.route('/profil').get(profilController.getProfil);
router.route('/profil').post(profilController.postProfil);

router.route('/access/fonction/all').get(accessFonctionController.getAccessFonction);
router.route('/access/fonction').post(accessFonctionController.postAccessFonction);



module.exports = router;
