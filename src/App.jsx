import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, dbUtils } from './utils/db';
import TouchButton from './components/TouchButton';
import EleveCard from './components/EleveCard';
import ClasseModal from './components/ClasseModal';
import EleveModal from './components/EleveModal';

const App = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [terme, setTerme] = useState('terrain');
  
  const [showClasseModal, setShowClasseModal] = useState(false);
  const [showEleveModal, setShowEleveModal] = useState(false);
  const [editingClasse, setEditingClasse] = useState(null);
  const [editingEleve, setEditingEleve] = useState(null);

  // Charger les données depuis IndexedDB
  useEffect(() => {
    const loadData = async () => {
      try {
        await dbUtils.init();
        const classesList = await db.classes.toArray();
        setClasses(classesList);
        
        if (classesList.length > 0) {
          const firstClasse = classesList[0];
          setSelectedClasse(firstClasse);
          const elevesList = await db.eleves.where('classeId').equals(firstClasse.id).toArray();
          setEleves(elevesList);
        }
        
        const termeParam = await dbUtils.getParametre('termeTerrain');
        if (termeParam) setTerme(termeParam);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    };
    
    loadData();
  }, []);

  const saveClasse = async (classe) => {
    try {
      await dbUtils.saveClasse(classe);
      const updatedClasses = await db.classes.toArray();
      setClasses(updatedClasses);
      if (!editingClasse) {
        setSelectedClasse(classe);
        setEleves([]);
      }
      setShowClasseModal(false);
      setEditingClasse(null);
    } catch (error) {
      console.error('Erreur sauvegarde classe:', error);
    }
  };

  const deleteClasse = async (classeId) => {
    if (window.confirm('Supprimer cette classe et toutes ses données ?')) {
      try {
        await dbUtils.deleteClasse(classeId);
        const updatedClasses = await db.classes.toArray();
        setClasses(updatedClasses);
        if (selectedClasse?.id === classeId) {
          setSelectedClasse(null);
          setEleves([]);
        }
      } catch (error) {
        console.error('Erreur suppression classe:', error);
      }
    }
  };

  const selectClasse = async (classe) => {
    setSelectedClasse(classe);
    const elevesList = await db.eleves.where('classeId').equals(classe.id).toArray();
    setEleves(elevesList.sort((a, b) => a.nom.localeCompare(b.nom)));
  };

  const saveEleve = async (eleve) => {
    try {
      await dbUtils.saveEleve(eleve);
      const updatedEleves = await db.eleves.where('classeId').equals(selectedClasse.id).toArray();
      setEleves(updatedEleves.sort((a, b) => a.nom.localeCompare(b.nom)));
      setShowEleveModal(false);
      setEditingEleve(null);
    } catch (error) {
      console.error('Erreur sauvegarde élève:', error);
    }
  };

  const deleteEleve = async (eleveId) => {
    if (window.confirm('Supprimer cet élève ?')) {
      try {
        await dbUtils.deleteEleve(eleveId);
        const updatedEleves = await db.eleves.where('classeId').equals(selectedClasse.id).toArray();
        setEleves(updatedEleves.sort((a, b) => a.nom.localeCompare(b.nom)));
      } catch (error) {
        console.error('Erreur suppression élève:', error);
      }
    }
  };

  const changeTerme = async (nouveauTerme) => {
    setTerme(nouveauTerme);
    await dbUtils.setParametre('termeTerrain', nouveauTerme);
  };

  const pasteEleves = async (text) => {
    if (!selectedClasse) {
      alert("Sélectionnez une classe d'abord.");
      return;
    }
    const noms = text.split('\n').filter(n => n.trim() !== '');
    for (const nom of noms) {
      const parts = nom.trim().split(' ');
      const newEleve = {
        id: uuidv4(),
        classeId: selectedClasse.id,
        nom: parts[0],
        prenom: parts.length > 1 ? parts.slice(1).join(' ') : '',
        genre: 'garçon',
        terrainDepart: '',
        terrainArrivee: '',
      };
      await dbUtils.saveEleve(newEleve);
    }
    const updatedEleves = await db.eleves.where('classeId').equals(selectedClasse.id).toArray();
    setEleves(updatedEleves.sort((a, b) => a.nom.localeCompare(b.nom)));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (text && selectedClasse) {
      if (window.confirm('Coller la liste des élèves ?')) {
        pasteEleves(text);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-primary-700 text-center">
            Gestion des Sports de Raquettes
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Outil de suivi pour les cycles de badminton et tennis de table
          </p>
        </header>

        <nav className="flex justify-center mb-6">
          <div className="inline-flex rounded-xl bg-white p-1 shadow-md">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-6 py-3 rounded-lg font-medium transition-all $
                {`}
                  ${activeTab === 'classes' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
              Mes Classes
            </button>
            <button
              onClick={() => setActiveTab('montée-descente')}
              className={`px-6 py-3 rounded-lg font-medium transition-all $
                {`}
                  ${activeTab === 'montée-descente' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
              Montée-Descente
            </button>
            <button
              onClick={() => setActiveTab('poules')}
              className={`px-6 py-3 rounded-lg font-medium transition-all $
                {`}
                  ${activeTab === 'poules' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
              Poules
            </button>
          </div>
        </nav>

        <main className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'classes' && (
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                <TouchButton
                  onClick={() => {
                    setEditingClasse(null);
                    setShowClasseModal(true);
                  }}
                  className="bg-primary-600 text-white"
                >
                  + Ajouter une classe
                </TouchButton>
                
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-sm text-gray-600">Terme actuel:</span>
                  <select
                    value={terme}
                    onChange={(e) => changeTerme(e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    <option value="terrain">Terrain</option>
                    <option value="table">Table</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {classes.map((classe) => (
                  <div
                    key={classe.id}
                    onClick={() => selectClasse(classe)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all $
                      {`}
                        ${selectedClasse?.id === classe.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'}
                      `}
                    >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{classe.nom}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {eleves.filter(e => e.classeId === classe.id).length} élèves
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClasse(classe);
                            setShowClasseModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteClasse(classe.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedClasse && (
                <div className="border-t pt-6">
                  <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Élèves de {selectedClasse.nom}
                    </h2>
                    <div className="flex gap-3">
                      <TouchButton
                        onClick={() => {
                          setEditingEleve(null);
                          setShowEleveModal(true);
                        }}
                        className="bg-green-600 text-white"
                      >
                        + Ajouter un élève
                      </TouchButton>
                      <TouchButton
                        onClick={() => {
                          const text = window.prompt('Collez la liste des élèves (1 par ligne) :');
                          if (text) pasteEleves(text);
                        }}
                        className="bg-purple-600 text-white"
                      >
                        Coller une liste
                      </TouchButton>
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    onPaste={handlePaste}
                  >
                    {eleves.map((eleve) => (
                      <div key={eleve.id} className="flex flex-col gap-2">
                        <EleveCard
                          eleve={eleve}
                          onClick={() => {
                            setEditingEleve(eleve);
                            setShowEleveModal(true);
                          }}
                          terme={terme}
                        />
                        <TouchButton
                          onClick={() => deleteEleve(eleve.id)}
                          className="bg-red-100 text-red-600 text-xs"
                        >
                          Supprimer
                        </TouchButton>
                      </div>
                    ))}
                  </div>
                  
                  {eleves.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      Aucune élève dans cette classe. Ajoutez-en un(e) !
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'montée-descente' && (
            <div className="text-center text-gray-500 py-8">
              <p>Module Montée-Descente en cours de développement...</p>
              <p className="mt-2">
                Sélectionnez une classe dans l'onglet "Mes Classes" pour commencer.
              </p>
            </div>
          )}

          {activeTab === 'poules' && (
            <div className="text-center text-gray-500 py-8">
              <p>Module Poules en cours de développement...</p>
              <p className="mt-2">
                Les poules seront générées automatiquement après la phase de Montée-Descente.
              </p>
            </div>
          )}
        </main>

        <ClasseModal
          isOpen={showClasseModal}
          onClose={() => {
            setShowClasseModal(false);
            setEditingClasse(null);
          }}
          classe={editingClasse}
          onSave={saveClasse}
        />

        <EleveModal
          isOpen={showEleveModal}
          onClose={() => {
            setShowEleveModal(false);
            setEditingEleve(null);
          }}
          eleve={editingEleve}
          classeId={selectedClasse?.id}
          onSave={saveEleve}
          terme={terme}
        />
      </div>
    </div>
  );
};

export default App;