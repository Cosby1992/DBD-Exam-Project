const MongoClient = require("mongodb").MongoClient;

// Connection URL
const mongoUrl = "mongodb://mongo:27017";

dbInstance = async (callback) => {
  var userDB;

  try {
    const client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();

    const database = client.db("api");
    userDB = database.collection("users");
  } catch (err) {
    userDB = null;
  } finally {
    callback(userDB);
    await client.close();
  }
};

var userdb = {};

userdb.createUser = async (user) => {
  await dbInstance((db) => {
    if (db == null) return null;

    const result = await db.insertOne(user);

    return result;
  });
};
