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
            throw new Error("All fields must be filled out");
        }

        if ( !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(this.name )) {
            throw new Error("The name can only have letters");
        }

        if ( !/^[0-9X]{11}$/.test(this.cpf) ) {
            throw new Error("Invalid CPF");
        }

        if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ) {
            throw new Error("Invalid Email");
        }

        if ( !this.password || this.password.length < 4 ) {
            throw new Error("Password must contain at least 4 characters");
        }
    }

    async save() {
        try{
            this.authenticate();
            
            const db = await connectDB();
            const collection = db.collection("users");

            const usedCpf = await collection.findOne({ cpf: this.cpf });
            if (usedCpf){
                throw new Error("CPF is already in use")
            }

            const result = await collection.insertOne({
                name: this.name,
                cpf: this.cpf,
                email: this.email,
                password: this.password,
            });
            
            const newUser = await collection.findOne({ _id: result.insertedId });
            console.log("Registration completed: ", newUser);

        } catch (error){
            User.logError(error);
            console.error("Error: ", error.message)
        }
    }

    static async searchByCpf(cpf){
        try{
            const db = await connectDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ cpf });
            console.log("User found: ", user);
            return user;
        } catch (error) {
            User.logError(error);
        }
    }

    static async delete(cpf){
        try {
            const db = await connectDB();
            const collection = db.collection("users");
            const user = await collection.deleteOne({ cpf });

            if ( user.deletedCount > 0 ) {
                console.log("User deleted succesfuly");
            } else {
                console.log("User not found");
            } 

            const allUsers = await collection.find({}).toArray();
            console.log("Current users: ", allUsers)

        } catch (error) {
            User.logError(error);
        }
    }

    static logError(err) {
        const msg = `[${new Date().toISOString()}] ${err}\n`;
        fs.appendFileSync("erros.log", msg);
    }
}

module.exports = User;