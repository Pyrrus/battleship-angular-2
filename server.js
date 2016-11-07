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
  
  db.ref("/user").orderByChild("gitID").equalTo(req.user.id).on("child_added", function(snapshot) {
    userJson = snapshot.val();
  }); 

  if (userJson !== "") {
    res.send(userJson);
  } else {
    db.ref().child('user').push({
      name: req.user.displayName,
      gitID: req.user.id,
    });

    db.ref("/user").orderByChild("gitid").equalTo(req.user.id).on("child_added", function(snapshot) {
      userJson = snapshot.val();
    });

    res.send(userJson);
  }

  //   res.send(userJson);
});

// index page
app.get('/', function(req, res) {
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

var server = app.listen(30000, function () {
  console.log('Example app listening at http://%s:%s',
    server.address().address, server.address().port);
});
