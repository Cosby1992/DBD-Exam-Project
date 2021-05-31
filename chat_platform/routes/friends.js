var express = require("express");
var router = express.Router();

/* POST - Create friends relation */
router.post("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

/* GET - Get all friends */
router.get("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

/* GET - Get friend recommendations */
router.get("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

/* DELETE - Delete friends relation */
router.post("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

module.exports = router;