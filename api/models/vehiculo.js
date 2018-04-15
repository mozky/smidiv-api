const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const vehiculoSchema = db.Schema({
    usuario: {
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    marca: {
        type: db.Schema.Types.ObjectId,
        ref: 'Marca'
    },
    modelo: {
        type: String
    },
    codigoOBD: {
        tipo:{type: String},
        value:{type: String}
    },
    placas:{type: String},
    deleted: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }
});

const Vehiculo = db.model('Vehiculo', vehiculoSchema);
module.exports = Vehiculo;