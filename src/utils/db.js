/**
 * Base de données IndexedDB pour l'application Sport de Raquettes
 * Utilise Dexie.js pour une gestion simplifiée.
 */
import Dexie from 'dexie';

// Définir la classe de la base de données
export class SportDeRaquettesDB extends Dexie {
  classes!
  eleves!
  poules!
  matchs!
  historiques!
  parametres!

  constructor() {
    super('SportDeRaquettesDB');
    
    this.version(1).stores({
      // Table des classes
      classes: 'id,nom,dateCreation',
      
      // Table des élèves (indexés par classeId pour les requêtes)
      eleves: 'id,classeId,nom,prenom,genre,terrainDepart,terrainArrivee,classementInitial,classementFinal',
      
      // Table des poules
      poules: 'id,nom,classeId,type (garçons/filles),joueurs,statut (en cours/terminée),modeJeu,tour',
      
      // Table des matchs
      matchs: 'id,pouleId,eleve1Id,eleve2Id,score1,score2,vainqueurId,date,statut (à jouer/en cours/terminé)',
      
      // Table de l'historique des élèves
      historiques: 'id,eleveId,pouleId,tour,classement,montéeDescente,date',
      
      // Table des paramètres
      parametres: 'id,clé,valeur',
    });
  }
}

// Instance unique de la base de données
export const db = new SportDeRaquettesDB();

// Fonctions utilitaires pour la gestion des données
export const dbUtils = {
  // Initialiser la base de données
  async init() {
    try {
      await db.open();
      console.log('Base de données IndexedDB ouverte avec succès.');
      
      // Vérifier si c'est la première ouverture
      const parametres = await db.parametres.toArray();
      if (parametres.length === 0) {
        // Initialiser avec des paramètres par défaut
        await db.parametres.bulkAdd([
          { id: 1, clé: 'termeTerrain', valeur: 'terrain' }, // 'terrain' ou 'table'
          { id: 2, clé: 'nbTerrainsParDefaut', valeur: '6' },
          { id: 3, clé: 'modeJeuParDefaut', valeur: 'points' },
        ]);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l'initialisation de la base de données:', error);
      return false;
    }
  },

  // Sauvegarder une classe
  async saveClasse(classe) {
    if (classe.id) {
      await db.classes.update(classe.id, classe);
    } else {
      classe.id = await db.classes.add(classe);
    }
    return classe;
  },

  // Supprimer une classe et ses dépendances
  async deleteClasse(classeId) {
    // Supprimer les élèves de la classe
    await db.eleves.where('classeId').equals(classeId).delete();
    
    // Supprimer les poules de la classe
    const poules = await db.poules.where('classeId').equals(classeId).toArray();
    for (const poule of poules) {
      await db.matchs.where('pouleId').equals(poule.id).delete();
    }
    await db.poules.where('classeId').equals(classeId).delete();
    
    // Supprimer la classe
    await db.classes.delete(classeId);
    
    return true;
  },

  // Sauvegarder un élève
  async saveEleve(eleve) {
    if (eleve.id) {
      await db.eleves.update(eleve.id, eleve);
    } else {
      eleve.id = await db.eleves.add(eleve);
    }
    return eleve;
  },

  // Supprimer un élève
  async deleteEleve(eleveId) {
    // Supprimer les matchs impliquant cet élève
    const matchs = await db.matchs.filter(m => m.eleve1Id === eleveId || m.eleve2Id === eleveId).toArray();
    for (const match of matchs) {
      await db.matchs.delete(match.id);
    }
    
    // Supprimer l'historique de cet élève
    await db.historiques.where('eleveId').equals(eleveId).delete();
    
    // Supprimer l'élève
    await db.eleves.delete(eleveId);
    
    return true;
  },

  // Sauvegarder une poule
  async savePoule(poule) {
    if (poule.id) {
      await db.poules.update(poule.id, poule);
    } else {
      poule.id = await db.poules.add(poule);
    }
    return poule;
  },

  // Sauvegarder un match
  async saveMatch(match) {
    if (match.id) {
      await db.matchs.update(match.id, match);
    } else {
      match.id = await db.matchs.add(match);
    }
    return match;
  },

  // Obtenir un paramètre
  async getParametre(clé) {
    const parametre = await db.parametres.where('clé').equals(clé).first();
    return parametre ? parametre.valeur : null;
  },

  // Mettre à jour un paramètre
  async setParametre(clé, valeur) {
    const parametre = await db.parametres.where('clé').equals(clé).first();
    if (parametre) {
      await db.parametres.update(parametre.id, { clé, valeur });
    } else {
      await db.parametres.add({ clé, valeur });
    }
    return true;
  },

  // Exporter toutes les données
  async exportAll() {
    const data = {
      classes: await db.classes.toArray(),
      eleves: await db.eleves.toArray(),
      poules: await db.poules.toArray(),
      matchs: await db.matchs.toArray(),
      historiques: await db.historiques.toArray(),
      parametres: await db.parametres.toArray(),
    };
    return data;
  },

  // Importer des données
  async importAll(data) {
    // Effacer les données existantes
    await db.classes.clear();
    await db.eleves.clear();
    await db.poules.clear();
    await db.matchs.clear();
    await db.historiques.clear();
    await db.parametres.clear();
    
    // Importer les nouvelles données
    if (data.classes) await db.classes.bulkAdd(data.classes);
    if (data.eleves) await db.eleves.bulkAdd(data.eleves);
    if (data.poules) await db.poules.bulkAdd(data.poules);
    if (data.matchs) await db.matchs.bulkAdd(data.matchs);
    if (data.historiques) await db.historiques.bulkAdd(data.historiques);
    if (data.parametres) await db.parametres.bulkAdd(data.parametres);
    
    return true;
  },
};

export default db;