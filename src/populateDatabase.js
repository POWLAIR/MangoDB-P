require('dotenv').config();
const { MongoClient } = require('mongodb');

async function populateDatabase() {
    const uri = process.env.NODE_ENV === 'production' 
        ? process.env.MONGODB_URI 
        : process.env.MONGODB_LOCAL_URI;
    
    const dbName = process.env.NODE_ENV === 'production'
        ? process.env.MONGODB_DB_NAME
        : process.env.MONGODB_LOCAL_DB_NAME;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connexion à MongoDB établie");

        const db = client.db(dbName);

        // Documents simples pour collectionA
        const dataA = [
            { 
                name: "Alice", 
                age: 25, 
                city: "Paris",
                createdAt: new Date(),
                hobbies: ["lecture", "voyages"]
            },
            { 
                name: "Bob", 
                age: 30, 
                city: "Lyon",
                createdAt: new Date(),
                hobbies: ["sport", "musique"]
            },
            { 
                name: "Charlie", 
                age: 22, 
                city: "Marseille",
                createdAt: new Date(),
                hobbies: ["photographie", "cuisine"]
            }
        ];

        // Documents imbriqués pour collectionB
        const dataB = [
            { 
                name: "Jean", 
                details: { 
                    job: "Développeur", 
                    experience: 5,
                    skills: ["JavaScript", "Node.js", "MongoDB"],
                    education: {
                        degree: "Master",
                        school: "École d'Ingénieurs",
                        year: 2018
                    }
                }, 
                city: "Toulouse",
                projects: [
                    { name: "Projet A", duration: "6 mois" },
                    { name: "Projet B", duration: "8 mois" }
                ],
                createdAt: new Date()
            },
            { 
                name: "Paul", 
                details: { 
                    job: "Designer", 
                    experience: 3,
                    skills: ["UI/UX", "Figma", "Adobe XD"],
                    education: {
                        degree: "Licence",
                        school: "École de Design",
                        year: 2020
                    }
                }, 
                city: "Bordeaux",
                projects: [
                    { name: "Refonte Site Web", duration: "3 mois" },
                    { name: "Application Mobile", duration: "4 mois" }
                ],
                createdAt: new Date()
            }
        ];

        // Suppression des données existantes
        await db.collection("collectionA").deleteMany({});
        await db.collection("collectionB").deleteMany({});
        console.log("🗑️ Anciennes données supprimées");

        // Insertion des nouvelles données
        const resultA = await db.collection("collectionA").insertMany(dataA);
        console.log(`✅ ${resultA.insertedCount} documents insérés dans collectionA`);

        const resultB = await db.collection("collectionB").insertMany(dataB);
        console.log(`✅ ${resultB.insertedCount} documents insérés dans collectionB`);

        // Vérification des données insérées
        const countA = await db.collection("collectionA").countDocuments();
        const countB = await db.collection("collectionB").countDocuments();
        
        console.log("\n📊 Résumé des collections :");
        console.log(`CollectionA : ${countA} documents`);
        console.log(`CollectionB : ${countB} documents`);

        return true;
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion des données:", error);
        throw error;
    } finally {
        await client.close();
        console.log("\n🔌 Connexion fermée");
    }
}

// Exécution du script
populateDatabase()
    .then(() => {
        console.log("✨ Population de la base de données terminée avec succès");
        process.exit(0);
    })
    .catch(error => {
        console.error("❌ Erreur fatale:", error);
        process.exit(1);
    }); 