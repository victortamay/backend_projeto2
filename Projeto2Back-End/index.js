const User = require("./User");
const Product = require("./Product");
const Seller = require("./Seller");

async function main() {
    const user1 = new User("Julha", "12345678900", "julha@utfpr.com", "senha");
    user1.save();

    //const seller1 = new Seller("Loja Vitor", "00987654321", "vitor@loja.com", "ambev");
    //await seller1.save();

    //const product1 = new Product("Raquete de Padel", 500.00, "Raquete de Padel profissional", "00987654321");
    //await product1.save();

    //const product2 = new Product("Raquete de Tenis", 1000.00, "Raquete de Tenis profissional", "00987654321");
    //await product2.save();

    await User.searchByCpf("12345678900");

    //await Seller.searchByCnpj("00987654321");

    //await Product.searchByAdTitle("Raquete de Padel");

    //await Product.searchByAdTitle("Raquete de Tenis");

    //await User.delete("12345678900");

    //await Seller.delete("00987654321");

    //await Product.delete("Raquete de Padel");

}

main();