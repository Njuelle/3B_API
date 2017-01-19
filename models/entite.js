// Load required packages
var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var jwt          = require('jsonwebtoken');
var HeaderSchema = require('./header');

// Define our entite schema
var EntiteSchema = new mongoose.Schema({
    header_db: [HeaderSchema],
    login: String,
    password: String,
    profil_id: String,
    common: {
        image: Buffer,
        group: String
    },
    personne_moral: {
        etat_civil: {
            raison_sociale: String
        },
        activite: String,
        lien_asso: String,
        representant: String
    },
    personne_physique: {
        etat_civil: {
            titre: String,
            nom: String,
            prenom: String,
            aka: String,
            sexe: String,
            date_naissance: Date,
            lieu_naissance: String,
            dpt_naissance: String,
            statut_marital: String
        },
        administration: {
            date_entree: Date,
            date_sortie: Date,
            generation: Number,
            fiche_rg_path: {
                annee: Date,
                file: Buffer
            }
        }
        
            
    }
    
});

// Execute before each entite.save() call
EntiteSchema.pre('save', function(callback) {
    var entite = this;
    // Break out if the password hasn't changed
    if (!entite.isModified('password')){
        return callback();
    }    
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err){
            return callback(err);  
        } 
        bcrypt.hash(entite.password, salt, null, function(err, hash) {
            if (err){
                return callback(err);
            } 
            entite.password = hash;
            callback();
        });
    });
});

EntiteSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err){
            return callback(err);  
        } 
        callback(null, isMatch);
    });
};

// Export the Mongoose model
module.exports = mongoose.model('Entite', EntiteSchema);