var express          = require('express');
var router           = express.Router();
// var authentification = require('../middlewares/authentification');
var authController   = require('../controllers/authController');

router.route('').post(authController.getToken);

module.exports = router;