var express = require("express");
var router = express.Router();
const faker = require('faker');

const neo4j = require("neo4j-driver");

// connect to data
const db = neo4j.driver("bolt://neo4j:7687");

router.get("/seed", async (req, res, next) => {
  for (let index = 0; index < req.query.numnodes; index++) {
    await db
      .session({
        database: "neo4j",
        defaultAccessMode: neo4j.session.WRITE,
      })
      .run(
        `CREATE (user:User {id: "${faker.datatype.uuid()}", age: ${faker.datatype.number(
          {
            min: 18,
            max: 80,
          }
        )}, gender: "${faker.name.gender()}"}) return (user);`
      );
  }

  res.json({result: "success"})
});

/* POST - CREATE USER */
router.post("/", async (req, res, next) => {
  if (!req.body.id || !req.body.age || !req.body.gender) {
    res.status(400);
    res.json({ error: "Missing params: id, age or gender" });
    return;
  }

  const result = await db
    .session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.WRITE,
    })
    .run(`MATCH (user:User) WHERE user.id = "${req.body.id}" return (user)`);

  if (result.records.length > 0) {
    res.status(409); // conflict - duplicate entry
    res.json({ error: "User already exists in db." });
    return;
  }

  const result2 = await db
    .session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.WRITE,
    })
    .run(
      `CREATE (user:User {id: "${req.body.id}", age: ${req.body.age}, gender: "${req.body.gender}"}) return (user);`
    );

  res.json(result2.records);
});

module.exports = router;
