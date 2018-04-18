const Mongoose = require('../helpers/mongo_connector')
const db = Mongoose.db;

const obdSchema = db.Schema({
    vehiculo:{
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehiculo'
    },
    tipo:{
        type: String
    },
    valor:{
        type: String
    }
});

const OBD = db.model('OBD',obdSchema);

module.exports = OBD;