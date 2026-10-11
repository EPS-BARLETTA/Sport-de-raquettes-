import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TouchButton from './TouchButton';

/**
 * Modal pour ajouter/modifier une classe
 */
const ClasseModal = ({ isOpen, onClose, classe, onSave }) => {
  const [nom, setNom] = useState(classe?.nom || '');

  useEffect(() => {
    if (classe) setNom(classe.nom);
  }, [classe, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: classe?.id || uuidv4(), nom });
    setNom('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {classe ? 'Modifier la classe' : 'Ajouter une classe'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la classe
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: 6A, 5B, 4C..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
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
              {classe ? 'Enregistrer' : 'Ajouter'}
            </TouchButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClasseModal;