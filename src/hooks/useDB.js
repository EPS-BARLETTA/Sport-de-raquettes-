/**
 * Hook personnalisé pour gérer les données avec IndexedDB
 */
import { useState, useEffect } from 'react';
import { db, dbUtils } from '../utils/db';

export const useDB = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialiser la base de données au montage
  useEffect(() => {
    const init = async () => {
      try {
        const success = await dbUtils.init();
        setIsReady(success);
      } catch (err) {
        setError(err);
        setIsReady(false);
      }
    };
    
    init();
  }, []);

  // Retourner les fonctions de la base de données
  return {
    isReady,
    error,
    db,
    ...dbUtils,
  };
};

export default useDB;