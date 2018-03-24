const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const vehiculoSchema = db.Schema({
    id_usuario: {type: db.Schema.Types.ObjectId},
    marca: {type: String},
    idMarca: {type:String},
    modelo: {type: String},
    codigoOBD: { nombre : String , valor: String},
    fechaCreacion: {type: String, default: Date.now},
    fechaActualización: {type: Date, default: Date.now},
  
  });

const vehiculo = db.model('vehiculo', vehiculoSchema);
module.exports = vehiculo;