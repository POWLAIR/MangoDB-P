Voici un README restructuré et optimisé en gardant uniquement les **commandes Docker essentielles et leur utilité** pour ton projet MongoDB avec Docker et MongoDB Atlas.

---

# **📦 MongoDB Atlas & Docker**

## **🚀 Guide d'utilisation rapide**

### **🔹 Installation**
```bash
git clone [URL_DU_REPO]
cd mangodb-p
cp .env.example .env  # Configurer vos credentials MongoDB Atlas
npm install
```

---

## **🐳 Commandes Docker essentielles**

### **1️⃣ Démarrer et arrêter MongoDB**
| Commande | Description |
|----------|------------|
| `docker-compose up -d mongodb` | Démarrer uniquement le service MongoDB |
| `docker-compose up -d` | Démarrer tous les services |
| `docker-compose down` | Arrêter tous les services |
| `docker-compose down -v` | Arrêter et supprimer les volumes (⚠️ Supprime les données locales) |

---

### **2️⃣ Vérifier l’état des services**
| Commande | Description |
|----------|------------|
| `docker-compose ps` | Afficher l'état des conteneurs |
| `docker-compose logs mongodb` | Voir les logs de MongoDB |
| `docker-compose logs -f` | Suivre les logs en temps réel |
| `docker stats` | Afficher l'utilisation des ressources (CPU, RAM) |

---

### **3️⃣ Interagir avec MongoDB**
| Commande | Description |
|----------|------------|
| `docker-compose exec mongodb mongosh` | Ouvrir Mongo Shell dans le conteneur MongoDB |
| `docker run --rm -it mongo mongosh "mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>"` | Se connecter à MongoDB Atlas sans installation locale |
| `docker-compose up mongodb-query` | Exécuter des requêtes définies dans un script |

---

### **4️⃣ Gestion des données**
| Commande | Description |
|----------|------------|
| `docker-compose up mongodb-setup` | Configurer la base de données (création de collections et index) |
| `docker-compose up mongodb-populate` | Insérer les données initiales |
| `npm run dump` | Sauvegarder la base de données locale |
| `npm run restore` | Restaurer une sauvegarde |
| `docker-compose up mongodb-update` | Exécuter des mises à jour en base |

---

### **5️⃣ Maintenance et nettoyage**
| Commande | Description |
|----------|------------|
| `docker system prune -a` | Supprimer tous les conteneurs, volumes et images inutilisés |
| `docker volume prune` | Supprimer les volumes non utilisés |
| `docker-compose build --no-cache` | Rebuild les conteneurs sans cache |
| `docker-compose up -d --force-recreate` | Recréer les conteneurs de zéro |

---

## **📂 Structure du projet**
```
mangodb-p/
├── src/
│   ├── setupAtlasDatabase.js    # Configuration de MongoDB Atlas
│   ├── populateDatabase.js      # Insertion des données initiales
│   ├── queryDatabase.js         # Requêtes MongoDB
│   ├── updateDatabase.js        # Mises à jour
│   ├── dumpDatabase.js          # Sauvegardes
│   └── healthcheck.js           # Vérification du service
├── dumps/                       # Dossier des sauvegardes
├── Dockerfile                    # Configuration du conteneur Node.js
├── docker-compose.yml            # Configuration Docker
├── .env.example                   # Variables d'environnement
├── README.md                      # Documentation
```

---

## **⚙️ Variables d'environnement (.env)**
```env
# MongoDB Local (Docker)
MONGODB_LOCAL_URI=mongodb://admin:password@mongodb:27017
MONGODB_LOCAL_DB_NAME=myDatabase

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>
MONGODB_DB_NAME=myDatabase
```

---

## **🚑 Dépannage rapide**
### **1️⃣ Vérifier l’état de MongoDB**
```bash
docker-compose ps
docker-compose logs mongodb
docker-compose exec mongodb mongosh
```

### **2️⃣ Problèmes de connexion à MongoDB Atlas**
```bash
# Vérifier l’URI dans le fichier .env
cat .env | grep MONGODB_URI

# Tester la connexion depuis Docker
docker run --rm -it mongo mongosh "mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>"
```

### **3️⃣ Réinitialiser MongoDB local**
```bash
docker-compose down -v
docker volume prune
docker-compose up -d mongodb
docker-compose up mongodb-setup
```

---

## **📚 Documentation**
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB Shell (`mongosh`)](https://www.mongodb.com/docs/mongodb-shell/)
- [Docker Compose](https://docs.docker.com/compose/)

