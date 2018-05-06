const Mongoose = require('../helpers/mongo_connector');
const db = Mongoose.db;

const smidividSCHEMA = db.Schema({
    clave: {type: String, required: true, unique: true},
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now }
});

const SMIVIDID = db.model('SMIDIVID', smidividSCHEMA);

module.exports = SMIVIDID;