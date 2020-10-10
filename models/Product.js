const mongoose = require("mongoose");

const Product = mongoose.model("product", { name: String });

module.exports = Product;
