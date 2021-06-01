var express = require("express");
var router = express.Router();

const requestTool = require('../functions/requests')

/* POST - Send message */
router.post("/", function (req, res, next) {
  
  requestTool.post("localhost:8002/messages", req.body).then(result => {

    res.status(result.response.statusCode);
    res.json(result.body);

  }).catch(err => {
    res.status(500);
    res.json({error: "Failed to contact database, an error occured.", message: err});
  })

});

/* GET - Get messages */
router.get("/", function (req, res, next) {
  requestTool.get("localhost:8002/messages?from=" + req.query.from + "&to=" + req.query.to).then(result => {

    res.status(result.response.statusCode);
    res.json(result.body);

  }).catch(err => {
    res.status(500);
    res.json({error: "Failed to contact database, an error occured.", message: err});
  })
});

module.exports = router;