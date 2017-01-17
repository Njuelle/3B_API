var express = require('express');
var router = express.Router();

var mainController = require('./controllers/mainController');
var beerController = require('./controllers/beerController');
var membreController = require('./controllers/membreController');
var authController = require('./controllers/authController');

router.route('/').get(mainController.index);

router.route('/auth').post(authController.authenticate);

// router.route('/beer/:beer_id').get(authController.isAuthenticated, beerController.getBeerById);
// router.route('/beers').get(authController.isAuthenticated, beerController.getBeers);
// router.route('/beer').post(authController.isAuthenticated, beerController.postBeer);
// router.route('/beer/:beer_id').put(authController.isAuthenticated, beerController.putBeerQuantity);
// router.route('/beer/:beer_id').delete(authController.isAuthenticated, beerController.deleteBeer);

router.route('/membre').get(membreController.getMembre);
router.route('/membre').post(membreController.postMembre);



module.exports = router;
