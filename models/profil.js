// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var ProfilSchema = new mongoose.Schema({
	header_db: HeaderSchema,
    name : String,
    permissions: [{ permission_id : String }]
    
});

// Export the Mongoose model
module.exports = mongoose.model('Profil', ProfilSchema);