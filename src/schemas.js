const propertySchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["type", "description", "details", "prix", "disponible"],
            properties: {
                type: {
                    bsonType: "string",
                    enum: ["Maison", "Appartement"]
                },
                description: {
                    bsonType: "string"
                },
                details: {
                    bsonType: "object",
                    required: ["surface", "chambres"],
                    properties: {
                        surface: { bsonType: "number" },
                        chambres: { bsonType: "number" },
                        parking: { bsonType: "bool" }
                    }
                },
                prix: { bsonType: "number" },
                disponible: { bsonType: "bool" }
            }
        }
    }
};

const transactionSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["userId", "propertyId", "type", "montant", "date", "status"],
            properties: {
                userId: { bsonType: "objectId" },
                propertyId: { bsonType: "objectId" },
                type: {
                    bsonType: "string",
                    enum: ["location", "vente"]
                },
                montant: { bsonType: "number" },
                date: { bsonType: "date" },
                status: {
                    bsonType: "string",
                    enum: ["actif", "terminé", "annulé"]
                }
            }
        }
    }
};

module.exports = {
    propertySchema,
    transactionSchema
}; 