const Mongoose = require('../helpers/mongo_connector')
const db = Mongoose.db

const alarmaSchema = db.Schema({
    usuario: {
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    vehiculo: {
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehiculo'
    },
    ubicacionfav: {
        type: db.Schema.Types.ObjectId,
        ref: 'UbicacionFav'
    },
    estado: {
        type: Boolean,
        default: true
    },
    nombre: {
        type: String
    },
    rangoDistancia: {
        rango: Number,
        default: 0
    },
    rangoHorario: {
        inicio: String,
        fin: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date, default: Date.now
    },
    fechaActualizacion: {
        type: Date, default: Date.now
    }
})

const Alarma = db.model('Alarma', alarmaSchema)

module.exports = Alarma