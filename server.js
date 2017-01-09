// Babel ES6/JSX Compiler
require('babel-register');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');

var app = express();

app.set('port', process.env.PORT || 3002);
app.use(compression())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});