require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function findQueries() {
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

        console.log("\nExécution des requêtes...\n");

        // 1. Récupérer un document par nom
        console.log("Recherche par nom (Alice):");
        const documentByName = await db.collection("collectionA").findOne({ name: "Alice" });
        console.log(JSON.stringify(documentByName, null, 2));

        // 2. Trier selon l'âge (ascendant) et la ville (descendant)
        console.log("\nDocuments triés par âge (↑) et ville (↓):");
        const sortedDocs = await db.collection("collectionA")
            .find()
            .sort({ age: 1, city: -1 })
            .toArray();
        console.log(JSON.stringify(sortedDocs, null, 2));

        // 3. Filtrer les personnes de plus de 25 ans
        console.log("\nPersonnes de plus de 25 ans:");
        const greaterThanDocs = await db.collection("collectionA")
            .find({ age: { $gt: 25 } })
            .toArray();
        console.log(JSON.stringify(greaterThanDocs, null, 2));

        // 4. Filtrer avec $and (plus de 20 ans ET habite Paris)
        console.log("\nPersonnes de plus de 20 ans habitant Paris:");
        const andFilterDocs = await db.collection("collectionA")
            .find({
                $and: [
                    { age: { $gt: 20 } },
                    { city: "Paris" }
                ]
            })
            .toArray();
        console.log(JSON.stringify(andFilterDocs, null, 2));

        // 5. Filtrer avec $regex (noms commençant par 'A')
        console.log("\nPersonnes dont le nom commence par 'A':");
        const regexDocs = await db.collection("collectionA")
            .find({
                name: { $regex: "^A", $options: "i" }
            })
            .toArray();
        console.log(JSON.stringify(regexDocs, null, 2));

        // 6. Requêtes avancées sur collectionB
        console.log("\nDéveloppeurs avec plus de 3 ans d'expérience:");
        const experiencedDevs = await db.collection("collectionB")
            .find({
                $and: [
                    { "details.job": "Développeur" },
                    { "details.experience": { $gt: 3 } }
                ]
            })
            .toArray();
        console.log(JSON.stringify(experiencedDevs, null, 2));

        // 7. Agrégation : Moyenne d'âge par ville
        console.log("\nMoyenne d'âge par ville:");
        const avgAgeByCity = await db.collection("collectionA")
            .aggregate([
                {
                    $group: {
                        _id: "$city",
                        averageAge: { $avg: "$age" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { averageAge: -1 }
                }
            ])
            .toArray();
        console.log(JSON.stringify(avgAgeByCity, null, 2));

        // 8. Recherche avec projection (seulement nom et ville)
        console.log("\nNoms et villes uniquement:");
        const projectedDocs = await db.collection("collectionA")
            .find({})
            .project({ name: 1, city: 1, _id: 0 })
            .toArray();
        console.log(JSON.stringify(projectedDocs, null, 2));

        // 9. Requête avec $in (recherche multiple)
        console.log("\nPersonnes habitant à Paris ou Lyon:");
        const citiesFilter = await db.collection("collectionA")
            .find({
                city: { $in: ["Paris", "Lyon"] }
            })
            .toArray();
        console.log(JSON.stringify(citiesFilter, null, 2));

        // 10. Statistiques sur les collections
        console.log("\nStatistiques des collections:");
        const statsA = await db.collection("collectionA").stats();
        const statsB = await db.collection("collectionB").stats();
        console.log("CollectionA:", {
            count: statsA.count,
            size: `${Math.round(statsA.size / 1024)} KB`,
            avgObjSize: `${Math.round(statsA.avgObjSize)} bytes`
        });
        console.log("CollectionB:", {
            count: statsB.count,
            size: `${Math.round(statsB.size / 1024)} KB`,
            avgObjSize: `${Math.round(statsB.avgObjSize)} bytes`
        });

        return true;
    } catch (error) {
        console.error("Erreur lors de l'exécution des requêtes:", error);
        throw error;
    } finally {
        await client.close();
        console.log("\nConnexion fermée");
    }
}

// Exécution du script
findQueries()
    .then(() => {
        console.log("Requêtes exécutées avec succès");
        process.exit(0);
    })
    .catch(error => {
        console.error("Erreur fatale:", error);
        process.exit(1);
    }); 