const { MongoClient } = require('mongodb');

async function healthCheck() {
    const uri = process.env.NODE_ENV === 'production' 
        ? process.env.MONGODB_URI 
        : process.env.MONGODB_LOCAL_URI;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB connection is healthy");
        process.exit(0);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

healthCheck(); 