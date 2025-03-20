require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function addReferences() {
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

        console.log("\nCréation et liaison des références...\n");

        // 1. Création de la collection des propriétés (collectionC)
        console.log("Création de la collection des propriétés:");
        
        const properties = [
            {
                _id: new ObjectId(),
                type: "Maison",
                description: "Maison 5 chambres",
                details: {
                    surface: 180,
                    chambres: 5,
                    parking: true,
                    jardin: true
                },
                adresse: {
                    rue: "123 Avenue des Fleurs",
                    ville: "Paris",
                    codePostal: "75001"
                },
                prix: 850000,
                disponible: true,
                dateCreation: new Date()
            },
            {
                _id: new ObjectId(),
                type: "Appartement",
                description: "Appartement 3 pièces",
                details: {
                    surface: 75,
                    chambres: 2,
                    parking: true,
                    balcon: true
                },
                adresse: {
                    rue: "45 Rue du Commerce",
                    ville: "Lyon",
                    codePostal: "69001"
                },
                prix: 320000,
                disponible: true,
                dateCreation: new Date()
            }
        ];

        await db.collection("collectionC").insertMany(properties);
        console.log(`${properties.length} propriétés ajoutées`);

        // 2. Mise à jour des références dans collectionA
        console.log("\nMise à jour des références dans collectionA:");
        
        // Attribution aléatoire des propriétés aux utilisateurs
        const users = await db.collection("collectionA").find({}).toArray();
        const propertyRefs = properties.map(p => ({ 
            propertyId: p._id,
            type: p.type,
            prix: p.prix
        }));

        for (const user of users) {
            // Attribution aléatoire d'une propriété
            const randomProperty = propertyRefs[Math.floor(Math.random() * propertyRefs.length)];
            
            await db.collection("collectionA").updateOne(
                { _id: user._id },
                { 
                    $set: { 
                        property: randomProperty,
                        lastUpdated: new Date()
                    }
                }
            );
            console.log(`Propriété attribuée à ${user.name}`);
        }

        // 3. Création d'une collection de transactions
        console.log("\nCréation de la collection des transactions:");
        
        const transactions = users.map(user => ({
            _id: new ObjectId(),
            userId: user._id,
            propertyId: user.property?.propertyId,
            type: "location",
            montant: user.property?.prix * 0.004, // Loyer mensuel estimé
            date: new Date(),
            status: "actif"
        }));

        await db.collection("transactions").insertMany(transactions);
        console.log(`${transactions.length} transactions créées`);

        // 4. Agrégation pour vérifier les références
        console.log("\nVérification des références:");
        
        const propertyAggregation = await db.collection("collectionA")
            .aggregate([
                {
                    $lookup: {
                        from: "collectionC",
                        localField: "property.propertyId",
                        foreignField: "_id",
                        as: "propertyDetails"
                    }
                },
                {
                    $lookup: {
                        from: "transactions",
                        localField: "_id",
                        foreignField: "userId",
                        as: "userTransactions"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        propertyType: { $arrayElemAt: ["$propertyDetails.type", 0] },
                        propertyDescription: { $arrayElemAt: ["$propertyDetails.description", 0] },
                        transactionCount: { $size: "$userTransactions" }
                    }
                }
            ]).toArray();

        console.log("\nRésumé des références:");
        console.log(JSON.stringify(propertyAggregation, null, 2));

        // 5. Statistiques finales
        console.log("\nStatistiques des collections:");
        const stats = {
            users: await db.collection("collectionA").countDocuments(),
            properties: await db.collection("collectionC").countDocuments(),
            transactions: await db.collection("transactions").countDocuments(),
            totalPropertyValue: (await db.collection("collectionC")
                .aggregate([
                    { $group: { _id: null, total: { $sum: "$prix" } } }
                ]).toArray())[0]?.total
        };
        console.log(JSON.stringify(stats, null, 2));

        return true;
    } catch (error) {
        console.error("Erreur lors de la création des références:", error);
        throw error;
    } finally {
        await client.close();
        console.log("\nConnexion fermée");
    }
}

// Exécution du script
addReferences()
    .then(() => {
        console.log("Références créées avec succès");
        process.exit(0);
    })
    .catch(error => {
        console.error("Erreur fatale:", error);
        process.exit(1);
    }); 