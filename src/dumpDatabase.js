require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Créer le dossier dumps s'il n'existe pas
const dumpsDir = path.join(__dirname, '..', 'dumps');
if (!fs.existsSync(dumpsDir)) {
    fs.mkdirSync(dumpsDir);
}

// Générer un nom de fichier avec la date
const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-');
};

// Fonction pour effectuer le dump
async function performDump() {
    const isProduction = process.env.NODE_ENV === 'production';
    const uri = isProduction ? process.env.MONGODB_URI : process.env.MONGODB_LOCAL_URI;
    const dbName = isProduction ? process.env.MONGODB_DB_NAME : process.env.MONGODB_LOCAL_DB_NAME;

    if (!uri || !dbName) {
        console.error('❌ Variables d\'environnement manquantes');
        process.exit(1);
    }

    const timestamp = getTimestamp();
    const dumpPath = path.join(dumpsDir, `dump_${timestamp}`);

    console.log('🔄 Démarrage du dump de la base de données...');

    // Commande mongodump
    const cmd = `mongodump --uri="${uri}" --db=${dbName} --out="${dumpPath}"`;

    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Erreur lors du dump:', error);
                reject(error);
                return;
            }

            console.log('✅ Dump effectué avec succès');
            console.log(`📁 Emplacement: ${dumpPath}`);

            // Nettoyer les anciens dumps (garder seulement les 5 plus récents)
            const files = fs.readdirSync(dumpsDir)
                .filter(file => file.startsWith('dump_'))
                .map(file => ({
                    name: file,
                    path: path.join(dumpsDir, file),
                    time: fs.statSync(path.join(dumpsDir, file)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time);

            // Supprimer les dumps plus anciens
            if (files.length > 5) {
                files.slice(5).forEach(file => {
                    fs.rmSync(file.path, { recursive: true, force: true });
                    console.log(`🗑️ Ancien dump supprimé: ${file.name}`);
                });
            }

            resolve();
        });
    });
}

// Exécuter le dump
performDump().catch(console.error); 