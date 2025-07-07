const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabse() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  database = client.db("online-shop");
}

function getDb() {
  if (!database) {
    throw new Error("you must connect to the DB first");
  }

  return database;
}

module.exports = {
  connectToDatabse: connectToDatabse,
  getDb: getDb,
};
