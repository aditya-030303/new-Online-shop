const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");
const authController = require("../controllers/auth.controller");

router.get("/products", productController.getAllProducts);

router.get("/products/:id", productController.getProductsDetails);
module.exports = router;
