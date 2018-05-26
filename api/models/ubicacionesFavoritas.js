const Mongoose = require('../helpers/mongo_connector')
const db = Mongoose.db

const ubicacionFavoritas = db.Schema({
    idusuario:{
        type: db.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    nombre:{
        type: String,
        required: true,
    },
    ubicacion:{
        lat:{type: Number},
        lng:{type: Number}
    },
    fechaCreacion:{
        type:Date, default: Date.now
    },
    fechaActualizacion:{
        type:Date, default: Date.now
    },
    deleted: {
        type: Boolean, default: false
    }
})

const UbicacionFav = db.model('UbicacionFav', ubicacionFavoritas)
module.exports = UbicacionFav