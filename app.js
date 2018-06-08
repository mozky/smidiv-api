'use strict';

if (process.env.NODE_ENV == 'production') {
  console.log('Running in production mode...')
}

var SwaggerExpress = require('swagger-express-mw')
var app = require('express')()
module.exports = app // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: require('./api/helpers/security_module')
}

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.API_PORT || 10010;
  var host = process.env.API_HOST || 'localhost'
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/health']) {
    console.log(
        `try this: 
            curl http://${host}:${port}/health`
    )
  }
})
