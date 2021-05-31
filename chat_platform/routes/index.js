var express = require('express');
var router = express.Router();

/* GET Login slash createuser page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login : Chat Platform' });
});

module.exports = router;
