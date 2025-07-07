const mongoDbStore = require("connect-mongodb-session");
const expressSession = require("express-session");

  const isProduction = process.env.NODE_ENV

function createSessionStore() {
  const MongoDbStore = mongoDbStore(expressSession);
  const store = new MongoDbStore({
    uri: process.env.MONGO_URI,
    databaseName: "online-shop",
    Collection: "sessions",
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
 maxAge: 2 * 24 * 60 * 60 * 1000, // two days
      secure: isProduction,           // only send cookies over HTTPS in production
      sameSite: isProduction ? "none" : "lax", // allow cross-site cookies if deployed
    },
  };
}

module.exports = createSessionConfig;
