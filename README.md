# Sport de Raquettes

Application de gestion des sports de raquettes pour les élèves.

## Fonctionnalités
- ✅ Gestion des classes et élèves
- ✅ Attribution des terrains (départ/arrivée)
- ✅ Création de poules (garçons/filles)
- ✅ Génération de récaps HTML
- ✅ Montée/descente automatique

## Structure du projet
```
Sport-de-raquettes/
├── public/
│   └── index.html          # Point d'entrée HTML
├── src/
│   ├── App.jsx             # Composant principal
│   └── index.js            # Entry point React
├── package.json            # Dépendances
├── vite.config.js          # Configuration Vite
└── README.md               # Documentation
```

## Installation
1. Cloner le dépôt :
```bash
git clone https://github.com/EPS-BARLETTA/Sport-de-raquettes-.git
cd Sport-de-raquettes-
```

2. Installer les dépendances :
```bash
npm install
```

3. Démarrer l'application :
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:5173](http://localhost:5173).

## Utilisation
- Ajoute des classes et des élèves.
- Attribue des terrains de départ et d'arrivée.
- Crée des poules (garçons/filles séparés).
- Joue les matchs et valide les poules.
- Génère un récapitulatif HTML.

## Technologie
- React 18
- Vite
- UUID pour les identifiants
- LocalStorage pour la persistance

## Auteur
Créé pour **Vauban Luxembourg** par **Jérôme B.**.
