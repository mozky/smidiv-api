var host = process.env.DB_HOST || 'localhost'
var port = process.env.DB_PORT || '27017'
var dbName = 'smidiv'

module.exports = {
  'secret': 'supersecretchickenhoney',
  'dbURL': `mongodb://${host}:${port}/${dbName}`,
  'firebase': {
    'key': 'get firebase key'
  }
}
