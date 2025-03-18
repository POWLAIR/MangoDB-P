require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = process.env.NODE_ENV === 'production' 
        ? process.env.MONGODB_URI 
        : process.env.MONGODB_LOCAL_URI;
    
    const client = new MongoClient(uri);

    try {
        console.log("🔄 Test de connexion à MongoDB...");
        await client.connect();
        
        // Test de ping
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connexion MongoDB réussie!");

        // Test des permissions
        const dbs = await client.db().admin().listDatabases();
        console.log("\n📊 Bases de données disponibles:");
        console.log(dbs.databases.map(db => db.name).join(", "));

        // Test des opérations CRUD
        const testDb = client.db("test");
        const testCollection = testDb.collection("test");
        
        // Test d'écriture
        const writeResult = await testCollection.insertOne({ test: true, date: new Date() });
        console.log("\n✍️ Test d'écriture réussi:", writeResult.insertedId);

        // Test de lecture
        const readResult = await testCollection.findOne({ _id: writeResult.insertedId });
        console.log("📖 Test de lecture réussi:", readResult);

        // Nettoyage
        await testCollection.deleteOne({ _id: writeResult.insertedId });
        console.log("🗑️ Nettoyage réussi");

        return true;
    } catch (error) {
        console.error("❌ Erreur de connexion:", error);
        throw error;
    } finally {
        await client.close();
        console.log("\n🔌 Connexion fermée");
    }
}

// Exécution du test
testConnection()
    .then(() => {
        console.log("✨ Tests de connexion terminés avec succès");
        process.exit(0);
    })
    .catch(error => {
        console.error("❌ Erreur fatale:", error);
        process.exit(1);
    }); 