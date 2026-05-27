const connectDB = require("./database");
const fs = require ("fs");

class Seller {
    constructor (name, cnpj, email, password) {
        this.name = name;
        this.cnpj = cnpj;
        this.email = email;
        this.password = password;
    }

    authenticate () {
        if ( !this.name || !this.cnpj || !this.email || !this.password){
            throw new Error("All fields must be filled out");
        }

        if ( !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(this.name) ){
            throw new Error("The name can only have letters");
        }

        this.cnpj = this.cnpj.replace(/\D/g, "");
        if ( this.cnpj.length !== 14){
            throw new Error ("Invalid CNPJ");
        }

        if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ){
            throw new Error("Invalid Email")
        }

        if ( !this.password || this.password.length < 4 ){
            throw new Error("Password must contain at least 4 characters");
        }
    }

    async save(){
        try {
            this.authenticate();
            
            const db = await connectDB();
            const collection = db.collection("sellers");
            const result = await collection.insertOne({
                name: this.name,
                cnpj: this.cnpj,
                email: this.email,
                password: this.password,
            });

            const newSeller = await collection.findOne({ _id: result.insertedId });
            console.log("Registration completed: ", newSeller);

        } catch (error) {
            Seller.logError(error);
        }
    }

    static async searchByCnpj(cnpj){
        try {
            const db = await connectDB();
            const collection = db.collection("sellers");
            const seller = await collection.findOne({cnpj});
            console.log("Seller found: ", seller);
            return seller;
        } catch (error) {
            Seller.logError(error);
        }
    }

    static async delete(cnpj){
        try {
            const db = await connectDB();
            const collection = db.collection("sellers");
            const seller = await collection.deleteOne({cnpj});

            if ( seller.deletedCount > 0 ){
                console.log("Seller deleted succesfuly");
            } else {
                console.log("Seller not found")
            }

            const allSellers = await collection.find({}).toArray();
            console.log("Current sellers: ", allSellers);

        } catch (error) {
            Seller.logError(error);
        }
    }

    static logError(err) {
            const msg = `[${new Date().toISOString()}] ${err}\n`;
            fs.appendFileSync("erros.log", msg);
        }
}

module.exports = Seller;