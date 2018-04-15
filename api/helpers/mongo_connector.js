const MONGO_URL = process.env.MONGO_URL ? process.env.MONGO_URL : 'localhost'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${MONGO_URL}:27017/smidiv`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connected to MongoDB...')
});

module.exports = {
  db: mongoose,
  state: mongoose.connection.readyState
};
