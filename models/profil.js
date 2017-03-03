// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var ProfilSchema = new mongoose.Schema({
  header_db: HeaderSchema,
  name: {type: String, required: true, match: [/^[a-zA-Zàâçéèêëîïôûùüÿñæœ ']+$/, '"name" fields provided not valid']},
  permissions_routage: [{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: false},
    routage_id: {type: mongoose.Schema.Types.ObjectId, required: false}
  }],
  permissions_menu: [{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: false},
    menu_id: {type: mongoose.Schema.Types.ObjectId, required: false}
  }]
});

// Export the Mongoose model
module.exports = mongoose.model('Profil', ProfilSchema);