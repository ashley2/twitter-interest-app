var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
// require('dotenv').config()


var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

var User = require('../models/user');

router.post('/tweets', User.authMiddleware, function(req, res){
// console.log('i',req.body.interests)
  client.stream('statuses/filter', {track: req.body.interests}, function(stream) {
    stream.on('data', function(tweet) {
      console.log(tweet.user.screen_name + ":" + tweet.text);
    });
    stream.on('error', function(error) {
      throw error;
    });
  });
})

router.get('/usernames', User.authMiddleware, function(req, res) {
  User.find({_id: {$ne: req.user._id}}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  }).select('username');
});

router.delete('/logout', function(req, res) {
  res.clearCookie('ashleycookie').send();
});

router.get('/', function(req, res){
  User.find({}, function(err, users){
    res.send(users)
  })
})

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

      user.interests.push(req.body.interests)
      user.save(function(err, user){
        res.send(user);
      })
    }
  })
})

router.delete('/delete', User.authMiddleware, function(req, res){
  User.findById(req.user._id, function(err, user){
    if(err) {
      res.status(400).send(err);
    } else {
      console.log('user',user.interests)
      user.interests.splice(user.interests.indexOf(req.body.interests, 1))
      user.save(function(err, user){
        res.send(user)
      })
    }
  })
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