// Load required packages
var mongoose = require('mongoose');
var HeaderSchema = require('./header');

// Define our beer schema
var EntiteSchema = new mongoose.Schema({
    header_db: HeaderSchema,
      common: {
        image: {type: Object, required: false},
        groupe: {type: String, required: true},
        entity_type: {
          type: String, 
          enum: [ 'membre', 'non-membre', 'morale' ], required: true}
      },
      etat_civil: {
        titre: {type: String, enum:[ 'M.', 'Mme', 'Melle' ], required: false},
        raison_sociale: {type: String, required: false},
        nom: {type: String, required: false},
        prenom: {type: Array, required: false},
        sexe: {type: String, enum:[ 'M', 'F' ], required: false},
        date_naissance: {type: Date, required: false},
        lieu_naissance: {type: String, required: false},
        dpt_naissance: {type: String, required: false},
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
        voie: {type: String, uppercase: true, required: false},
        zipcode: {type: Number, required: false},
        ville: {type: String, uppercase: true, required: false},
        pays: {type: String, uppercase: true, required: false}
      },
      contact: {
        tel_fixe: {type: Number, required: false},
        tel_mobile: {type: Number, required: false},
        email: {type: String, required: false}
      },
      infos_asso: {
        aka: {type: String, required: false},
        administration: {
          date_entree: {type: Date, required: false},
          date_sortie: {type: Date, required: false},
          generation: {type: Number, required: false},
          fiche_rg: {
            annee: {type: Date, required: false},
            file: {type: Object, required: false}
          }
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
          lateralite: {type: String, required: false},
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