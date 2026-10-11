import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// --- Composants ---
const Button = ({ children, onClick, className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

const EleveCard = ({ eleve, onClick, isSelected }) => (
  <div
    onClick={onClick}
    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"} ${eleve.genre === "garçon" ? "bg-blue-50" : "bg-pink-50"}`}
  >
    <div className="font-semibold text-gray-800">{eleve.nom}</div>
    <div className="text-xs text-gray-500">
      {eleve.terrainDepart ? `Départ: ${eleve.terrainDepart}` : "Non assigné"}
      {eleve.terrainArrivee ? ` → Arrivée: ${eleve.terrainArrivee}` : ""}
    </div>
  </div>
);

const TerrainModal = ({ isOpen, onClose, eleve, terrains, onAssign }) => {
  const [terrainDepart, setTerrainDepart] = useState("");
  const [terrainArrivee, setTerrainArrivee] = useState("");

  useEffect(() => {
    if (eleve) {
      setTerrainDepart(eleve.terrainDepart || "");
      setTerrainArrivee(eleve.terrainArrivee || "");
    }
  }, [eleve, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Attribuer des terrains à {eleve?.nom}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terrain de départ</label>
            <select
              value={terrainDepart}
              onChange={(e) => setTerrainDepart(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Sélectionner --</option>
              {terrains.map((terrain) => (
                <option key={terrain} value={terrain}>{terrain}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terrain d'arrivée</label>
            <select
              value={terrainArrivee}
              onChange={(e) => setTerrainArrivee(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Sélectionner --</option>
              {terrains.map((terrain) => (
                <option key={terrain} value={terrain}>{terrain}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Annuler
          </Button>
          <Button
            onClick={() => onAssign(terrainDepart, terrainArrivee)}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={!terrainDepart || !terrainArrivee}
          >
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

const PoulesModal = ({ isOpen, onClose, eleves, onCreatePoules }) => {
  const [nbJoueurs, setNbJoueurs] = useState(4);
  const [modeJeu, setModeJeu] = useState("points");

  if (!isOpen) return null;

  const elevesValides = eleves.filter(e => e.terrainDepart && e.terrainArrivee);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Créer des poules</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de joueurs par poule
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={nbJoueurs}
              onChange={(e) => setNbJoueurs(parseInt(e.target.value) || 2)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode de jeu
            </label>
            <select
              value={modeJeu}
              onChange={(e) => setModeJeu(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="points">Points</option>
              <option value="temps">Temps</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>{elevesValides.length} élèves</strong> seront répartis en poules.</p>
            <p>Chaque poule contiendra <strong>{nbJoueurs} joueurs</strong>.</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Annuler
          </Button>
          <Button
            onClick={() => onCreatePoules(nbJoueurs, modeJeu)}
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={elevesValides.length < nbJoueurs}
          >
            Créer les poules
          </Button>
        </div>
      </div>
    </div>
  );
};

const Poule = ({ poule, onMatchResult, poulesHistory, setPoulesHistory }) => {
  const [results, setResults] = useState({});

  const allMatched = () => {
    const players = poule.joueurs;
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        if (!results[`${players[i].id}-${players[j].id}`]) {
          return false;
        }
      }
    }
    return true;
  };

  const generateMatchups = () => {
    const players = poule.joueurs;
    const matchups = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        matchups.push({
          player1: players[i],
          player2: players[j],
          result: results[`${players[i].id}-${players[j].id}`] || null
        });
      }
    }
    return matchups;
  };

  const matchups = generateMatchups();

  const handleResultChange = (matchup, winnerId) => {
    const key = `${matchup.player1.id}-${matchup.player2.id}`;
    setResults({...results, [key]: winnerId});
  };

  const validatePoule = () => {
    if (!allMatched()) {
      alert("Tous les joueurs doivent se rencontrer avant de valider la poule.");
      return;
    }
    const scores = {};
    poule.joueurs.forEach(player => {
      scores[player.id] = 0;
    });
    Object.entries(results).forEach(([key, winnerId]) => {
      const [p1, p2] = key.split("-");
      if (winnerId === p1) {
        scores[p1] += 1;
      } else if (winnerId === p2) {
        scores[p2] += 1;
      }
    });
    const sortedPlayers = [...poule.joueurs].sort((a, b) => scores[b.id] - scores[a.id]);
    const newHistory = [...poulesHistory];
    const existingPouleIndex = newHistory.findIndex(p => p.id === poule.id);
    if (existingPouleIndex >= 0) {
      newHistory[existingPouleIndex] = {
        ...poule,
        joueurs: sortedPlayers,
        statut: "terminée",
        dateFin: new Date().toISOString()
      };
    } else {
      newHistory.push({
        ...poule,
        joueurs: sortedPlayers,
        statut: "terminée",
        dateFin: new Date().toISOString()
      });
    }
    setPoulesHistory(newHistory);
    onMatchResult(sortedPlayers[0], sortedPlayers[sortedPlayers.length - 1]);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <h3 className="font-bold text-lg mb-3">Poule {poule.nom}</h3>
      <p className="text-sm text-gray-600 mb-2">
        Mode: {poule.modeJeu} | {poule.joueurs.length} joueurs
      </p>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Matchs à jouer :</h4>
        <div className="space-y-2">
          {matchups.map((matchup, index) => {
            const result = results[`${matchup.player1.id}-${matchup.player2.id}`];
            return (
              <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded-md">
                <span className="font-medium">{matchup.player1.nom}</span>
                <span>vs</span>
                <span className="font-medium">{matchup.player2.nom}</span>
                {result ? (
                  <span className="text-green-600 text-sm">
                    → Vainqueur: {result === matchup.player1.id ? matchup.player1.nom : matchup.player2.nom}
                  </span>
                ) : (
                  <div className="flex space-x-2 ml-auto">
                    <Button
                      onClick={() => handleResultChange(matchup, matchup.player1.id)}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1"
                    >
                      {matchup.player1.nom} gagne
                    </Button>
                    <Button
                      onClick={() => handleResultChange(matchup, matchup.player2.id)}
                      className="bg-pink-100 text-pink-700 text-xs px-2 py-1"
                    >
                      {matchup.player2.nom} gagne
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {allMatched() && (
        <div className="flex justify-end">
          <Button
            onClick={validatePoule}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Valider la poule
          </Button>
        </div>
      )}
    </div>
  );
};

export default function SportDeRaquettesApp() {
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [terrains, setTerrains] = useState(["Terrain 1", "Terrain 2", "Terrain 3", "Terrain 4", "Table 1", "Table 2"]);
  const [poules, setPoules] = useState([]);
  const [poulesHistory, setPoulesHistory] = useState([]);
  const [showTerrainModal, setShowTerrainModal] = useState(false);
  const [showPoulesModal, setShowPoulesModal] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState(null);

  useEffect(() => {
    const savedClasses = localStorage.getItem("sportDeRaquettes_classes");
    if (savedClasses) setClasses(JSON.parse(savedClasses));
    const savedPoulesHistory = localStorage.getItem("sportDeRaquettes_poulesHistory");
    if (savedPoulesHistory) setPoulesHistory(JSON.parse(savedPoulesHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("sportDeRaquettes_classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("sportDeRaquettes_poulesHistory", JSON.stringify(poulesHistory));
  }, [poulesHistory]);

  const addClasse = () => {
    const nom = prompt("Nom de la classe :");
    if (nom) {
      const newClasse = { id: uuidv4(), nom, eleves: [] };
      setClasses([...classes, newClasse]);
    }
  };

  const addEleve = (classeId) => {
    const nom = prompt("Nom de l'élève :");
    if (!nom) return;
    const genre = confirm("Est-ce un garçon ? (OK pour garçon, Annuler pour fille)") ? "garçon" : "fille";
    const newEleve = { id: uuidv4(), nom, genre, terrainDepart: "", terrainArrivee: "" };
    setClasses(classes.map(classe => {
      if (classe.id === classeId) {
        return { ...classe, eleves: [...classe.eleves, newEleve].sort((a, b) => a.nom.localeCompare(b.nom)) };
      }
      return classe;
    }));
  };

  const deleteEleve = (classeId, eleveId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet élève ?")) {
      setClasses(classes.map(classe => {
        if (classe.id === classeId) {
          return { ...classe, eleves: classe.eleves.filter(e => e.id !== eleveId) };
        }
        return classe;
      }));
    }
  };

  const assignTerrains = (eleve, terrainDepart, terrainArrivee) => {
    setClasses(classes.map(classe => {
      if (classe.id === selectedClasse.id) {
        return {
          ...classe,
          eleves: classe.eleves.map(e =>
            e.id === eleve.id ? { ...e, terrainDepart, terrainArrivee } : e
          )
        };
      }
      return classe;
    }));
    setShowTerrainModal(false);
  };

  const createPoules = (nbJoueurs, modeJeu) => {
    const elevesValides = selectedClasse.eleves.filter(e => e.terrainDepart && e.terrainArrivee);
    const garcons = elevesValides.filter(e => e.genre === "garçon");
    const filles = elevesValides.filter(e => e.genre === "fille");
    const createPoulesForGroup = (group, prefix) => {
      const poules = [];
      for (let i = 0; i < group.length; i += nbJoueurs) {
        const pouleJoueurs = group.slice(i, i + nbJoueurs);
        if (pouleJoueurs.length >= 2) {
          poules.push({
            id: uuidv4(),
            nom: `${prefix} Poule ${poules.length + 1}`,
            joueurs: pouleJoueurs,
            modeJeu,
            statut: "en cours"
          });
        }
      }
      return poules;
    };
    const newPoules = [
      ...createPoulesForGroup(garcons, "Garçons"),
      ...createPoulesForGroup(filles, "Filles")
    ];
    setPoules(newPoules);
    setShowPoulesModal(false);
  };

  const handleMatchResult = (winner, loser) => {
    setClasses(classes.map(classe => {
      if (classe.id === selectedClasse.id) {
        return {
          ...classe,
          eleves: classe.eleves.map(e => {
            if (e.id === winner.id) {
              return { ...e, terrainDepart: e.terrainArrivee, terrainArrivee: "" };
            }
            if (e.id === loser.id) {
              return { ...e, terrainDepart: "", terrainArrivee: e.terrainDepart };
            }
            return e;
          })
        };
      }
      return classe;
    }));
    setPoules(poules.filter(p => p.statut !== "terminée"));
  };

  const generateRecapHTML = () => {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Récapitulatif - Sports de Raquettes</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1e40af; }
          h2 { color: #374151; margin-top: 20px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
          .garcon { background-color: #dbeafe; }
          .fille { background-color: #fce7f3; }
          .montee { color: green; }
          .descente { color: red; }
        </style>
      </head>
      <body>
        <h1>Récapitulatif des évolutions - Sports de Raquettes</h1>
        <p>Généré le : ${new Date().toLocaleString()}</p>
    `;

    classes.forEach(classe => {
      html += `
        <h2>Classe : ${classe.nom}</h2>
        <table>
          <thead>
            <tr>
              <th>Élève</th>
              <th>Genre</th>
              <th>Terrain de départ</th>
              <th>Terrain d'arrivée</th>
              <th>Évolution</th>
            </tr>
          </thead>
          <tbody>
      `;
      classe.eleves.forEach(eleve => {
        const evolution = eleve.terrainDepart && eleve.terrainArrivee ?
          (eleve.terrainArrivee > eleve.terrainDepart ? "Montée" : "Descente") : "Stable";
        html += `
          <tr class="${eleve.genre === 'garçon' ? 'garcon' : 'fille'}">
            <td>${eleve.nom}</td>
            <td>${eleve.genre}</td>
            <td>${eleve.terrainDepart || "Non assigné"}</td>
            <td>${eleve.terrainArrivee || "Non assigné"}</td>
            <td class="${evolution === 'Montée' ? 'montee' : evolution === 'Descente' ? 'descente' : ''}">
              ${evolution}
            </td>
          </tr>
        `;
      });
      html += `
          </tbody>
        </table>
      `;
    });

    if (poulesHistory.length > 0) {
      html += `
        <h2>Historique des poules</h2>
        <table>
          <thead>
            <tr>
              <th>Poule</th>
              <th>Mode</th>
              <th>Vainqueur</th>
              <th>Dernier</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
      `;
      poulesHistory.forEach(poule => {
        html += `
          <tr>
            <td>${poule.nom}</td>
            <td>${poule.modeJeu}</td>
            <td>${poule.joueurs[0]?.nom || "N/A"}</td>
            <td>${poule.joueurs[poule.joueurs.length - 1]?.nom || "N/A"}</td>
            <td>${new Date(poule.dateFin).toLocaleString()}</td>
          </tr>
        `;
      });
      html += `
          </tbody>
        </table>
      `;
    }

    html += `
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recap-sport-raquettes-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectClasse = (classe) => {
    setSelectedClasse(classe);
    setPoules([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Sports de Raquettes</h1>
          <p className="text-gray-600">Organisez vos élèves, terrains et poules</p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <Button onClick={addClasse} className="bg-blue-600 text-white hover:bg-blue-700">
              + Ajouter une classe
            </Button>
            {selectedClasse && (
              <>
                <Button onClick={() => addEleve(selectedClasse.id)} className="bg-green-600 text-white hover:bg-green-700">
                  + Ajouter un élève
                </Button>
                <Button onClick={() => setShowPoulesModal(true)} className="bg-purple-600 text-white hover:bg-purple-700" disabled={selectedClasse.eleves.length < 2}>
                  Créer des poules
                </Button>
                <Button onClick={generateRecapHTML} className="bg-indigo-600 text-white hover:bg-indigo-700">
                  Générer le récapitulatif
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Classes</h2>
            <div className="space-y-2">
              {classes.map((classe) => (
                <div
                  key={classe.id}
                  onClick={() => selectClasse(classe)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selectedClasse?.id === classe.id ? "bg-blue-100 border-2 border-blue-500" : "bg-white border border-gray-200"}`}
                >
                  <h3 className="font-bold text-lg">{classe.nom}</h3>
                  <p className="text-sm text-gray-500">{classe.eleves.length} élèves</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedClasse ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Élèves de {selectedClasse.nom}
                  <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded">
                    {selectedClasse.eleves.length} élèves
                  </span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {selectedClasse.eleves.map((eleve) => (
                    <div key={eleve.id} className="flex flex-col">
                      <EleveCard
                        eleve={eleve}
                        onClick={() => {
                          setSelectedEleve(eleve);
                          setShowTerrainModal(true);
                        }}
                        isSelected={selectedEleve?.id === eleve.id}
                      />
                      <Button onClick={() => deleteEleve(selectedClasse.id, eleve.id)} className="mt-1 bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>

                {poules.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Poules en cours</h2>
                    <div className="space-y-4">
                      {poules.map((poule) => (
                        <Poule
                          key={poule.id}
                          poule={poule}
                          onMatchResult={handleMatchResult}
                          poulesHistory={poulesHistory}
                          setPoulesHistory={setPoulesHistory}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-center">Sélectionnez une classe pour afficher les élèves.</p>
              </div>
            )}
          </div>
        </div>

        <TerrainModal
          isOpen={showTerrainModal}
          onClose={() => setShowTerrainModal(false)}
          eleve={selectedEleve}
          terrains={terrains}
          onAssign={(depart, arrivee) => assignTerrains(selectedEleve, depart, arrivee)}
        />

        <PoulesModal
          isOpen={showPoulesModal}
          onClose={() => setShowPoulesModal(false)}
          eleves={selectedClasse?.eleves || []}
          onCreatePoules={createPoules}
        />
      </div>
    </div>
  );
}