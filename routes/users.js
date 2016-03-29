var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/usernames', User.authMiddleware, function(req, res) {
  User.find({_id: {$ne: req.user._id}}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  }).select('username');
});

router.delete('/logout', function(req, res) {
  res.clearCookie('ashleycookie').send();
});

router.get('/profile', User.authMiddleware, function(req, res) {
  res.send(req.user);
});

router.post('/authenticate', function(req, res) {
  User.authenticate(req.body, function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('ashleycookie', token).send(user);
    }
  });
});


router.post('/interests', User.authMiddleware, function(req, res){
  User.findById(req.user._id, function(err, user){
    if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('ashleycookie', token).send(user);
    }
  }
})

router.post('/register', function(req, res) {
  User.register(req.body, function(err, user) {
    if(err){
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('ashleycookie, token').send(user);
    }
  });
});

module.exports = router;