const connectDB = require("./database");
const fs = require("fs");

class User {
    constructor(name, cpf, email, password){
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.password = password;
    }

    authenticate (){
        if( !this.name || !this.cpf || !this.email ) {
            throw new Error("Todos os campos devem ser preenchidos");
        }

        if ( !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(this.name )) {
            throw new Error("O nome só pode conter letras");
        }

        if ( !/^[0-9X]{11}$/.test(this.cpf) ) {
            throw new Error("CPF Inválido");
        }

        if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ) {
            throw new Error("Email Inválido");
        }

        if ( !this.password || this.password.length < 4 ) {
            throw new Error("A senha precisa ter pelo menos 4 caracteres");
        }
    }

    async save() {
        try{
            this.authenticate();
            
            const db = await connectDB();
            const collection = db.collection("users");

            const usedCpf = await collection.findOne({ cpf: this.cpf });
            if (usedCpf){
                throw new Error("CPF já em uso")
            }

            const result = await collection.insertOne({
                name: this.name,
                cpf: this.cpf,
                email: this.email,
                password: this.password,
            });
            
            const newUser = await collection.findOne({ _id: result.insertedId });
            console.log("Registro completo: ", newUser);

        } catch (error){
            User.logError(error);
            console.error("Error: ", error.message)
            throw error;
        }
    }

    static async searchByCpf(cpf){
        try{
            const db = await connectDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ cpf });
            console.log("Usuário encontrado: ", user);
            return user;
        } catch (error) {
            User.logError(error);
            throw error;
        }
    }

    static async delete(cpf){
        try {
            const db = await connectDB();
            const collection = db.collection("users");
            const user = await collection.deleteOne({ cpf });

            if ( user.deletedCount > 0 ) {
                console.log("Usuário deletado com sucesso");
            } else {
                console.log("Usuário não encontrado");
            } 

            const allUsers = await collection.find({}).toArray();
            console.log("Usuários atuais: ", allUsers)

        } catch (error) {
            User.logError(error);
            throw error;
        }
    }

    static logError(err) {
        const msg = `[${new Date().toISOString()}] ${err}\n`;
        fs.appendFileSync("erros.log", msg);
    }
}

module.exports = User;