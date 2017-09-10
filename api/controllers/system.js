'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/


module.exports = {
  health: function (req, res) {

      const status = {
          status: 'ok',
          systemTime: new Date()
      }

      res.json(status);
  }
};

