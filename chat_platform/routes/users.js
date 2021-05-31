var express = require("express");
var router = express.Router();

var request = require("request");

/* POST - Create user */
router.post("/", function (req, res, next) {
  request(
    {
      url: "http://localhost:8000/users",
      method: "POST",
      json: true, // <--Very important!!!
      body: req.body,
    },
    function (error, response, body) {
      console.log(response);
      res.json(body);
    }
  );
});

/* GET - Get user */
router.get("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

/* PUT - Update user */
router.post("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

/* DELETE - Delete user */
router.post("/", function (req, res, next) {
  res.status(200).json({ message: "OK" });
});

createRequest = (
  url = "",
  port = 8080,
  path = "",
  method = "GET",
  data = {}
) => {
  return {
    hostname: url,
    port: port,
    method: method,
    path: path,
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
};

getErrorObject = (message = "") => {
  return {
    error: message,
  };
};

module.exports = router;
