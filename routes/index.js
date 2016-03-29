var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/protected', User.authMiddleware, function(req, res) {
  console.log('req.user:', req.user);
  res.send('wooo! protected!!');
});

module.exports = router;

