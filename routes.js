var express                   = require('express');
var router                    = express.Router();
var authentification          = require("./middlewares/authentification");

var mainController            = require('./controllers/mainController');
var beerController            = require('./controllers/beerController');
var userController            = require('./controllers/userController');
var profilController          = require('./controllers/profilController');
var permissionRouteController = require('./controllers/permissionRouteController');
var menuController            = require('./controllers/menuController');
var entiteController            = require('./controllers/entiteController');
var authController            = require('./controllers/authController');
var testController            = require('./controllers/testController');

//use middleware
// router.use(authentification.authentification);

router.route('/').get(mainController.index);

router.route('/auth').post(authController.getToken);

// router.route('/entite').get(authentification.authentification, userController.getEntite);
router.route('/user/:uid').get(userController.getUserById);
router.route('/user').get(userController.getUser);
router.route('/user').post(userController.postUser);
router.route('/user/:uid').put(userController.putUser);
router.route('/user/:uid').delete(userController.deleteUser);

router.route('/profil').get(profilController.getProfil);
router.route('/profil/:uid').get(profilController.getProfilById);
router.route('/profil').post(profilController.postProfil);
router.route('/profil/:uid').put(profilController.putProfil);
router.route('/profil/:uid').delete(profilController.deleteProfil);

router.route('/permissionRoute').get(permissionRouteController.getPermissionRoute);
router.route('/permissionRoute/:uid').get(permissionRouteController.getPermissionRouteById);
router.route('/permissionRoute').post(permissionRouteController.postPermissionRoute);
router.route('/permissionRoute/:uid').put(permissionRouteController.putPermissionRoute);
router.route('/permissionRoute/:uid').delete(permissionRouteController.deletePermissionRoute);

router.route('/menu').get(menuController.getMenu);
router.route('/menu/:uid').get(menuController.getMenuById);
router.route('/menu').post(menuController.postMenu);
router.route('/menu/:uid').put(menuController.putMenu);
router.route('/menu/:uid').delete(menuController.deleteMenu);

router.route('/entite').get(entiteController.getEntite);
router.route('/entite/:uid').get(entiteController.getEntiteById);
router.route('/entite').post(entiteController.postEntite);
router.route('/entite/:uid').put(entiteController.putEntite);
router.route('/entite/:uid').delete(entiteController.deleteEntite);
router.route('/entite/:uid').get(entiteController.getVoyagePersonel);
router.route('/entite/:uid').put(entiteController.getVoyagePersonel);


///	TEST ROUTES ///
router.route('/test').get(testController.getTest);
router.route('/test').post(testController.postTest);
router.route('/test').put(testController.putTest);
router.route('/test').delete(testController.deleteTest);

router.route('/test2').get(testController.getTest2);
router.route('/test2').post(testController.postTest2);
router.route('/test2').put(testController.putTest2);
router.route('/test2').delete(testController.deleteTest2);



module.exports = router;
