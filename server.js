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
var bCrypt         = require('bcrypt-nodejs');
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var expressSession = require('express-session');
var MongoStore     = require('connect-mongo')(expressSession);

// Get mongoose models
var User  = require('./models/user');
var State = require('./models/state');

// Mongo Configuration
mongoose.connect('mongodb://localhost:27017/yattwo');

var app = express();

// Set up Express things
app.set('port', process.env.PORT || 3002);
app.use(compression())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({
  secret: 'what is this secret',
  resave: false,
  saveUninitialized: false,
  maxAge: new Date(Date.now() + 3600000),
  store: new MongoStore(
    {mongooseConnection:mongoose.connection},
    function(err){
      console.log(err || 'connect-mongodb setup ok');
    })
}));
app.use(express.static(path.join(__dirname, 'public')));

// Set up Passport things
passport.serializeUser(function(user, done) {
  console.log('serializing user: ');
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log("id: " + id);
  User.findById(id, function(err, user) {
    console.log('deserializing user:',user);
    console.log("error: " + err);
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());



// send all requests to index.html so browserHistory works
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

var routes = require('./routes/index')(passport);
app.use('/', routes);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});