const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017//";
const client = new MongoClient(url);
const dbName = "ecommerce";
let db;

async function connectDB() {
    try{
        if (db) return db;

        await client.connect();
        console.log("MongoDB connected");
        
        db = client.db(dbName);

        await db.collection("users").createIndex({ cpf: 1 }, {unique: true });
        await db.collection("sellers").createIndex({ cnpj: 1 }, { unique: true });

        return db
    } catch (error) {
        console.error("Erro na conexão com o MongoDB", error.message);
        throw error;
    }
}

module.exports = connectDB;