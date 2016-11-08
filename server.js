// load the things we need
var express = require('express');
var app = module.exports.app = exports.app = express();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var path = require('path');
var dotenv = require('dotenv').config();
var firebase = require('firebase');
var userJson = "";

firebase.initializeApp({
  apiKey: dotenv.apiKey,
  authDomain: dotenv.authDomain,
  databaseURL: dotenv.databaseURL,
  storageBucket: dotenv.storageBucket
});

var db = firebase.database();

// set the file path
app.use(express.static(__dirname + '/'));

passport.use(new GithubStrategy({
    clientID: dotenv.clientID,
    clientSecret: dotenv.clientSecret,
    callbackURL: dotenv.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Express and Passport Session
var session = require('express-session');
app.use(session({secret: "enter custom sessions secret here"}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

// logout page
app.get('/logout', function(req, res){
  req.logout();
  userJson = "";
  res.redirect('/');
});

app.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
     res.send('{"login":true}');
  } else {
   res.send('{"login":false}');
  }
});

app.get('/user', ensureAuthenticated, function(req, res) {
  res.send(req.user);
});

// index page
app.get('/', function(req, res) {
});

app.get('/highscore', function(req, res) {
  var highscore = [];
  var scoresRef = db.ref("scores");
  scoresRef.orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {
     highscore.push(data.val());
    });
    hightscore = JSON.stringify(highscore);
    highscore.sort(function(a, b) {
      return a.attempts - b.attempts;
    })
    res.send(highscore);
  });
});


app.get('/userscore', ensureAuthenticated, function(req, res) {
  var userScore = [];
  var scoresRef = db.ref("scores");
  scoresRef.orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      if (data.val().gitID == req.user.id)
        userScore.push(data.val());
    });
    hightscore = JSON.stringify(userScore);
    userScore.sort(function(a, b) {
      return a.attempts - b.attempts;
    })
    res.send(userScore);
  });
});

app.post('/savescore', ensureAuthenticated, function(req, res){
  var attempts =req.query['attempts'];
  var hits = req.query['hits'];
    var scoreData = {
      attempts: attempts,
      hits: hits,
      name: req.user.displayName,
      gitID: req.user.id,
    };

    db.ref().child('scores').push(scoreData);
});

app.get('/error', function(req, res) {
  res.send('{"error": "error"}');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/error')
}

var server = app.listen(30000, function () {
  console.log('Example app listening at http://%s:%s',
    server.address().address, server.address().port);
});
