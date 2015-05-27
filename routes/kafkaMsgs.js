var express = require('express');
var router = express.Router();
var app = require("../app");


/**
 * GET tweets json.
 */
router.get('/msgs', function(req, res) {

  var twts = app.kmsgs;
   res.setHeader('content-type', 'application/json');
   res.send(twts);
});

module.exports = router;
