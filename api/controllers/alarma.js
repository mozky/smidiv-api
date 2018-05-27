'use strict';

const config = require('../../config'); // get our config file
const Alarma = require('../models/alarma.js');
const User = require('../models/user.js');
const Vehiculo = require('../models/vehiculo.js');
const Ubicacion = require('../models/ubicacionesFavoritas.js');

module.exports = {
    addAlarma: function(req,res){
        const alertaObject = req.swagger.params.alarma.value;
        //console.log(alertaObject);
        if (!alertaObject) res.status(400).json('Error');

        // we find the userId using the username from the request
        const user = User.findOne({
                'username': alertaObject.username,
                'deleted': false
            })
            .select('_id')
            .exec(function (err, user) {
                if (err || !user) {
                    console.log('Error fetching user, #addVehiculo', err)
                    res.status(400).json('Error fetching user')
                    return;
                }
                const vehiculo = Vehiculo.findOne({
                    'placas':alertaObject.vehiculo,
                }).select('_id').exec(function (err, auto){
                    if(err || !auto){
                        console.log("Error fetching auto , #addMarca", err)
                        res.status(400).json('Error obteniendo el auto')
                        return;
                    }
                    Ubicacion.findOne({
                        "nombre": alertaObject.ubicacionfav,
                    }).select('_id').exec(function (err, ubi){
                        if(err||!ubi){
                            console.log('Error fetching vehiculo, #addUbicacion', err)
                            res.status(400).json('Error fetching ubicacion')
                            return;
                        }
                        console.log("hola");
                        console.log(ubi._id);
                        alertaObject.usuario = user._id;
                        alertaObject.vehiculo = auto._id;
                        alertaObject.ubicacionfav = ubi.id;
                        new Alarma(alertaObject).save(function (err, nuevaAlarma) {
                            if (err) {
                                if (err.code == 11000) res.status(400).json('Alerta ya guardada');
                                return console.error(err);
                            } else {
                                console.log('New alarma saved', nuevaAlarma)
        
                                res.json({
                                    success: true,
                                    response: nuevaAlarma
                                });
                            }
                        });
                    });
                    

                
                })

                
            })
    },
    getAlarma(){
        const vehiculo = Vehiculo.findOne({
            'placas': req.swagger.params.vehiculo.value
        })
        .select('_id')
        .exec(function (err, vehi) {
            if (err || !vehi) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json('Error fetching vehicle')
                return;
            }
            Ubicacion.find({
                "idAutomovil": vehi._id,
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching vehiculo, #addUbicacion', err)
                    res.status(400).json('Error fetching vehicle')
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