// Babel ES6/JSX Compiler
require('babel-register');

// Load libraries
var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var compression    = require('compression');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var passportJWT    = require('passport-jwt');
var jwt            = require('jsonwebtoken');

var ExtractJwt  = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var fs    = require('fs');
var http  = require('http');
var https = require('https');
var config = require('./config');

var options = {
  key  : fs.readFileSync(config.keyPath),
  cert : fs.readFileSync(config.certPath)
};

// Get mongoose models
var User  = require('./models/user');
var State = require('./models/state');

// Mongo Configuration
mongoose.connect('mongodb://localhost:27017/yattwo');

// Set up passport stuff
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = config.jwtSecretOrKey;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);

  User.findById(jwt_payload.id, function(err, user) {
    if (err) {
      console.log("Error: " + err);
      next(null, false);
    }
    if (!user) {
      console.log("No user found");
      next(null, false);
    } else {
      next(null, user);
    }
  });
});

passport.use(strategy);

// Set up Express things
var app = express();

app.set('port', process.env.PORT || 3002);
app.use(compression())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

var routes = require('./routes/index')(passport, jwtOptions.secretOrKey);
app.use('/', routes);

app.all('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// http.createServer(app).listen(80);
https.createServer(options, app).listen(app.get('port'), function() {
  console.log('Express server listening on https port ' + app.get('port'));
});

// app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// });
