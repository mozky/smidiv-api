const Mongoose = require('../helpers/mongo_connector')
const db = Mongoose.db;


const ubicacionSchema = db.Schema({
    idAutomovil:{
        type: db.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehiculo'
    },
    ubicacion:{
        lat:{type: Number},
        lon:{type: Number}
    },  
    fechaCreacion:{
        type: Date, default: Date.now
    },
});

const Ubicacion = db.model('Ubicacion',ubicacionSchema);

module.exports = Ubicacion;