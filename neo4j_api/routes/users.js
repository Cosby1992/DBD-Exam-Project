var express = require('express');
var router = express.Router();

const neo4j = require('neo4j-driver');

// connect to data
const db = neo4j.driver("bolt://neo4j:7687");


/* GET users listing. */
router.get('/',  async (req, res, next) => {
  const result = await db
  .session({
    database: "neo4j",
    defaultAccessMode: neo4j.session.WRITE,
  })
  .run("Match(p:Person) Where p.age=25 Return p.name;");
  res.json(result.records);
});

module.exports = router;
