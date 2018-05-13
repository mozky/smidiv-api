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
    ubicacionfav:{
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'UbicacionFav'
    },
    estado:{
        type:String,
    },
    rangoDistancia:{
        rango: Number,
    },
    rangoHorario:{
        inicio:{type: Date, default: 0},
        fin:{type: Date, default: 0}
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