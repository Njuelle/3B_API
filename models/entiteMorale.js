// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');
//Schema
var EntiteMoraleSchema = new mongoose.Schema({
  header_db: HeaderSchema,
  common: {
    _id: false,
    image: {type: Object, required: false},
    groupe: {type: String, required: true, lowercase: true},
    entity_type: {type: String, required: true, default: 'morale'},
  },
  etat_civil: {
    _id: false,
    raison_sociale: {type: String, required: true, uppercase: true},
    siren: {type: String, required: false},
    siret: {type: String, required: false},
    forme_juridique: {type: String, required: true, uppercase: true}
  },
  relation: {
    _id: false,
    lien_asso: {type: String, required: true},
    activite: {type: String, required: true},
    representant_id: {type: mongoose.Schema.Types.ObjectId, required: true}
  },
  adresse: {
    _id: false,
    entete: {type: String, required: false},
    num: {type: String, required: false, match: [/^[0-9]$/, '"num" fields provided not valid']},
    ind_rept: {type: String, required: false, enum: [ 'Bis', 'Ter', 'Quater', 'Quinquies', 'Sexies', 'Septies', 'Octies', 'Novies', 'Decies']},
    voie: {type: String, required: false, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"voie" fields provided not valid']},
    zipcode: {type: String, required: true, match: [/^[0-9]{5}$/, '"zip_code" fields provided not valid']},
    ville: {type: String, required: true, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"ville" fields provided not valid']},
    pays: {type: String, required: true, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"pays" fields provided not valid']}
  },
  contact: {
    _id: false,
    tel_fixe: {type: Number, required: false},
    tel_mobile: {type: Number, required: false},
    email: {type: String, required: false, match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, '"email" fields provided not valid']}
  },
  commentaire: {type: String, required: false}
});
// Export the Mongoose model
module.exports = mongoose.model('EntiteMorale', EntiteMoraleSchema);