var express = require('express');
var router = express.Router();

/* GET index, returns 200 stating the api is running */
router.get('/', function(req, res, next) {
 
  res.status(200);
  res.send({message: "Users API"})  

});

module.exports = router;
