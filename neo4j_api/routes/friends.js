var express = require("express");
var router = express.Router();

const faker = require("faker");

const neo4j = require("neo4j-driver");

// connect to data
const db = neo4j.driver("bolt://neo4j:7687");

router.get("/seed", async (req, res, next) => {
  // Check if the id's exists in the database
  const usersFound = await db
    .session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.WRITE,
    })
    .run(`MATCH (user:User) RETURN (user)`);

  usersFound.records.forEach(async (record, index) => {
    const user = record.get(0);

    var userarray = [
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
      faker.datatype.number({
        min: 1,
        max: usersFound.records.length - 1,
      }),
    ];

    var uniqueArray = [];

    userarray.forEach((userIndex) => {
      if (!uniqueArray.includes(userIndex)) uniqueArray.push(userIndex);
    });

    uniqueArray.forEach(async (userIndex) => {
      const friend = usersFound.records[userIndex].get(0);

      if(friend.properties.id === user.properties.id) return;

      // Check if relation already exists in the database
      const relationsFound = await db.session({
        database: "neo4j",
        defaultAccessMode: neo4j.session.WRITE,
      })
        .run(`MATCH (user1:User {id:'${user.properties.id}'})-[r:FRIENDS]-(user2:User {id:'${friend.properties.id}'})
              RETURN r.since;`);

      if (relationsFound.records.length !== 0) {
        return;
      }

      // Create friend relation between the users
      await db
        .session({
          database: "neo4j",
          defaultAccessMode: neo4j.session.WRITE,
        })
        .run(
          `MATCH (user1:User {id:'${user.properties.id}'}), (user2:User {id:'${
            friend.properties.id
          }'})
          CREATE (user1)-[r1:FRIENDS {since: '${faker.date.between(
            "1950",
            "2021"
          )}'}]->(user2)
          RETURN type(r1)`
        )
        .catch((err) => {
          console.log("Failed" + err);
        });
    });
  });

  res.json({ seed: "success" });
});

/* POST - CREATE FRIEND RELATION */
router.post("/", async (req, res, next) => {
  // Check if nessesary arguments are present
  if (!req.body.id1 || !req.body.id2) {
    res.status(400);
    res.json({ error: "Missing params: id1 or id2" });
    return;
  }

  // Check if the id's exists in the database
  const usersFound = await db
    .session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.WRITE,
    })
    .run(
      `MATCH (user:User) WHERE user.id IN ['${req.body.id1}','${req.body.id2}'] RETURN (user)`
    );

  const numOfUsers = usersFound.records.length;

  // Generate error if one or both of the users don't exists in the db
  if (numOfUsers !== 2) {
    var errorMessage;

    switch (numOfUsers) {
      case 0:
        errorMessage = "Both of the id's does not exist in the database";
        break;
      default:
        errorMessage = "One of the id's does not exist in the database";
        break;
    }

    res.status(409); // conflict - missing param
    res.json({
      error: errorMessage,
    });
    return;
  }

  // Check if relation already exists in the database
  const relationsFound = await db.session({
    database: "neo4j",
    defaultAccessMode: neo4j.session.WRITE,
  })
    .run(`MATCH (user1:User {id:'${req.body.id1}'})-[r:FRIENDS]-(user2:User {id:'${req.body.id2}'})
        RETURN r.since;`);

  if (relationsFound.records.length !== 0) {
    res.status(409); // conflict - duplicate entry
    res.json({ error: "Relation already exists" });
    return;
  }

  const now = new Date();

  // Create friend relation between the users
  const relation = await db.session({
    database: "neo4j",
    defaultAccessMode: neo4j.session.WRITE,
  })
    .run(`MATCH (user1:User {id:'${req.body.id1}'}), (user2:User {id:'${req.body.id2}'})
        CREATE (user1)-[r1:FRIENDS {since: '${now}'}]->(user2)
        RETURN type(r1)`);

  // Return status 200 and confirmation data
  res.json(relation);
});

// Get list of friends to recommend based on user id
router.get("/recommendations", async (req, res, next) => {
  // Check if id param is present
  if (!req.query.id) {
    res.status(400);
    res.json({ error: "Missing parameter: id" });
    return;
  }

  // Check if id exists in database
  const usersFound = await db
    .session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.WRITE,
    })
    .run(`MATCH (user:User) WHERE user.id = '${req.query.id}' RETURN (user);`);

  // If there's no user with that id, return error
  if (usersFound.records.length === 0) {
    res.status(400);
    res.json({ error: "No user found with id: " + req.query.id });
    return;
  }

  const result = await db.session({
    database: "neo4j",
    defaultAccessMode: neo4j.session.WRITE,
  })
    .run(`MATCH (user:User {id:'${req.query.id}'}) - [:FRIENDS*2..2] - (friendRecommendation:User)
          WHERE NOT (user:User {id:'${req.query.id}'}) - [:FRIENDS*1..1] - (friendRecommendation:User)
          RETURN DISTINCT gds.alpha.linkprediction.commonNeighbors(user, friendRecommendation, {
              relationshipQuery:"FRIENDS",
              direction:"BOTH"
          }) AS numCommonFriends, friendRecommendation 
          ORDER BY numCommonFriends DESC
          LIMIT 20`);

  var responseJsonArray = [];

  result.records.forEach((entry) => {
    responseJsonArray.push({
      friend: {
        id: entry.get(1).properties.id,
        age: entry.get(1).properties.age.low,
        gender: entry.get(1).properties.gender,
      },
      numberOfCommonFriends: entry.get(0),
    });
  });

  res.json(responseJsonArray);
});

// Get a list of users friends based on user id
router.get("/all", async (req, res, next) => {
  // Check if id param is present
  if (!req.query.id) {
    res.status(400);
    res.json({ error: "Missing parameter: id" });
    return;
  }

  // Check if id exists in database
  const usersFound = await db
    .session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.WRITE,
    })
    .run(`MATCH (user:User) WHERE user.id = '${req.query.id}' RETURN (user);`);

  // If there's no user with that id, return error
  if (usersFound.records.length === 0) {
    res.status(400);
    res.json({ error: "No user found with id: " + req.query.id });
    return;
  }

  const allFriends = await db.session({
    database: "neo4j",
    defaultAccessMode: neo4j.session.WRITE,
  })
    .run(`MATCH(user:User {id: '${req.query.id}'})-[:FRIENDS*1..1]-(myFriends:User) return myFriends`);

  var responseJsonArray = [];

  allFriends.records.forEach((entry) => {
    responseJsonArray.push({
      user: {
        id: entry.get(0).properties.id,
        age: entry.get(0).properties.age.low,
        gender: entry.get(0).properties.gender,
      }
    });
  });

  res.json({friends: responseJsonArray});
});

module.exports = router;
