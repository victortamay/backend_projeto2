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
                throw new Error("Todos os campos devem estar preenchidos")
            }

        if ( typeof this.price !== "number" || isNaN(this.price) ) {
            throw new Error("Preço precisa ser um número");
        }

        this.sellerCnpj = this.sellerCnpj.replace(/\D/g, "");
            if ( this.sellerCnpj.length !== 14 ){
                throw new Error("CNPJ Inválido");
            }
    }

    async save() {
        try {
            this.authenticate();
            
            const db = await connectDB();
            const collection = db.collection("products");

            const seller = await db.collection("sellers").findOne({ cnpj:this.sellerCnpj });
            if ( !seller ) {
                throw new Error("Vendedor não encontrado");
            }

            const result = await collection.insertOne({
                adTitle: this.adTitle,
                price: this.price,
                description: this.description,
                sellerCnpj: this.sellerCnpj,
            });

            const newProduct = await collection.findOne({ _id: result.insertedId });
            console.log("Produto adicionado: ", newProduct);

        } catch (error) {
            Product.logError(error);
            throw error;
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
            throw error;
        }
    }

    static async delete(adTitle) {
        try {
            const db = await connectDB();
            const colecao = db.collection("products");
            const product = await colecao.deleteOne({ adTitle })

            if ( product.deletedCount > 0 ) {
                console.log("Produto deletado com sucesso");
            } else {
                console.log("Produto não encontrado");
            }

            const allProducts = await colecao.find({}).toArray();
            console.log("Produtos atuais: ", allProducts);

        } catch (error) { 
            Product.logError(error);
            throw error;
        }
    }

    static logError(err) {
        const msg = `[${new Date().toISOString()}] ${err}\n`;
        fs.appendFileSync("erros.log", msg);
    }
}

module.exports = Product;
