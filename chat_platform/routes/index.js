var express = require('express');
var router = express.Router();

/* GET Login slash createuser page. */
router.get('/', function(req, res, next) {
  res.status(200).json({message: "OK"})
});

module.exports = router;
