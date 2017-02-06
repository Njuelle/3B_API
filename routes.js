var express                   = require('express');
var router                    = express.Router();
var authentification          = require("./middlewares/authentification");

var mainController            = require('./controllers/mainController');
var beerController            = require('./controllers/beerController');
var userController            = require('./controllers/userController');
var profilController          = require('./controllers/profilController');
var permissionRouteController = require('./controllers/permissionRouteController');
var menuController            = require('./controllers/menuController');
var userController            = require('./controllers/userController');
var entiteController          = require('./controllers/entiteController');
var authController            = require('./controllers/authController');
var testController            = require('./controllers/testController');

//use middleware
// router.use(authentification.authentification);

router.route('/').get(mainController.index);

router.route('/auth').post(authController.getToken);

// router.route('/entite').get(authentification.authentification, userController.getEntite);
router.route('/user/current').get(userController.getCurrentUser);
router.route('/user/:uid').get(userController.getUserById);
router.route('/user').get(userController.getUser);
router.route('/user').post(userController.postUser);
router.route('/user/:uid').put(userController.putUser);
router.route('/user/:uid').delete(userController.deleteUser);

router.route('/profil').get(profilController.getProfil);
router.route('/profil/user').get(profilController.getProfilCurrentUser);
router.route('/profil/:uid').get(profilController.getProfilById);
router.route('/profil/user/:uid').get(profilController.getProfilByUser);
router.route('/profil').post(profilController.postProfil);
router.route('/profil/:uid').put(profilController.putProfil);
router.route('/profil/:uid').delete(profilController.deleteProfil);

router.route('/route').get(permissionRouteController.getPermissionRoute);
router.route('/route/user').get(permissionRouteController.getPermissionRouteCurrentUser);
router.route('/route/user/:uid').get(permissionRouteController.getPermissionRouteByUser);
router.route('/route/:uid').get(permissionRouteController.getPermissionRouteById);
router.route('/route').post(permissionRouteController.postPermissionRoute);
router.route('/route/:uid').put(permissionRouteController.putPermissionRoute);
router.route('/route/:uid').delete(permissionRouteController.deletePermissionRoute);

router.route('/menu').get(menuController.getMenu);
router.route('/menu/user').get(menuController.getMenuCurrentUser);
router.route('/menu/user/:uid').get(menuController.getMenuByUser);
router.route('/menu/:uid').get(menuController.getMenuById);
router.route('/menu').post(menuController.postMenu);
router.route('/menu/:uid').put(menuController.putMenu);
router.route('/menu/:uid').delete(menuController.deleteMenu);


router.route('/entite/voyageperso/:uid').get(entiteController.getVoyagePersonnel);
router.route('/entite/voyageperso/:uid').put(entiteController.putVoyagePersonnel);
router.route('/entite/autreasso/:uid').get(entiteController.getAutreAsso);
router.route('/entite/autreasso/:uid').put(entiteController.putAutreAsso);
router.route('/entite/competences/:uid').get(entiteController.getCompetences);
router.route('/entite/competences/:uid').put(entiteController.putCompetences);
router.route('/entite/adresse/:uid').get(entiteController.getAdresse);
router.route('/entite/adresse/:uid').put(entiteController.putAdresse);
router.route('/entite/etatcivil/:uid').get(entiteController.getEtatCivil);
router.route('/entite/etatcivil/:uid').put(entiteController.putEtatCivil);
router.route('/entite/contact/:uid').get(entiteController.getContact);
router.route('/entite/contact/:uid').put(entiteController.putContact);
router.route('/entite/relationasso/:uid').get(entiteController.getRelationAsso);
router.route('/entite/relationasso/:uid').put(entiteController.putRelationAsso);
router.route('/entite/administration/:uid').get(entiteController.getAdministration);
router.route('/entite/administration/:uid').put(entiteController.putAdministration);
router.route('/entite/mobilite/:uid').get(entiteController.getMobilite);
router.route('/entite/mobilite/:uid').put(entiteController.putMobilite);
router.route('/entite/sanitaire/:uid').get(entiteController.getSanitaire);
router.route('/entite/sanitaire/:uid').put(entiteController.putSanitaire);
router.route('/entite/pere/:uid').get(entiteController.getPere);
router.route('/entite/pere/:uid').put(entiteController.putPere);
router.route('/entite/mere/:uid').get(entiteController.getMere);
router.route('/entite/mere/:uid').put(entiteController.putMere);
router.route('/entite/replegal/:uid').get(entiteController.getRepLegal);
router.route('/entite/replegal/:uid').put(entiteController.putRepLegal);
router.route('/entite/scolarite/:uid').get(entiteController.getScolarite);
router.route('/entite/scolarite/:uid').put(entiteController.putScolarite);
router.route('/entite/lv/:uid').get(entiteController.getLangueVivante);
router.route('/entite/lv/:uid').put(entiteController.putLangueVivante);
router.route('/entite/groupe/:uid').get(entiteController.getGroupe);
router.route('/entite/groupe/:uid').put(entiteController.putGroupe);
router.route('/entite').get(entiteController.getEntite);
router.route('/entite/:uid').get(entiteController.getEntiteById);
router.route('/entite').post(entiteController.postEntite);
router.route('/entite/:uid').put(entiteController.putEntite);
router.route('/entite/:uid').delete(entiteController.deleteEntite);

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
