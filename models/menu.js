// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var MenuSchema = new mongoose.Schema({
  header_db: HeaderSchema,
    nom: {type: String, required: true, lowercase: true},
    display_rank: {type: Number, required: false},
    dominant_id: {type: mongoose.Schema.Types.ObjectId, required: false},
    image: {type: mongoose.Schema.Types.ObjectId, required: false},
    path: {type: String, required: true, match: [/^[a-z\/ 0-9 .]{1,200}$/, '"path" fields provided not valid']}
});
// Export the Mongoose model
module.exports = mongoose.model('Menu', MenuSchema);