require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Validate environment variables
function validateEnv() {
    const required = ['MONGODB_URI', 'MONGODB_DB_NAME'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

async function setupAtlasDatabase() {
    // Validate environment variables before proceeding
    validateEnv();

    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        connectTimeoutMS: 10000
    });

    try {
        // Connect to MongoDB Atlas
        await client.connect();
        console.log("Connexion réussie à MongoDB Atlas");

        // Verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Ping successful - Connection is responsive");

        const db = client.db(process.env.MONGODB_DB_NAME);

        // Get list of existing collections
        const collections = await db.listCollections().toArray();
        const existingCollections = collections.map(col => col.name);

        // Create collections with validation if they don't exist
        const collectionsToCreate = ['collectionA', 'collectionB'];
        
        for (const collectionName of collectionsToCreate) {
            if (!existingCollections.includes(collectionName)) {
                await db.createCollection(collectionName, {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["_id"],
                            additionalProperties: true
                        }
                    }
                });
                console.log(`Collection '${collectionName}' créée avec succès`);
            } else {
                console.log(`Collection '${collectionName}' existe déjà`);
            }
        }

        // List all available collections
        const updatedCollections = await db.listCollections().toArray();
        console.log("Collections disponibles:", 
            updatedCollections.map(col => col.name).join(", "));

        return true;
    } catch (error) {
        console.error("Erreur lors de la configuration:", error);
        throw error;
    } finally {
        await client.close();
        console.log("Connexion fermée");
    }
}

// Execute the setup
setupAtlasDatabase()
    .then(() => {
        console.log("Configuration terminée avec succès");
        process.exit(0);
    })
    .catch(error => {
        console.error("Erreur fatale:", error);
        process.exit(1);
    }); 