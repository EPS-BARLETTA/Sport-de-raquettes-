import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TouchButton from './TouchButton';

/**
 * Modal pour ajouter/modifier un élève
 */
const EleveModal = ({ isOpen, onClose, eleve, classeId, onSave, terme = 'terrain' }) => {
  const [nom, setNom] = useState(eleve?.nom || '');
  const [prenom, setPrenom] = useState(eleve?.prenom || '');
  const [genre, setGenre] = useState(eleve?.genre || 'garçon');
  const [terrainDepart, setTerrainDepart] = useState(eleve?.terrainDepart || '');
  const [terrainArrivee, setTerrainArrivee] = useState(eleve?.terrainArrivee || '');

  useEffect(() => {
    if (eleve) {
      setNom(eleve.nom);
      setPrenom(eleve.prenom || '');
      setGenre(eleve.genre);
      setTerrainDepart(eleve.terrainDepart || '');
      setTerrainArrivee(eleve.terrainArrivee || '');
    }
  }, [eleve, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: eleve?.id || uuidv4(),
      classeId,
      nom,
      prenom,
      genre,
      terrainDepart,
      terrainArrivee,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {eleve ? "Modifier l'élève" : "Ajouter un élève"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de famille"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="garçon">Garçon</option>
              <option value="fille">Fille</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {terme.charAt(0).toUpperCase() + terme.slice(1)} de départ
            </label>
            <input
              type="text"
              value={terrainDepart}
              onChange={(e) => setTerrainDepart(e.target.value)}
              placeholder={`Ex: ${terme} 1, ${terme} 2...`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {terme.charAt(0).toUpperCase() + terme.slice(1)} d'arrivée
            </label>
            <input
              type="text"
              value={terrainArrivee}
              onChange={(e) => setTerrainArrivee(e.target.value)}
              placeholder={`Ex: ${terme} 1, ${terme} 2...`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <TouchButton
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700"
            >
              Annuler
            </TouchButton>
            <TouchButton
              type="submit"
              className="bg-primary-600 text-white"
            >
              {eleve ? 'Enregistrer' : 'Ajouter'}
            </TouchButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EleveModal;