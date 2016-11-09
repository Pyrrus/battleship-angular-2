// load the things we need
var express = require('express');
var app = module.exports.app = exports.app = express();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var path = require('path');
var dotenv = require('dotenv').config();
var firebase = require('firebase');
var moment = require('moment');
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
  scoresRef.orderByValue().once("value", function(snapshot) {
    snapshot.forEach(function(data) {
     highscore.push(data.val());
    });
    highscore.sort(function(a, b) {
      if (a.attempts > b.attempts)
        return a.attempts - b.attempts;

      if (a.time > b.time)
        return a.time - b.time;
    });

    for (var i = 0; i < highscore.length; i++) {
      highscore[i].time = moment(highscore[i].time).format('MMMM Do YYYY, h:mm:ss a');
    }
    res.send(highscore);
  });
});


app.get('/userscore', ensureAuthenticated, function(req, res) {
  var userScore = [];
  var scoresRef = db.ref("scores");
  scoresRef.orderByValue().once("value", function(snapshot) {
    snapshot.forEach(function(data) {
      if (data.val().gitID == req.user.id)
        userScore.push(data.val());
    });
    userScore.sort(function(a, b) {
      if (a.attempts > b.attempts)
        return a.attempts - b.attempts;

      if (a.time > b.time)
        return a.time - b.time;
    });

    for (var i = 0; i < userScore.length; i++) {
      userScore[i].time = moment(userScore[i].time).format('MMMM Do YYYY, h:mm:ss a');
    }

    res.send(userScore);
  });
});

app.post('/savescore', ensureAuthenticated, function(req, res){
  var attempts =req.query['attempts'];
  var date = new Date();
  var currentDate = date.getTime();
    var scoreData = {
      attempts: attempts,
      name: req.user.displayName,
      time: currentDate,
      gitID: req.user.id
    };

    db.ref().child('scores').push(scoreData);
    res.send('{"save": "save"}');
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
