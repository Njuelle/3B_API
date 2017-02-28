// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var BeerSchema = new mongoose.Schema({
	header_db: HeaderSchema,
    name     : String,
    test : [
		{
			_id : false,
			uid : String,
			qte : String
		}
    ]
});

// Export the Mongoose model
module.exports = mongoose.model('Beer', BeerSchema);