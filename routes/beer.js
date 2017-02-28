var express                   = require('express');
var router                    = express.Router();
// var authentification          = require("./middlewares/authentification");
// var entiteNonMembreController            = require('./controllers/entiteNonMembreController');
var beerController            = require('../controllers/beerController');

router.route('').post(beerController.post);
router.route('/:uid/test').post(beerController.postTest);
router.route('/:uid/test/:rowId').get(beerController.getTest);
router.route('/:uid/test/:rowId').delete(beerController.deleteTest);
router.route('/:uid/test/:rowId').put(beerController.putTest);

module.exports = router;