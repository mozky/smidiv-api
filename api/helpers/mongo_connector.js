const config = require('../../config')

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.dbURL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connected to MongoDB...')
});

module.exports = {
  db: mongoose,
  state: mongoose.connection.readyState
};
