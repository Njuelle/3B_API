// Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var passport = require('passport');

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
app.use('/api', routes);
// app.use(passport.initialize());<

// Start the server
app.listen(port);
console.log('3B API starded on port ' + port);

module.exports = app;