'use strict';

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../config'); // get our config file
const passwordHash = require('password-hash');
const User = require('../models/user.js');

module.exports = {
  login: login
};

function login(req, res) {
  // Gets the username and password from the request body
  const userObject = req.swagger.params.user.value;

  if (!userObject) res.status(403).json('access denied');

  // find one user with a given username
  const query = User.findOne({ 'username': userObject.username, 'deleted': false });

  // selecting the desired fields
  query.select('_id username password email admin');

  // execute the query
  query.exec(function (err, user) {

    if (err) {
      console.log('Error', err)
      res.status(400).json('Error login in...');
      return;
    }

    // Since passwords on the request are not yet encripted, we do a plain comparison
    // between the request password and the one on the database
    if (!user || !user.password || !passwordHash.verify(userObject.password, user.password)) {
      res.status(403).json('access denied');
      return;
    }

    // We remove the password from the user object after validating
    user.password = undefined;

    // We create a token with the user information
    var token = jwt.sign({ user }, config.secret, {
      expiresIn: 60 * 60 * 72 // Sets expiration in 3 days
    });

    // Return authentication succesfull and token
    res.json({
      success: true,
      message: 'Enjoy your stay!',
      token: token
    });

  })
}
