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
            throw new Error("Todos os campos devem estar preenchidos");
        }

        if ( !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(this.name) ){
            throw new Error("O nome só pode conter letras");
        }

        this.cnpj = this.cnpj.replace(/\D/g, "");
        if ( this.cnpj.length !== 14){
            throw new Error ("CNPJ Inválido");
        }

        if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ){
            throw new Error("Email Inválido")
        }

        if ( !this.password || this.password.length < 4 ){
            throw new Error("A senha precisa ter pelo menos 4 caracteres");
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

            const usedCnpj = await collection.findOne({ cnpj: this.cnpj });
            if (usedCnpj){
                throw new Error("CNPJ já em uso")
            }

            const newSeller = await collection.findOne({ _id: result.insertedId });
            console.log("Registro completo: ", newSeller);

        } catch (error) {
            Seller.logError(error);
        }
    }

    static async searchByCnpj(cnpj){
        try {
            const db = await connectDB();
            const collection = db.collection("sellers");
            const seller = await collection.findOne({cnpj});
            console.log("Vendedor encontrado: ", seller);
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
                console.log("Vendedor deletado com sucesso");
            } else {
                console.log("Vendedor não encontrado")
            }

            const allSellers = await collection.find({}).toArray();
            console.log("Vendedores atuais: ", allSellers);

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