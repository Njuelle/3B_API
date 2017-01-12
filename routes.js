var express = require('express');
var router = express.Router();

var mainController = require('./controllers/mainController');


router.route('/').get(mainController.index);
module.exports = router;
