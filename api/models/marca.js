const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const marcaSchema = db.Schema({
    marca:{type: String, required:true, unique: true},
});

const Marca = db.model('Marca',marcaSchema);

module.exports = Marca;