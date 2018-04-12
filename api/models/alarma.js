const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const alarmaSChema = db.Schema({
    usuario: {
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    vehiculo:{
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehiculo'
    },
    tipo:{
        type: String,
    },
    estado:{
        type:String,
    },
    rangoDistancia:{
        type: Number,
    },
    rangoHorario:{
        type: db.Schema.Types,ObjectId,
        required: true,
    },
    fechaCreacion:{
        type: Date, default: Date.now
    },
    fechaActualizacion:{
        type: Date, default: Date.now
    }

});

const Alarma = db.model('Alarma', alarmaSchema);

module.exports = Alarma;