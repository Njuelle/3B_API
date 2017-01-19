var EntiteSchema = new mongoose.Schema({
    header_db: [HeaderSchema],
      common: {
        image: Buffer,
        groupe: String,
      },
      personne_morale: {
        etat_civil: {
          raison_sociale: String,
        },
          activite: String,
          lien_asso: String,
          representant: String
      },
      personne_physique: {
        etat_civil: {
          titre: String,
          nom: String,
          prenom:[ String],
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
          fiche_rg_path:[
            {annee: Date, file: Buffer}
          ],
        },
        mobilite: {
          date_permis_de_conduire: Date,
          vehicule_utilisable: Boolean,
          bsr: Boolean,
          deux_roues_utilisable: Boolean
        },
        sanitaire: {
          allergies:[
            {designation: String, type: String}
          ],
          asthme: Boolean,
          phobies:[{designation: String}],
          regime_alimentaire_particulier: String,
          autre_infos: String,
          passif_medical:[
            {annee: Date, designation: String}
          ],
          lateralite: String,
          contact_urgence: {
              id: String,
              informations_a_transmettre: String
          },
        },
        parents: {
          pere: {
            id: String,
            autorite_parentale: Boolean
          },
          mere: {
            id: String,
            autorite_parentale: Boolean
          },
          responsable_legal_autre: {
            id: String,
            autorite_parentale: Boolean
          }
        },
        scolarite:[
          {annee: Date,
            etablissement: String,
            classe: String,
            diplome_prepare: String,
            diplome_obtenu: String}
        ],
        langues_vivantes:[
          {lv: String,
            niveau: String}
        ],
        competences:[
          {designation: String,
            niveau: String}
        ],
        autre_association:[
          {designation: String,
            date_entree: Date,
            date_sortie: Date}
        ],
        voyages_personels:[
          {annee: Date,
            pays: String}
        ]
      },
      adresse: {
        entete: String,
        num: Number,
        ind_rept: String,
        voie: String,
        zipcode: String,
        ville: String,
        pays: String
      },
      contact: {
        tel_fixe: Number,
        tel_mobile: Number,
        email: String
      }
    
});