var express = require('express');
var router = express.Router();
const redis = require("redis");



/* GET users listing. */
router.get('/', function(req, res, next) {
  const client = redis.createClient("redis://redis:6379");

  client.on("error", function(err) {
    res.status(500);
    res.json(err);
  });
  
  client.set("user:name", "Alex Merced", (err) => {

    client.get("user:name", (error, result) => {

      if(error){
        res.status(500);
        res.json(error);
      } 

      res.json(result)
  
    });

  });


});

module.exports = router;
