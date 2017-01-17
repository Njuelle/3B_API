var Beer = require('../models/beer');
var mongoose = require('mongoose');    
// mongoose.connect('mongodb://localhost:27017/beerlocker');

module.exports = {
    getBeerById : function(req, res) {
        Beer.findById(req.params.beer_id, function(err, beer) {
            if (err) {
                res.send(err);
            }
            res.json(beer);
        });
    },

    getBeers : function(req, res) {
        Beer.find({ userId: req.user._id }, function(err, beers) {
            if (err){
                res.send(err);
            }
            res.json(beers);
        });
    },

    postBeer : function(req, res) {
        var beer = new Beer();

        // Set the beer properties that came from the POST data
        beer.name = req.body.name;
        beer.type = req.body.type;
        beer.quantity = req.body.quantity;
        beer.userId = req.user._id;

        // Save the beer and check for errors
        beer.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Beer added to the locker!', data: beer });
        });
    },

    putBeerQuantity : function(req, res) {
        Beer.update({ userId: req.user._id, _id: req.params.beer_id }, { quantity: req.body.quantity }, function(err, num, raw) {
            if (err){
                res.send(err);
            }
            // Update the existing beer quantity
            res.json({ message: num + ' updated' });
        });
    },

    deleteBeer : function(req, res) {
        Beer.remove({ userId: req.user._id, _id: req.params.beer_id }, function(err) {
            if (err){
                res.send(err);
            }

            res.json({ message: 'Beer removed from the locker!' });
        });
    }
}