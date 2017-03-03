var express          = require('express');
var router           = express.Router();
// var authentification = require('../middlewares/authentification');
var userController   = require('../controllers/userController');

router.route('').get(userController.getUser);
router.route('/me').get(userController.getUserCurrentUser);
router.route('/me').put(userController.putUserCurrentUser);
router.route('/user/:uid').get(userController.getUserByUser);
router.route('/:uid').get(userController.getUserById);
router.route('').post(userController.postUser);
router.route('/:uid').put(userController.putUser);
router.route('/:uid').delete(userController.deleteUser);
router.route('/:uid/profil').post(userController.postRoute);
router.route('/:uid/profil/:rowId').get(userController.getRoute);
router.route('/:uid/profil/:rowId').delete(userController.deleteRoute);
router.route('/:uid/profil/:rowId').put(userController.putRoute);
router.route('/:uid/menu').post(userController.postMenu);
router.route('/:uid/menu/:rowId').get(userController.getMenu);
router.route('/:uid/menu/:rowId').delete(userController.deleteMenu);
router.route('/:uid/menu/:rowId').put(userController.putMenu);

module.exports = router;