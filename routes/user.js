var express          = require('express');
var router           = express.Router();
var authentification = require('../middlewares/authentification');
var userController   = require('../controllers/userController');

router.use(authentification.authentification);

router.route('').get(userController.getUser);
router.route('/me').put(userController.putUserCurrentUser);
router.route('/me').get(userController.getUserCurrentUser);
router.route('/:uid').get(userController.getUserById);
router.route('').post(userController.postUser);
router.route('/:uid').put(userController.putUser);
router.route('/:uid').delete(userController.deleteUser);
router.route('/me/profil').post(userController.postProfilCurrentUser);
router.route('/me/profil/route').get(userController.getRouteCurrentUser);
router.route('/me/profil/menu').get(userController.getMenuCurrentUser);
router.route('/me/profil/:rowId').get(userController.getProfilCurrentUser);
router.route('/me/profil/:rowId').delete(userController.deleteProfilCurrentUser);
router.route('/me/profil/:rowId').put(userController.putProfilCurrentUser);
router.route('/:uid/profil').post(userController.postProfil);
router.route('/:uid/profil/:rowId').get(userController.getProfil);
router.route('/:uid/profil/:rowId').delete(userController.deleteProfil);
router.route('/:uid/profil/:rowId').put(userController.putProfil);


module.exports = router;