var address = process.env.DB_PORT_27017_TCP_ADDR || 'localhost'
var port = process.env.DB_PORT_27017_TCP_PORT || '27017'
var dbName = 'smidiv'

module.exports = {
  'secret': 'supersecretchickenhoney',
  'dbURL': `mongodb://${address}:${port}/${dbName}` 
}
