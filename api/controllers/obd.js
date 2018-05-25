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
            'smidivID': obdObject.smidivID
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

    },
    getOBD: function(req, res){
        //var obdobject = req.swagger.params.vehiculo.value
        const obd = Vehiculo.findOne({
            'placas': req.swagger.params.vehiculo.value
        })
        .select('smidivID')
        .exec(function (err, vehi) {
            if (err || !vehi) {
                console.log('Error fetching vehicle, #getOBD', err)
                res.status(400).json('Error fetching vehicle')
                return;
            }
            console.log(vehi);
            Obd.findOne({
                "smidivID": vehi.smidivID,
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching obd, #getOBD', err)
                    res.status(400).json('Error fetching OBD')
                    return;
                }
                res.status(200).json({
                    success: true,
                    response: {
                        ubicaciones: ubicacion
                    }
                });
            });

        });
    }
}