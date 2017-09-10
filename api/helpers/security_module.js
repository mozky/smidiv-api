const auth = require('basic-auth')
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/user.js');
const config = require('../../config'); // get our config file


module.exports = {

  // Handles API Basic Authentication protected URLs
  basicAuth: function (req, authOrSecDef, scopesOrApiKey, cb) {
    // Gets the name and pass from the request header
    const credentials = auth(req);

    if(!credentials || !credentials.name || !credentials.pass ) {
      cb(new Error('access denied'));
      return;
    }

    // find one user with a given username
    const query = User.findOne({ 'username': credentials.name });

    // selecting the desired fields
    query.select('-_id password ');

    // execute the query
    query.exec(function (err, user) {

      if (err) {
        console.log('Error', err);
        cb(new Error('access denied'));
        return;
      }

      // Since passwords on the request are not yet encripted, we do a plain comparison
      // between the request password and the one on the database
      if (!user || !user.password || !passwordHash.verify(credentials.pass, user.password)) {
        cb(new Error('access denied'));
        return;
      }

      // Authenticated succesfully
      cb(null);
    })

  },

  // Handles API Token Authentication for protected URLs
  tokenAuth: function (req, authOrSecDef, scopesOrApiKey, cb) {
    // Gets the name and pass from the request header
    const token = scopesOrApiKey;

    if (!token) {
      cb(new Error('access denied'));
      return;
    }

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      console.log(decoded)
      if (err) {
        return cb(new Error('access denied'));
      } else {
        // Authenticated succesfully
        console.log('Token decoded', decoded);
        cb(null);
      }
    })
  }

};
