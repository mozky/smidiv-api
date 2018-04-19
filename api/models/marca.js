const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const marcaSchema = db.Schema({
    nombre: {type: String, required: true, unique: true},
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now }
});

const Marca = db.model('Marca', marcaSchema);

module.exports = Marca;