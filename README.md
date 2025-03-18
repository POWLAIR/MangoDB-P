# MongoDB Atlas Setup Project

Ce projet fournit une configuration automatisée pour MongoDB Atlas avec Node.js et Docker.

## 🚀 Fonctionnalités

- Connection sécurisée à MongoDB Atlas
- Création automatique de base de données
- Gestion des collections avec validation
- Gestion sécurisée des variables d'environnement
- Support Docker pour le développement local
- MongoDB local pour les tests

## 📋 Prérequis

- Docker et Docker Compose
- Compte MongoDB Atlas (pour la version cloud)
- Variables d'environnement configurées

## 🛠️ Installation

### Avec Docker (Recommandé)

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd mangodb-p
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer .env avec vos informations
```

3. Lancer avec Docker Compose :
```bash
# Pour le développement local avec MongoDB
docker-compose up mongodb

# Pour la configuration Atlas
docker-compose up mongodb-setup
```

### Installation Locale (Sans Docker)

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement comme ci-dessus

## 💻 Utilisation

### Avec Docker

Pour la base de données locale :
```bash
docker-compose up mongodb
```

Pour configurer MongoDB Atlas :
```bash
docker-compose up mongodb-setup
```

### Sans Docker

Pour configurer la base de données sur MongoDB Atlas :
```bash
npm run setup:atlas
```

Pour une configuration locale :
```bash
npm run setup:local
```

## 🔒 Sécurité

- Les credentials sont stockés dans le fichier `.env` (non versionné)
- Validation des variables d'environnement avant la connexion
- Gestion sécurisée des connexions avec MongoDB
- Conteneur Docker avec utilisateur non-root

## 📝 Structure du Projet

```
├── src/
│   ├── setupAtlasDatabase.js    # Configuration MongoDB Atlas
│   └── setupDatabase.js         # Configuration MongoDB locale
├── Dockerfile                   # Configuration Docker
├── docker-compose.yml          # Configuration Docker Compose
├── .env.example                # Template des variables d'environnement
├── .gitignore                 # Fichiers ignorés par Git
└── package.json               # Configuration du projet
```

## 🐳 Configuration Docker

Le projet inclut deux services Docker :
- `mongodb-setup` : Pour la configuration de MongoDB Atlas
- `mongodb` : Une instance MongoDB locale pour le développement

### Volumes
- `mongodb_data` : Stockage persistant pour MongoDB local

### Networks
- `mongodb-network` : Réseau isolé pour les services MongoDB 