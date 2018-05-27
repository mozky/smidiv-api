const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const userSchema = db.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, match: /.+@.+/ },
  admin: { type: Boolean, default: false },
  profile: {
    firstName: String,
    lastName: String,
    birthday: Date,
  },
  vehiculo: {
    type: db.Schema.Types.ObjectId,
    ref: 'Vehiculo'
  },
  deleted: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now }
});

// TODO: Fix this, it is not working and helps a lot
// // change the dateUpdated field to current date on before each save
// userSchema.pre('save', function(next) {
//   console.log('previous save')
//   this.dateUpdated = new Date();
//   next();
// });

const User = db.model('User', userSchema);

module.exports = User;
