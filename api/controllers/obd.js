'use strict';

const util = require('util');
const Vehiculo = require('../models/vehiculo');
const config = require('../../config'); // get our config file
const Obd = require('../models/obd')

module.exports = {
    addOBD: function(req, res){
        const obdObject = req.swagger.params.obd.value;

        if (!obdObject) res.status(400).json('Error');
        const vehiculo = Vehiculo.findOne({
            'placas': obdObject.idAutomovil
        })
        .select('_id')
        .exec(function (err, vehiculo) {
            if (err || !vehiculo) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json('Error fetching vehicle')
                return;
            }
            obdObject.vehiculo=vehiculo._id;
            new Obd(obdObject).save(function(err,nobd){
                if (err) {
                    if (err.code == 11000) res.status(400).json('Ubicacion ya guardada');
                    return console.error(err);
                } else {
                    console.log('New obd saved', nobd)

                    res.json({
                        sucess: true,
                        response: nobd
                    });
                }
            })

        });

    }
}