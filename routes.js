var express                  = require('express');
var router                   = express.Router();
var authentification         = require("./middlewares/authentification");

var mainController           = require('./controllers/mainController');
var beerController           = require('./controllers/beerController');
var userController         = require('./controllers/userController');
var profilController         = require('./controllers/profilController');
var permissionRouteController = require('./controllers/permissionRouteController');
var authController           = require('./controllers/authController');

//use middleware
router.use(authentification.authentification);

router.route('/').get(mainController.index);

router.route('/auth').post(authController.getToken);

// router.route('/entite').get(authentification.authentification, userController.getEntite);
router.route('/user').get(userController.getUser);
router.route('/user').post(userController.postUser);

router.route('/profil').get(profilController.getProfil);
router.route('/profil').post(profilController.postProfil);

router.route('/permissionRoute').get(permissionRouteController.getPermissionRoute);
router.route('/permissionRoute').post(permissionRouteController.postPermissionRoute);



module.exports = router;
