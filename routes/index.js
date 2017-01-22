var express  = require('express');
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');
var jwt      = require('jsonwebtoken');

var User  = require('../models/user');
var State = require('../models/state');

mongoose.Promise = global.Promise;

var router = express.Router();

// Generates hash using bCrypt
var createHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
}

var isValidPassword = function(user, password){
  return bcrypt.compareSync(password, user.password);
}

function checkLoginRequirements(username, password) {
  if (!username && !password) { return "Must have both a username and a password"; }
  if (!username) { return "Must have a username"; }
  if (!password) { return "Must have a password"; }
  // other username/password requirements
  return "";
}

module.exports = function(passport, jwtSecretOrKey) {
  function createToken(userId) {
    return jwt.sign({id: userId}, jwtSecretOrKey);
  }

  router.get('/test', function(req, res) {
    console.log("sending success for test");
    res.json({ content: "asdf" });
  });

  //////////////////////////////////////////////////////////

  router.post('/register', function(req, res) {
    console.log("register endpoint");
    var username = req.body.username;
    var password = req.body.password;

    // Check username and password
    var s = checkLoginRequirements(username, password);
    if (s) { res.status(400).json({ error: s }); }

    User.findOne({ 'username' : username }, function(err, user) {
      // If error or user already exists
      if (err) { res.status(500).json({ error: "Error checking for user: " + err }); return; }
      if (user) { res.status(400).json({ error: "User already exists" }); return; }

      // Create user, save, and return token
      var newUser = new User();
      newUser.username = username;
      newUser.password = createHash(password);

      newUser.save(function(err) {
        if (err) { res.status(500).json({ error: "Error creating user: " + err }); return; }
        res.json({ token: createToken(newUser._id) });
      });
    });
  });

  //////////////////////////////////////////////////////////

  router.post("/login", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // Check username and password
    var s = checkLoginRequirements(username, password);
    if (s) { res.status(400).json({ error: s }); }

    User.findOne({ 'username' : username }, function(err, user) {
      // If error or user already exists
      if (err) { res.status(500).json({ error: "Error checking for user: " + err }); return; }
      if (!user) { res.status(400).json({ error: "User does not exist" }); return; }

      // Check password
      if (!isValidPassword(user, password)) { res.status(401).json({ error: "Invalid password" }); return; }

      res.json({ token: createToken(user._id) });
    });
  });

  //////////////////////////////////////////////////////////

  router.get("/state", passport.authenticate('jwt', { session: false }), function(req, res) {
    var userId = req.user._id;

    State.findOne({ 'user': userId }, function(err, state) {
      if (err) { res.status(500).json({ error: "Error finding state: " + err }); return; }
      if (!state) { res.status(400).json({ error: "No state found for user" }); return; }

      res.json({ state: state.state });
    }).sort({'date':-1}).limit(1);
  });

  //////////////////////////////////////////////////////////

  router.post("/state", passport.authenticate('jwt', { session: false }), function(req, res) {
    var userId = req.user._id;
    var state = req.body.state;

    State.remove({ 'user': userId }, function(err) {
      if (err) { console.log("Error removing previous states for user " + userId); }

      var newState = new State();
      newState.state = state;
      newState.user = userId;

      newState.save(function(err) {
        if (err) { res.status(500).json({ error: "Error saving state: " + err }); return; }
      });
      res.json({});
    });
  });

  //////////////////////////////////////////////////////////

  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  return router;
}