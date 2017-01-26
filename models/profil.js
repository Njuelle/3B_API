// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var ProfilSchema = new mongoose.Schema({
	header_db: HeaderSchema,
    name : String,
    permissions_routage: [{
    	routage_id: {type: mongoose.Schema.Types.ObjectId, required: false}
    }],
    permissions_menu: [{
        menu_id: {type: mongoose.Schema.Types.ObjectId, required: false}
    }],
});

// Export the Mongoose model
module.exports = mongoose.model('Profil', ProfilSchema);