var express = require("express");
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Connection URL
const url = "mongodb://mongo:27017";

// Database Name
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/** POST -> CREATE USER */
router.post("/", async (req, res, next) => {

  if(!req.body.email || !req.body.password || !req.body.displayname){
    res.send({error: "email, password or displayname missing"})
    return;
  }

  try {
    // Database Name
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();

    const database = client.db("api");
    const users = database.collection("users");

    // create a document to be inserted
    const doc = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    const result = await users.insertOne(doc);

    res.send({
      insertedId: result.insertedId,
      insertedCount: result.insertedCount,
    });
  } catch (err) {
    res.status(500);
    res.send("Failed to connect to database");
  } finally {
    await client.close();
  }
});

/* GET -> GET USER <ID> */
router.get("/", async (req, res, next) => {
  try {
    // Database Name
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();

    const database = client.db("api");
    const users = database.collection("users");

    // create a document to be inserted
    const query = { firstname: req.params.firstname };
    const user = await users.findOne(query);

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send("Failed to connect to database");
  } finally {
    await client.close();
  }
});

router.put("/", (req, res, next) => {
  // respond "501 - not implemented"
  res.sendStatus(501);
});

router.delete("/", (req, res, next) => {
  // respond "501 - not implemented"
  res.sendStatus(501);
});

module.exports = router;
