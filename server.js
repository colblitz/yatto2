// Babel ES6/JSX Compiler
require('babel-register');

// var swig  = require('swig');
// var React = require('react');
// var ReactDOM = require('react-dom/server');
// var Router = require('react-router');
// var routes = require('./app/routes');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(compression())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// app.use(function(req, res) {
//   Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
//     if (err) {
//       res.status(500).send(err.message)
//     } else if (redirectLocation) {
//       res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
//     } else if (renderProps) {
//       var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
//       var page = swig.renderFile('views/index.html', { html: html });
//       res.status(200).send(page);
//     } else {
//       res.status(404).send('Page Not Found')
//     }
//   });
// });

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


// var express = require('express');
// var path = require('path');
// var logger = require('morgan');
// var bodyParser = require('body-parser');
// var compression = require('compression');

// var app = express()

// app.use(compression())

// // serve our static stuff like index.css
// app.use(express.static(path.join(__dirname, 'public')))

// // send all requests to index.html so browserHistory works
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// var PORT = process.env.PORT || 8080
// app.listen(PORT, function() {
//   console.log('Production Express server running at localhost:' + PORT)
// })