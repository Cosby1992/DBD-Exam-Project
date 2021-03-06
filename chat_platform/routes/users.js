var express = require("express");
var router = express.Router();

const requestTool = require("../functions/requests");

/* POST - Create user */
router.post("/", (req, res, next) => {

    if(!req.body.email ||
        !req.body.password ||
        !req.body.displayname ||
        !req.body.age ||
        !req.body.gender) {
            res.status(400);
            res.json({error: "Missing params: email, password, displayname, age or gender is missing"});
            return;
        }


  requestTool
    .post("localhost:8000/users", req.body)
    .then((result) => {

        if(result.response.statusCode !== 200) {
            res.status(result.response.statusCode);
            res.json(result.body);
            return;
        }

        var userobject = {
            id: result.body.insertedId,
            age: req.body.age || -1,
            gender: req.body.gender
        }
        
        console.log(userobject);

        requestTool.post("localhost:8001/users", userobject).then((neo4jresult) => {
        res.status(result.response.statusCode);
        res.json(result.body);

      })
      .catch(err => {
        res.status(500);
        res.json({
          error: "Failed to contact graph database.",
          messageFromServer: err,
        });
      });
    })
    .catch((err) => {
      res.status(500);
      res.json({
        error: "Failed to contact document database.",
        messageFromServer: err,
      });
    });
});

/* GET - Get user */
router.get("/", function (req, res, next) {
  
    requestTool.get("localhost:8000/users?email=" + req.query.email).then(result => {

    res.status(result.response.statusCode);
    res.json(result.body);

    }).catch(err => {
        console.log(err);
        res.status(500);
        res.json({ error: "Failed to contact database.", message: err });
    })

});

/* PUT - Update user */
router.post("/", function (req, res, next) {
  res.status(501).json({ message: "Not implemented" });
});

/* DELETE - Delete user */
router.post("/", function (req, res, next) {
  res.status(501).json({ message: "Not implemented" });
});

module.exports = router;
