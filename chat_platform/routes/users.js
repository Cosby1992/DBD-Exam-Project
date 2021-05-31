var express = require("express");
var router = express.Router();

var https = require("https");

/* POST - Create user */
router.post("/", function (req, res, next) {
  const request = createRequest("localhost", 8000, "/users", "POST", req.body);

  const requestRes = https.request(request, (result) => {
    console.log(`statusCode: ${result.statusCode}`);

    result.on("data", (d) => {
      console.log(d);
    });
  });

  requestRes.on("error", (error) => {
    console.error(error);
  });

  res.status(200).json({ message: "OK" });
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
      "Content-Length": data.length,
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
