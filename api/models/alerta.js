const Mongoose = require('../helpers/mongo_connector')
const db = Mongoose.db

const alertaSchema = db.Schema({
    userId: {
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    vehiculoId: {
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehiculo'
    },
    alarmaId: {
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'Alarma'
    },
    ubicacionId: {
        type: db.Schema.Types.ObjectId,
        requiered: true,
        ref: 'Ubicacion'
    },
    tipo: {
        type: String,
        required: true
    },
    valor: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
})

const Alerta = db.model('Alerta', alertaSchema)

module.exports = Alerta