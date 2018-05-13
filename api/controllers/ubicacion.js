'use strict';

const config = require('../../config'); // get our config file
const Alarma = require('../models/alarma.js');
const User = require('../models/user.js');
const Vehiculo = require('../models/vehiculo.js');
const Ubicacion = require('../models/ubicacion.js');
const Ubicacion1 = require('../models/ubicacionesFavoritas.js');
var FCM = require('fcm-node');
//var serverKey = ('../../google-services.json'); //put your server key here
var serverKey = '';

//var serviceAccount = require('path/to/serviceAccountKey.json');
var turf = require ('turf');    
var admin = require('firebase-admin');
var fcm = new FCM(serverKey);


 

module.exports = {
    addUbicacion: function(req,res){

        const ubicacionObject = req.swagger.params.ubicacion.value;
        if (!ubicacionObject) res.status(400).json('Error');
        const vehiculo = Vehiculo.findOne({
            'smidivID': ubicacionObject.smidivID
        })
        .select('_id usuario')
        .exec(function (err, vehiculo) {
            if (err || !vehiculo) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json('Error fetching vehicle')
                return;
            }
            ubicacionObject.idAutomovil=vehiculo._id;
            const ala = Alarma.findOne({
                "usuario": vehiculo.usuario
            }).exec(function(err,alarm){
                console.log("alarma"+alarm.rangoDistancia.rango);
                const ub= Ubicacion1.findOne({
                    "idusuario":vehiculo.usuario
                })
                .exec(function(err, fav){
    
                    var uno = turf.point([fav.ubicacion.lat, fav.ubicacion.lat]);
                    //console.log(fav);
                    var dos = turf.point([ubicacionObject.ubicacion.lat, ubicacionObject.ubicacion.lon]);
                    var options = {units: 'kilometers'};
                    var distance = turf.distance(uno, dos, 'kilometers');
                    if (distance>alarm.rangoDistancia.rango){
                        const Usuario = User.findOne({
                            "_id":vehiculo.usuario
                        }).exec(function(err,topic){
                            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                to: '/topics/'+topic.username,
                                
                                notification: {
                                    title: 'Notificacion SMIDIV!', 
                                    body: 'Tu Vehiculo ha salido de el rango definido' 
                                },
                                
                                data: {  //you can send only notification or only data(or include both)
                                    my_key: 'my value',
                                    my_another_key: 'my another value'
                                }
                            };
                            fcm.send(message, function(err, response){
                                if (err) {
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", response);
                                }
                            });
                        });   
                    }
                });
            });
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