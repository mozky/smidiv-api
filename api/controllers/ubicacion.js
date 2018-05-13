'use strict';

const config = require('../../config'); // get our config file
const Alarma = require('../models/alarma.js');
const User = require('../models/user.js');
const Vehiculo = require('../models/vehiculo.js');
const Ubicacion = require('../models/ubicacion.js');
var FCM = require('fcm-node');
var serverKey = ('../../google-services.json'); //put your server key here
var turf = ('turf');    
var fcm = new FCM(serverKey);
 
module.exports = {
    addUbicacion: function(req,res){

        const ubicacionObject = req.swagger.params.ubicacion.value;
        if (!ubicacionObject) res.status(400).json('Error');
        const vehiculo = Vehiculo.findOne({
            'smidivID': ubicacionObject.smidivID
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
                    
               /* var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: 'registration_token', 
                    collapse_key: 'your_collapse_key',
                    
                    notification: {
                        title: 'Title of your push notification', 
                        body: 'Body of your push notification' 
                    },
                    
                    data: {  //you can send only notification or only data(or include both)
                        my_key: 'my value',
                        my_another_key: 'my another value'
                    }
                }
                
                fcm.send(message, function(err, response){
                    if (err) {
                        console.log("Something has gone wrong!")
                    } else {
                        console.log("Successfully sent with response: ", response)
                    }
                })*/
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
            Ubicacion.findOne({
                "idAutomovil": vehi._id,
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching vehiculo, #addUbicacion', err)
                    res.status(400).json('Error fetching vehicle')
                    return;
                }
                res.status(200).json({
                    sucess: true,
                    response: {
                        ubicaciones: ubicacion
                    }
                });
            });

        });
    },
    getUbicaciones: function(req, res){

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
                    sucess: true,
                    response: {
                        ubicaciones: ubicacion
                    }
                });
            });

        });
        //deberia tener un rango, chance un dia
       
    }
}