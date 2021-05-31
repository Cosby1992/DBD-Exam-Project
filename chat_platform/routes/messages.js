var express = require("express");
var router = express.Router();

/* POST - Send message */
router.post("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

/* GET - Get messages */
router.get("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

module.exports = router;