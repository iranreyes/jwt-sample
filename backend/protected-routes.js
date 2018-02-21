var express = require('express'),
  jwt = require('express-jwt'),
  config = require('./config'),
  quoter = require('./quoter');

var app = module.exports = express.Router();

// Validate access_token
var jwtCheck = jwt({
  secret: config.secret,
  aud: config.audience,
  iss: config.issuer
});

// Check for scope
function requireScope(scope) {
  console.log('required');
  return function (req, res, next) {
    console.log(req.user);
    var has_scopes = req.user.scope === scope;
    if (!has_scopes) {
      res.sendStatus(401);
      return;
    }
    next();
  };
}

app.use('/api/protected', jwtCheck, requireScope('full_access'));

app.get('/api/protected/random-quote', function (req, res) {
  res.status(200).send(quoter.getRandomOne());
});