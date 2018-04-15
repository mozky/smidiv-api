const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const alarmaSchema = db.Schema({
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
        rango: Number,
        ubic :{
            lat :{ type: Number},
            lon :{type: Number}
        }
    },
    rangoHorario:{
        inicio:{type: Number, default: 0},
        fin:{type: Number, default: 0}
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