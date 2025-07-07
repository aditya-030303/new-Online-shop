const path = require("path");
const express = require("express");

const csurf = require("csurf");
const expressSession = require("express-session");
require('dotenv').config();

const createSessionConfig = require("./config/session");
const db = require("./data/databse");
const addcsrfTokenMiddleware = require("./middlewares/csrf.token");
const errorHandlerMiddleWare = require("./middlewares/error.handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routs");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleWare = require("./middlewares/not-founnd");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/orders.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data")); //for serving images statically with the help of Url
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csurf());
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);
app.use(addcsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(authRoutes);
app.use(baseRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);

app.use("/orders", protectRoutesMiddleware, orderRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes); //which will filter out only admin routes

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

db.connectToDatabse()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the DB");
    console.log(error);
  });
