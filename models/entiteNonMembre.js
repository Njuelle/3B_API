// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

//Schema
var EntityNonMembreSchema = new mongoose.Schema({
  header_db: HeaderSchema,
  common: {
    image: {type: Object, required: false},
    groupe: {type: String, required: true, lowercase: true},
    entity_type: {type: String, required: true, default: 'non-membre'},
  },
  etat_civil: {
    titre: {type: String, required: true, enum: [ 'M.', 'Mme', 'Melle' ]},
    nom: {type: String, required: true, lowercase: true, match: [/^[a-zA-Zàâçéèêëîïôûùüÿñæœ]+$/, '"nom" fields provided not valid']},
    prenom: [{type: String, required: true, lowercase: true, match: [/^[a-zA-Zàâçéèêëîïôûùüÿñæœ]+$/, '"prenom" fields provided not valid']}],
    sexe: {type: String, required: true, enum: [ 'M', 'F' ]},
    statut_marital: {type: String, required: true}
  },
  relation: {
    lien_asso: {type: String, required: true},
    activite: {type: String, required: true},
    representant_id: {type: mongoose.Schema.Types.ObjectId, required: true}
  },
  adresse: {
    entete: {type: String, required: false},
    num: {type: String, required: false, match: [/^[0-9]$/, '"num" fields provided not valid']},
    ind_rept: {type: String, required: false, enum: [ 'Bis', 'Ter', 'Quater', 'Quinquies', 'Sexies', 'Septies', 'Octies', 'Novies', 'Decies']},
    voie: {type: String, required: false, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"voie" fields provided not valid']},
    zipcode: {type: String, required: true, match: [/^[0-9]{5}$/, '"zip_code" fields provided not valid']},
    ville: {type: String, required: true, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"ville" fields provided not valid']},
    pays: {type: String, required: true, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"pays" fields provided not valid']}
  },
  contact: {
    tel_fixe: {type: Number, required: false},
    tel_mobile: {type: Number, required: true},
    email: {type: String, required: true, match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, '"email" fields provided not valid']}
  },
  commentaire: {type: String, required: false}

});

// Export the Mongoose model
module.exports = mongoose.model('EntityNonMembre', EntityNonMembreSchema);