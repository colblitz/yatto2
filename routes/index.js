var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var State = require('../models/state');

var router = express.Router();

var sendSuccess = function(res, content) {
  res.status(200).json({
    success: true,
    content: content
  }).end();
};

var sendErrResponse = function(res, err) {
  res.status(400).json({
    success: false,
    err: err
  }).end();
};

module.exports = function(passport) {
  router.get('/test', function(req, res) {
    console.log("sending success for tesT");
    sendSuccess(res, "asdf");
  });

  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // send all requests to index.html so browserHistory works
  // app.get('*', function (req, res) {
  //   res.sendFile(path.join(__dirname, 'public', 'index.html'))
  // })

  return router;
}