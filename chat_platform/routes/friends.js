var express = require("express");
var router = express.Router();

const requestTool = require('../functions/requests')

/* POST - Create friends relation */
router.post("/", function (req, res, next) {

    requestTool.post("localhost:8001/friends", req.body).then(result => {

        res.status(result.response.statusCode);
        res.json(result.body);

    }).catch(err => {
        res.status(500);
        res.json({error: "Failed to contact graph database.", message: err})
    })

});

/* GET - Get all friends */
router.get("/", function (req, res, next) {
  
    requestTool.get("localhost:8001/friends/all?id=" + req.query.id).then(result => {
        res.status(result.response.statusCode);
        res.json(JSON.parse(result.body));
    }).catch(err => {
        res.status(500);
        res.json({error: "Failed to contact graph database.", message: err})
    })


});

/* GET - Get friend recommendations */
router.get("/recommendations", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

/* DELETE - Delete friends relation */
router.post("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

module.exports = router;