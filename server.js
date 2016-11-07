// load the things we need
var express = require('express');
var app = module.exports.app = exports.app = express();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var path = require('path');
app.use(express.static(__dirname + '/'));
var dotenv = require('dotenv').config();

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

// set the file path


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
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

app.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
     res.send('{"login":true}');
  } else {
   res.send('{"login":false}');
  }


});

// index page
app.get('/', function(req, res) {
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("acess granted");
});

var server = app.listen(30000, function () {
  console.log('Example app listening at http://%s:%s',
    server.address().address, server.address().port);
});
