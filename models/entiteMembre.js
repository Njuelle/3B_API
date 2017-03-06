// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');
//Schema
var EntiteMembreSchema = new mongoose.Schema({
  header_db: HeaderSchema,
  common: {
    _id: false,
    image: {type: Object, required: false},
    groupe: {type: String, required: true, lowercase: true},
    entity_type: {type: String, required: true, default: 'membre'},
  },
  etat_civil: {
    _id: false,
    titre: {type: String, required: true, enum: [ 'M.', 'Mme', 'Melle' ]},
    nom: {type: String, required: true, lowercase: true, match: [/^[a-zA-Zàâçéèêëîïôûùüÿñæœ]+$/, '"nom" fields provided not valid']},
    prenom: [{type: String, required: true, lowercase: true, match: [/^[a-zA-Zàâçéèêëîïôûùüÿñæœ]+$/, '"prenom" fields provided not valid']}],
    sexe: {type: String, required: true, enum: [ 'M', 'F' ]},
    date_naissance: {type: Date, required: true},
    lieu_naissance: {type: String, required: true, lowercase: true, match: [/^[a-zA-Z'-]+$/, '"lieu_naissance" fields provided not valid']},
    dpt_naissance: {type: String, required: true, match: [/^[0-9]{2,3}$/, '"dpt_naissance" fields provided not valid']},
    statut_marital: {type: String, required: true}
  },
  adresse: {
    _id: false,
    entete: {type: String, required: false},
    num: {type: string, required: false, match: [/^[0-9]$/, '"num" fields provided not valid']},
    ind_rept: {type: String, required: false, enum: [ 'Bis', 'Ter', 'Quater', 'Quinquies', 'Sexies', 'Septies', 'Octies', 'Novies', 'Decies']},
    voie: {type: String, required: false, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"voie" fields provided not valid']},
    zipcode: {type: String, required: true, match: [/^[0-9]{5}$/, '"zip_code" fields provided not valid']},
    ville: {type: String, required: true, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"ville" fields provided not valid']},
    pays: {type: String, required: true, uppercase: true, match: [/^[a-zA-Z'-]+$/, '"pays" fields provided not valid']}
  },
  contact: {
    _id: false,
    tel_fixe: {type: Number, required: false},
    tel_mobile: {type: Number, required: true},
    email: {type: String, required: true, match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, '"email" fields provided not valid']}
  },
  aka: {type: String, required: false},
  administration: {
    _id: false,
    date_entree: {type: Date, required: true},
    date_sortie: {type: Date, required: false},
    generation: {type: Number, required: true},
    fiche_rg: [{
      _id: false,
      uid: {type: mongoose.Schema.Types.ObjectId, required: true},
      annee: {type: Date, required: true},
      file: {type: String, required: true}
    }]
  },
  mobilite: {
    _id: false,
    date_permis_de_conduire: {type: Date, required: false},
    vehicule_utilisable: {type: Boolean, required: true},
    bsr: {type: Boolean, required: true},
    deux_roues_utilisable: {type: Boolean, required: true}
  },
  sanitaire: {
    _id: false,
    allergies: [{
      _id: false,
      uid: {type: mongoose.Schema.Types.ObjectId, required: true},
      designation: {type: String, required: false},
      categorie: {type: String, required: false, uppercase: true}
    }],
    asthme: {type: Boolean, required: true},
    phobies: [{
      _id: false,
      uid: {type: mongoose.Schema.Types.ObjectId, required: true},
      type: String, required: false, uppercase: true
    }],
    regime_alimentaire_particulier: {type: String, required: false},
    autre_infos: {type: String, required: false},
    passif_medical: [{
      _id: false,
      uid: {type: mongoose.Schema.Types.ObjectId, required: true},
      annee: {type: Date, required: false},
      designation: {type: String, required: false}
    }],
    lateralite: {type: String, enum: [ 'Gaucher', 'Droitier','Ambidextre' ], required: true},
    contact_urgence: {
      _id: false,
      id: {type: mongoose.Schema.Types.ObjectId, required: true},
      informations_a_transmettre: {type: String, required: false}
    },
  },
  parents: {
    pere: {
      _id: false,
      id: {type: mongoose.Schema.Types.ObjectId, required: false},
      autorite_parentale: {type: Boolean, required: false}
    },
    mere: {
      _id: false,
      id: {type: mongoose.Schema.Types.ObjectId, required: false},
      autorite_parentale: {type: Boolean, required: false}
    },
    responsable_legal_autre: {
      _id: false,
      id: {type: mongoose.Schema.Types.ObjectId, required: false},
      autorite_parentale: {type: Boolean, required: false},
      lien: {type: String, required: false}
    },
    infos_familiales: {type: String, required: false}
  },
  scolarite:[{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    annee: {type: Date, required: true},
    etablissement: {type: mongoose.Schema.Types.ObjectId, required: true},
    classe: {type: String, required: false},
    diplome_prepare: {type: String, required: false},
    diplome_obtenu: {type: String, required: false}
  }],
  langues_vivantes:[{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    lv: {type: String, required: false, lowercase: true},
    niveau: {type: String, enum: [ 'Bilingue', 'Bon', 'Moyen', 'Notions' ], required: false}
  }],
  competences:[{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    designation: {type: String, required: false, lowercase: true},
    niveau: {type: String, enum: [ 'Bon', 'Moyen', 'Notions' ], required: false}
  }],
  autre_association:[{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    designation: {type: String, required: false},
    date_entree: {type: Date, required: false},
    date_sortie: {type: Date, required: false}
  }],
  voyages_personels:[{
    _id: false,
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    annee: {type: Date, required: false},
    pays: {type: String, required: false, uppercase: true}
  }],
  commentaire: {type: String, required: false}
});
// Export the Mongoose model
module.exports = mongoose.model('EntiteMembre', EntiteMembreSchema);