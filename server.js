// Get the packages we need
require('events').EventEmitter.defaultMaxListeners = 0
var express               = require('express');
var bodyParser            = require('body-parser');
var entiteNonMembreRoutes = require('./routes/entiteNonMembre.js');
var entiteMembreRoutes    = require('./routes/entiteMembre.js');
var beerRoutes            = require('./routes/beer.js');
var authRoutes            = require('./routes/auth.js');
var routeRoutes            = require('./routes/route.js');
var mongoose              = require('mongoose');
mongoose.connect('mongodb://localhost:27017/3bdb');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Register all our routes with /api and use routes.js
app.use('/api/entite/nonmembre', entiteNonMembreRoutes);
app.use('/api/entite/membre', entiteMembreRoutes);
app.use('/api/beer', beerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/route', routeRoutes);

// Start the server
app.listen(port);
console.log('3B api running on port ' + port);