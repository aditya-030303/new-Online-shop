const Products = require("../models/product.model");

async function getAllProducts(req, res, next) {
  try {
    const products = await Products.findAll();
    res.render("customers/products/all-products", { products: products });
  } catch (error) {
    next(error);
  }
}

async function getProductsDetails(req, res, next) {
  try {
    const product = await Products.findById(req.params.id);
    res.render("customers/products/product-details", { product: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductsDetails: getProductsDetails,
};
