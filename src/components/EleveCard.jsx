import React from 'react';

/**
 * Carte d'élève (tactile)
 */
const EleveCard = ({ eleve, onClick, terme = 'terrain' }) => (
  <div
    onClick={onClick}
    className={`eleve-card p-4 rounded-xl border-2 cursor-pointer transition-all
      bg-white border-gray-200 shadow-md hover:shadow-lg
      ${eleve.genre === 'garçon' ? 'bg-boys-50 border-boys-200' : 'bg-girls-50 border-girls-200'}
      ${eleve.terrainDepart ? 'border-primary-500' : ''}`}
  >
    <div className="font-semibold text-gray-800 truncate">{eleve.nom} {eleve.prenom || ''}</div>
    <div className="text-sm text-gray-600 mt-1">
      <span className={`px-2 py-1 rounded-full text-xs $
        {`}
          ${eleve.genre === 'garçon' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}
        `}
      >
        {eleve.genre}
      </span>
    </div>
    <div className="text-xs text-gray-500 mt-2">
      {eleve.terrainDepart ? `${terme} départ: ${eleve.terrainDepart}` : 'Non assigné'}
      {eleve.terrainArrivee ? ` → ${terme} arrivée: ${eleve.terrainArrivee}` : ''}
    </div>
    {eleve.classementInitial && (
      <div className="text-xs text-primary-600 mt-1">
        Classement initial: {eleve.classementInitial}
      </div>
    )}
  </div>
);

export default EleveCard;