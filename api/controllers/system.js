'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

const database = require('../helpers/mongo_connector')

module.exports = {
  health: function (req, res) {

      const status = {
          status: database.state == 2 ? 'ok': 'failing',
          database: database.state,
          systemTime: new Date()
      }

      res.json(status);
  }
};

