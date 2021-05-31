var express = require('express');
var router = express.Router();

var https = require('https');

/* POST - login */
router.post('/', function(req, res, next) {

  if(!req.body.email || !req.body.pwd) {
    res.render('index', {title:"Failed Login : Chat Platform",
                        error: "Brugernavn eller Password er ikke indtastet"})
    return;
  } 

  const data = {
    email: req.body.email,
    password: req.body.pwd
  }

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }
  

  https.request(options, (response) => {

    console.log(response);

  })





});

module.exports = router;
