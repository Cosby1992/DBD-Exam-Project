var express = require("express");
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Connection URL
const url = "mongodb://mongo:27017";
//const url = "mongodb://localhost:27017";

/** POST -> CREATE USER */
router.post("/", async (req, res, next) => {
  // Database Name
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var database = null;
  var usersCollection = null;

  try {
    await client.connect();
    database = client.db("api");
    usersCollection = database.collection("users");
  } catch (err) {
    res.send({ error: "Failed to connect to database" });
    await client.close();
    return;
  }

  if (req.body.email) {
    try {
      const result = await usersCollection.findOne({ email: req.body.email });

      if (result) {
        res.status(409) // duplicate entry
        res.json({ error: "Email already exists in database" });
        await client.close();
        return;
      }
    } catch (err) {
      res.status(500) // duplicate entry
      res.json({ error: "Failed to contact to database" });
      await client.close();
      return;
    }
  }

  if (!req.body.email || !req.body.password || !req.body.displayname) {
    res.status(400) // bad request
    res.json({ error: "email, password or displayname missing" });
    return;
  }

  // create a document to be inserted
  var doc = {
    email: req.body.email,
    password: req.body.password,
    displayname: req.body.displayname,
  };

  if (req.body.firstname) {
    doc.firstname = req.body.firstname;
  }

  if (req.body.lastname) {
    doc.lastname = req.body.lastname;
  }

  try {
    const result = await usersCollection.insertOne(doc);

    if (result) {
      res.json({
        insertedId: result.insertedId,
        insertedCount: result.insertedCount,
      });
    } else {
      res.status(500)
      res.json({ error: "Failed to insert in database" });
    }
  } catch (err) {
    res.status(500)
    res.json({ error: "Failed to contact to database" });
  } finally {
    await client.close();
  }
});

/* GET -> GET USER <EMAIL> */
router.get("/", async (req, res, next) => {

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const database = client.db("api");
    const users = database.collection("users");

    var mongo_query;

    if (req.query.email) {
      mongo_query = { email: req.query.email };
    } else {
      mongo_query = { displayname: req.query.displayname };
    }

    const user = await users.findOne(mongo_query);

    if(user) res.json(user);
    else res.status(404).json({error: "No user found"})


  } catch (err) {
    console.error(err);
    res.status(500);
    res.send("Failed to connect to database");
  } finally {
    await client.close();
  }
});

router.put("/", async (req, res, next) => {
  if (!req.query.email) {
    res.send({ error: "email is missing" });
    return;
  }

  // Database Name
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const database = client.db("api");
    const users = database.collection("users");

    req.body.lastupdated = new Date().toUTCString();

    result = await users.updateOne(
      { email: req.query.email },
      { $set: req.body }
    );

    res.send({ modifiedCount: result.modifiedCount });
    return;

  } catch (err) {
    res.send({ error: "Failed to connect to db" });
  } finally {
    await client.close();
  }
});

router.delete("/", async (req, res, next) => {
  if (!req.query.email) {
    res.send({ error: "email is missing" });
    return;
  }

  // Database Name
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const database = client.db("api");
    const users = database.collection("users");

    result = await users.deleteOne({ email: req.query.email });

    res.send({ deletedCount: result.deletedCount });
  } catch (err) {
    res.send({ error: "Failed to connect to db" });
  } finally {
    await client.close();
  }
});

module.exports = router;
