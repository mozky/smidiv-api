const Mongoose = require('../helpers/mongo_connector')
const db = Mongoose.db;

const obdSchema = db.Schema({
    smidivID:{
               type: String
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