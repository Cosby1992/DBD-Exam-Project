var express = require('express');
var router = express.Router();

/* POST - login */
router.post('/login', function(req, res, next) {
    res.status(501).json({ message: "Not implemented" });
});

/* GET - logout */
router.get('/logout', function(req, res, next) {
    res.status(501).json({ message: "Not implemented" });
});

module.exports = router;
