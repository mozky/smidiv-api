const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const ubicacionFavoritas = db.Schema({
    idusuario:{
        type: db.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    ubicacion:{
        type: db.Schema.Types.ObjectId,
    },
    fechaCreacion:{
        type:Date, default: Date.now
    },
    fechaActualizacion:{
        type:Date, default: Date.now
    }
});
const UbicacionFav = db.model('UbicacionFav', ubicacionFavoritas);
module.exports = UbicacionFav;