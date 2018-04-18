'use strict';

const config = require('../../config'); // get our config file
const Alarma = require('../models/alarma.js');
const User = require('../models/user.js');
const Vehiculo = require('../models/vehiculo.js');
const Ubicacion = require('../models/ubicacion.js');

module.exports = {
    addUbicacion: function(req,res){

        const ubicacionObject = req.swagger.params.ubicacion.value;
        if (!ubicacionObject) res.status(400).json('Error');
        const vehiculo = Vehiculo.findOne({
            'placas': ubicacionObject.idAutomovil
        })
        .select('_id')
        .exec(function (err, vehiculo) {
            if (err || !vehiculo) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json('Error fetching vehicle')
                return;
            }
            ubicacionObject.idAutomovil=vehiculo._id;
            new Ubicacion(ubicacionObject).save(function (err, nuevaUbicacion) {
                if (err) {
                    if (err.code == 11000) res.status(400).json('Ubicacion ya guardada');
                    return console.error(err);
                } else {
                    console.log('New ubicacion saved', nuevaUbicacion)

                    res.json({
                        sucess: true,
                        response: nuevaUbicacion
                    });
                }
            });
        });
    },
    getUbicacion: function(req, res){
        const ubicacionObject = req.swagger.params.ubicacion.value;
        const vehiculo = Vehiculo.findOne({
            'placas': ubicacionObject.idAutomovil
        })
        .select('_id')
        .exec(function (err, user) {
            if (err || !user) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json('Error fetching vehicle')
                return;
            }
            Ubicacion.findOne({
                "idAutomovil": vehiculo._id,
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching vehiculo, #addUbicacion', err)
                    res.status(400).json('Error fetching vehicle')
                    return;
                }
                res.json({
                    sucess: true,
                    response: {
                        ubicaciones: ubicacion
                    }
                });
            });

        });
    },
    getUbicaciones: function(req, res){
        //deberia tener un rango, chance un dia
    }
}