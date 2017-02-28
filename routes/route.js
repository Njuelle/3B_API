var express                   = require('express');
var router                    = express.Router();
// var authentification          = require("./middlewares/authentification");
var routeController            = require('../controllers/routeController');

router.route('').get(routeController.getRoute);
router.route('/me').get(routeController.getRouteCurrentUser);
router.route('/user/:uid').get(routeController.getRouteByUser);
router.route('/:uid').get(routeController.getRouteById);
router.route('').post(routeController.postRoute);
router.route('/:uid').put(routeController.putRoute);
router.route('/:uid').delete(routeController.deleteRoute);

module.exports = router;