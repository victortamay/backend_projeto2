const connectDB = require("./database");
const fs = require ("fs");

class Product {
    constructor (adTitle, price, description, sellerCnpj) {
        this.adTitle = adTitle;
        this.price = price;
        this.description = description;
        this.sellerCnpj = sellerCnpj
    }

    authenticate () {
        if ( !this.adTitle || !this.price || !this.description || !this.sellerCnpj ) {
                throw new Error("All fields must be filled out")
            }

        if ( typeof this.price !== "number" || isNaN(this.price) ) {
            throw new Error("Price must be a number");
        }

        this.sellerCnpj = this.sellerCnpj.replace(/\D/g, "");
            if ( this.sellerCnpj.length !== 14 ){
                throw new Error("Invalid CNPJ");
            }
    }

    async save() {
        try {
            this.authenticate();
            
            const db = await connectDB();
            const collection = db.collection("products");

            const seller = await db.collection("sellers").findOne({ cnpj:this.sellerCnpj });
            if ( !seller ) {
                throw new Error("Seller not found");
            }

            const result = await collection.insertOne({
                adTitle: this.adTitle,
                price: this.price,
                description: this.description,
                sellerCnpj: this.sellerCnpj,
            });

            const newProduct = await collection.findOne({ _id: result.insertedId });
            console.log("Product added: ", newProduct);

        } catch (error) {
            Product.logError(error);
        }
    }

    static async searchByAdTitle(adTitle) {
        try {
            const db = await connectDB();
            const collection = db.collection("products");
            const product = await collection.findOne({adTitle});
            console.log("Product found: ", product);
            return product;
        } catch (error) {
            Product.logError(error);
        }
    }

    static async delete(adTitle) {
        try {
            const db = await connectDB();
            const colecao = db.collection("products");
            const product = await colecao.deleteOne({ adTitle })

            if ( product.deletedCount > 0 ) {
                console.log("Product succesfuly deleted");
            } else {
                console.log("Product not found, please check again");
            }

            const allProducts = await colecao.find({}).toArray();
            console.log("Current products: ", allProducts);

        } catch (error) { 
            Product.logError(error);
        }
    }

    static logError(err) {
        const msg = `[${new Date().toISOString()}] ${err}\n`;
        fs.appendFileSync("erros.log", msg);
    }
}

module.exports = Product;
