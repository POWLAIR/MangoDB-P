require('dotenv').config();
const { MongoClient } = require('mongodb');

async function updateQueries() {
    const uri = process.env.NODE_ENV === 'production' 
        ? process.env.MONGODB_URI 
        : process.env.MONGODB_LOCAL_URI;
    
    const dbName = process.env.NODE_ENV === 'production'
        ? process.env.MONGODB_DB_NAME
        : process.env.MONGODB_LOCAL_DB_NAME;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connexion à MongoDB établie");

        const db = client.db(dbName);

        console.log("\nExécution des mises à jour...\n");

        // 1. Modifier une valeur spécifique avec vérification avant/après
        console.log("Mise à jour de l'âge d'Alice:");
        const beforeAlice = await db.collection("collectionA").findOne({ name: "Alice" });
        console.log("Avant:", beforeAlice);

        const updateAlice = await db.collection("collectionA")
            .updateOne(
                { name: "Alice" },
                { $set: { age: 26, lastUpdated: new Date() } }
            );
        
        const afterAlice = await db.collection("collectionA").findOne({ name: "Alice" });
        console.log("Après:", afterAlice);
        console.log(`Modification effectuée: ${updateAlice.modifiedCount} document(s)`);

        // 2. Incrémenter l'âge de tous les utilisateurs
        console.log("\nIncrémentation de l'âge de tous les utilisateurs:");
        const beforeIncrement = await db.collection("collectionA")
            .find({}, { projection: { name: 1, age: 1 } })
            .toArray();
        console.log("Avant:", beforeIncrement);

        const incrementAge = await db.collection("collectionA")
            .updateMany(
                {},
                {
                    $inc: { age: 1 },
                    $set: { lastUpdated: new Date() }
                }
            );

        const afterIncrement = await db.collection("collectionA")
            .find({}, { projection: { name: 1, age: 1 } })
            .toArray();
        console.log("Après:", afterIncrement);
        console.log(`Documents modifiés: ${incrementAge.modifiedCount}`);

        // 3. Ajouter un projet avec timestamp
        console.log("\nAjout d'un nouveau projet pour Jean:");
        const newProject = {
            name: "New App",
            duration: "12 mois",
            startDate: new Date(),
            status: "En cours",
            technologies: ["Node.js", "MongoDB"]
        };

        const updateProjects = await db.collection("collectionB")
            .updateOne(
                { name: "Jean" },
                {
                    $push: { projects: newProject },
                    $set: { lastUpdated: new Date() }
                }
            );

        const afterProjectAdd = await db.collection("collectionB")
            .findOne({ name: "Jean" });
        console.log("Projets mis à jour:", afterProjectAdd.projects);
        console.log(`Modification effectuée: ${updateProjects.modifiedCount} document(s)`);

        // 4. Supprimer un champ avec sauvegarde
        console.log("\nSuppression du champ 'city' avec sauvegarde:");
        const citiesBackup = await db.collection("collectionA")
            .find({}, { projection: { name: 1, city: 1 } })
            .toArray();
        console.log("Sauvegarde des villes:", citiesBackup);

        const removeCity = await db.collection("collectionA")
            .updateMany(
                {},
                {
                    $unset: { city: "" },
                    $set: { lastUpdated: new Date() }
                }
            );
        console.log(`Champ 'city' supprimé dans ${removeCity.modifiedCount} document(s)`);

        // 5. Mise à jour conditionnelle avec $set et $min
        console.log("\nMise à jour conditionnelle des âges:");
        const conditionalUpdate = await db.collection("collectionA")
            .updateMany(
                { age: { $gt: 25 } },
                {
                    $min: { age: 25 },
                    $set: {
                        ageCategory: "25 ou moins",
                        lastUpdated: new Date()
                    }
                }
            );
        console.log(`Documents mis à jour: ${conditionalUpdate.modifiedCount}`);

        // 6. Ajouter des compétences uniques
        console.log("\nAjout de compétences uniques:");
        const updateSkills = await db.collection("collectionB")
            .updateMany(
                {},
                {
                    $addToSet: {
                        "details.skills": {
                            $each: ["Git", "Agile", "Docker"]
                        }
                    },
                    $set: { lastUpdated: new Date() }
                }
            );
        console.log(`Compétences ajoutées dans ${updateSkills.modifiedCount} document(s)`);

        // 7. Statistiques finales
        console.log("\nStatistiques des modifications:");
        const stats = {
            totalDocumentsA: await db.collection("collectionA").countDocuments(),
            totalDocumentsB: await db.collection("collectionB").countDocuments(),
            averageAge: (await db.collection("collectionA")
                .aggregate([
                    { $group: { _id: null, avg: { $avg: "$age" } } }
                ]).toArray())[0]?.avg
        };
        console.log(JSON.stringify(stats, null, 2));

        return true;
    } catch (error) {
        console.error("Erreur lors des mises à jour:", error);
        throw error;
    } finally {
        await client.close();
        console.log("\nConnexion fermée");
    }
}

// Exécution du script
updateQueries()
    .then(() => {
        console.log("Mises à jour effectuées avec succès");
        process.exit(0);
    })
    .catch(error => {
        console.error("Erreur fatale:", error);
        process.exit(1);
    }); 