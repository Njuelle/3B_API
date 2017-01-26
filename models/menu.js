// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var MenuSchema = new mongoose.Schema({
    header_db: HeaderSchema,
      nom: {type: String, required: true},
      display_rank: {type: Number, required: false},
      dominant_id: {type: mongoose.Schema.Types.ObjectId, required: true},
      image: {type: Object, required: false},
      path: {type: String, required: true}
});
// Export the Mongoose model
module.exports = mongoose.model('Menu', MenuSchema);