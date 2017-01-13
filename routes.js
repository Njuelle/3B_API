var express = require('express');
var router = express.Router();

var mainController = require('./controllers/mainController');
var beerController = require('./controllers/beerController');

router.route('/').get(mainController.index);

router.route('/beer/:beer_id').get(beerController.getBeerById);
router.route('/beer').get(beerController.getBeers);
router.route('/beer').post(beerController.postBeer);

module.exports = router;
