/**
 * Base de données IndexedDB pour l'application Sport de Raquettes
 * Utilise Dexie.js pour une gestion simplifiée.
 */
import Dexie from 'dexie';

// Définir la classe de la base de données
export class SportDeRaquettesDB extends Dexie {
  constructor() {
    super('SportDeRaquettesDB');
    
    this.version(1).stores({
      // Table des classes
      classes: 'id,nom,dateCreation',
      
      // Table des élèves
      eleves: 'id,classeId,nom,prenom,genre,terrainDepart,terrainArrivee,classementInitial,classementFinal',
      
      // Table des poules
      poules: 'id,nom,classeId,type,joueurs,statut,modeJeu,tour',
      
      // Table des matchs
      matchs: 'id,pouleId,eleve1Id,eleve2Id,score1,score2,vainqueurId,date,statut',
      
      // Table de l'historique
      historiques: 'id,eleveId,pouleId,tour,classement,montéeDescente,date',
      
      // Table des paramètres
      parametres: 'id,clé,valeur',
    });
  }
}

// Instance unique
export const db = new SportDeRaquettesDB();

// Fonctions utilitaires
export const dbUtils = {
  // Initialiser la base de données
  async init() {
    try {
      await db.open();
      console.log('Base de données ouverte avec succès.');
      
      const parametres = await db.parametres.toArray();
      if (parametres.length === 0) {
        await db.parametres.bulkAdd([
          { id: 1, clé: 'termeTerrain', valeur: 'terrain' },
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
    try {
      if (classe.id) {
        await db.classes.update(classe.id, classe);
      } else {
        classe.id = await db.classes.add(classe);
      }
      return classe;
    } catch (error) {
      console.error('Erreur sauvegarde classe:', error);
      throw error;
    }
  },

  // Supprimer une classe et ses dépendances
  async deleteClasse(classeId) {
    try {
      await db.eleves.where('classeId').equals(classeId).delete();
      
      const poules = await db.poules.where('classeId').equals(classeId).toArray();
      for (const poule of poules) {
        await db.matchs.where('pouleId').equals(poule.id).delete();
      }
      await db.poules.where('classeId').equals(classeId).delete();
      
      await db.classes.delete(classeId);
      return true;
    } catch (error) {
      console.error('Erreur suppression classe:', error);
      throw error;
    }
  },

  // Sauvegarder un élève
  async saveEleve(eleve) {
    try {
      if (eleve.id) {
        await db.eleves.update(eleve.id, eleve);
      } else {
        eleve.id = await db.eleves.add(eleve);
      }
      return eleve;
    } catch (error) {
      console.error('Erreur sauvegarde élève:', error);
      throw error;
    }
  },

  // Supprimer un élève
  async deleteEleve(eleveId) {
    try {
      const matchs = await db.matchs.filter(m => m.eleve1Id === eleveId || m.eleve2Id === eleveId).toArray();
      for (const match of matchs) {
        await db.matchs.delete(match.id);
      }
      
      await db.historiques.where('eleveId').equals(eleveId).delete();
      await db.eleves.delete(eleveId);
      return true;
    } catch (error) {
      console.error('Erreur suppression élève:', error);
      throw error;
    }
  },

  // Sauvegarder une poule
  async savePoule(poule) {
    try {
      if (poule.id) {
        await db.poules.update(poule.id, poule);
      } else {
        poule.id = await db.poules.add(poule);
      }
      return poule;
    } catch (error) {
      console.error('Erreur sauvegarde poule:', error);
      throw error;
    }
  },

  // Sauvegarder un match
  async saveMatch(match) {
    try {
      if (match.id) {
        await db.matchs.update(match.id, match);
      } else {
        match.id = await db.matchs.add(match);
      }
      return match;
    } catch (error) {
      console.error('Erreur sauvegarde match:', error);
      throw error;
    }
  },

  // Obtenir un paramètre
  async getParametre(clé) {
    try {
      const parametre = await db.parametres.where('clé').equals(clé).first();
      return parametre ? parametre.valeur : null;
    } catch (error) {
      console.error('Erreur lecture paramètre:', error);
      return null;
    }
  },

  // Mettre à jour un paramètre
  async setParametre(clé, valeur) {
    try {
      const parametre = await db.parametres.where('clé').equals(clé).first();
      if (parametre) {
        await db.parametres.update(parametre.id, { clé, valeur });
      } else {
        await db.parametres.add({ clé, valeur });
      }
      return true;
    } catch (error) {
      console.error('Erreur mise à jour paramètre:', error);
      return false;
    }
  },

  // Exporter toutes les données
  async exportAll() {
    try {
      const data = {
        classes: await db.classes.toArray(),
        eleves: await db.eleves.toArray(),
        poules: await db.poules.toArray(),
        matchs: await db.matchs.toArray(),
        historiques: await db.historiques.toArray(),
        parametres: await db.parametres.toArray(),
      };
      return data;
    } catch (error) {
      console.error('Erreur export données:', error);
      return null;
    }
  },

  // Importer des données
  async importAll(data) {
    try {
      await db.classes.clear();
      await db.eleves.clear();
      await db.poules.clear();
      await db.matchs.clear();
      await db.historiques.clear();
      await db.parametres.clear();
      
      if (data.classes) await db.classes.bulkAdd(data.classes);
      if (data.eleves) await db.eleves.bulkAdd(data.eleves);
      if (data.poules) await db.poules.bulkAdd(data.poules);
      if (data.matchs) await db.matchs.bulkAdd(data.matchs);
      if (data.historiques) await db.historiques.bulkAdd(data.historiques);
      if (data.parametres) await db.parametres.bulkAdd(data.parametres);
      
      return true;
    } catch (error) {
      console.error('Erreur import données:', error);
      return false;
    }
  },
};

export default db;