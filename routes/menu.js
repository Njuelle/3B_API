var express          = require('express');
var router           = express.Router();
// var authentification = require('../middlewares/authentification');
var menuController   = require('../controllers/menuController');

router.route('').get(menuController.getMenu);
router.route('/user/me').get(menuController.getMenuCurrentUser);
router.route('/user/:uid').get(menuController.getMenuByUser);
router.route('/:uid').get(menuController.getMenuById);
router.route('').post(menuController.postMenu);
router.route('/:uid').put(menuController.putMenu);
router.route('/:uid').delete(menuController.deleteMenu);


module.exports = router;