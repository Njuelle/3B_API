// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var EntiteSchema = new mongoose.Schema({
    header_db: HeaderSchema,
      common: {
        image: {type: String, required: false},
        groupe: {type: String, required: true},
        entity_type: {
          type: String, 
          enum: [ 'membre', 'non-membre', 'morale' ], required: true}
      },
       etat_civil: {
        titre: {type: String, enum:[ 'M.', 'Mme', 'Melle' ], required: false},
        entreprise: {
          raison_sociale: {type: String, required: false, uppercase: true},  
          SIREN: {type: String, required: false},  
          SIRET: {type: String, required: false},  
          forme_juridique: {type: String, required: false, uppercase: true}  
        },
        nom: {
          type: String,
          required: false,
          uppercase: true,
          match: [/^[a-zA-Zàâçéèêëîïôûùüÿñæœ]+$/, '"Nom" fields provided not valid']
        },
        prenom: [{
          type: String, 
          required: false, 
          lowercase: true,
          match: [/^[a-zA-Zàâçéèêëîïôûùüÿñæœ]+$/, '"Prenom" fields provided not valid']
        }],
        sexe: {type: String, enum:[ 'M', 'F' ], required: false},
        date_naissance: {type: Date, required: false},
        lieu_naissance: {
          type: String,
          required: false,
          match: [/^[a-zA-Z'-]+$/, '"lieu_naissance" fields provided not valid'],
          uppercase: true,
        },
        dpt_naissance: {
          type: String,
          required: false,
          match: [/^[0-9]{2,3}$/, '"dpt_naissance" fields provided not valid']
        },
        statut_marital: {type: String, required: false}
      },
      relation: {
        lien_asso: {type: String, required: false},
        activite: {type: String, required: false},
        representant_id: {type: mongoose.Schema.Types.ObjectId, required: false}
      },
      adresse: {
        entete: {type: String, required: false},
        num: {type: Number, required: false},
        ind_rept: {type: String, enum:[ 'Bis', 'Ter', 'Quater', 'Quinquies', 'Sexies', 'Septies', 'Octies', 'Novies', 'Decies'], required: false},
        voie: {
          type: String,
          required: false,
          match: [/^[a-zA-Z'-]+$/, '"voie" fields provided not valid']
        },
        zipcode: {type: Number, required: false},
        ville: {type: String, uppercase: true, required: false},
        pays: {type: String, uppercase: true, required: false}
      },
      contact: {
        tel_fixe: {type: Number, required: false},
        tel_mobile: {type: Number, required: false},
        email: {
          type: String,
          required: false,
          match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, '"email" fields provided not valid']
        }
      },
      infos_asso: {
        aka: {type: String, required: false},
        administration: {
          date_entree: {type: Date, required: false},
          date_sortie: {type: Date, required: false},
          generation: {type: Number, required: false},
          fiche_rg: [{
            annee: {
              type: String,
              required: false,
              match: [/^[0-9]{4}$/, '"année" fields provided not valid']
            },
            file: {type: String, required: false}
          }]
        },
        mobilite: {
          date_permis_de_conduire: {type: Date, required: false},
          vehicule_utilisable: {type: Boolean, required: false},
          bsr: {type: Boolean, required: false},
          deux_roues_utilisable: {type: Boolean, required: false}
        },
        sanitaire: {
          allergies:[{
            designation: {type: String, required: false},
            categorie: {type: String, required: false}
          }],
          asthme: {type: Boolean, required: false},
          phobies:[{
             type: String, required: false
          }],
          regime_alimentaire_particulier: {type: String, required: false},
          autre_infos:  {type: String, required: false},
          passif_medical:[{
            annee: {type: Date, required: false},
            designation: {type: String, required: false}
          }],
          lateralite: {type: String, required: false, enum:[ 'Gaucher', 'Droitier', 'Ambidextre' ]},
          contact_urgence: {
              id: {type: mongoose.Schema.Types.ObjectId, required: false},
              informations_a_transmettre: {type: String, required: false}
          },
        },
        parents: {
          pere: {
            id: {type: mongoose.Schema.Types.ObjectId, required: false},
            autorite_parentale: {type: Boolean, required: false}
          },
          mere: {
            id: {type: mongoose.Schema.Types.ObjectId, required: false},
            autorite_parentale: {type: Boolean, required: false}
          },
          responsable_legal_autre: {
            id: {type: mongoose.Schema.Types.ObjectId, required: false},
            autorite_parentale: {type: Boolean, required: false},
            lien:  {type: String, required: false}
          }
        },
        scolarite:[{
          annee: {type: Date, required: false},
          etablissement: {type: String, required: false},
          classe: {type: String, required: false},
          diplome_prepare: {type: String, required: false},
          diplome_obtenu: {type: String, required: false}
        }],
        langues_vivantes:[{
          lv: {type: String, required: false},
          niveau: {type: String, enum:[ 'Bilingue', 'Bon', 'Moyen', 'Notions' ], required: false}
        }],
        competences:[{
          designation: {type: String, required: false},
          niveau: {type: String, enum:[ 'Bon', 'Moyen', 'Notions' ], required: false}
        }],
        autre_association:[{
          designation: {type: String, required: false},
          date_entree: {type: Date, required: false},
          date_sortie: {type: Date, required: false}
        }],
        voyages_personels:[{
          annee: {type: Date, required: false},
          pays: {type: String, required: false}
        }]
      }
});
// Export the Mongoose model
module.exports = mongoose.model('Entite', EntiteSchema);