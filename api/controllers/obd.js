'use strict';

const util = require('util');
const admin = require('firebase-admin')
const FCM = require('fcm-node')
const turf = require ('turf')

const Vehiculo = require('../models/vehiculo');
const config = require('../../config'); // get our config file
const Obd = require('../models/obd');
const Ubicacion = require('../models/ubicacion.js');
const Alarma = require('../models/alarma.js')
const User = require('../models/user.js')
const UbicacionFav = require('../models/ubicacionesFavoritas.js')
var fcm = new FCM('AAAAyfccUwk:APA91bHAfibQ-MxQBEPWivTZvovyPPKHLlaVquksczuJJLJsgHtIEk0Md4E2Ia8M4kDm9qlcQGjy2eigkqomS-C_Ze_BIe9zoJp1fiqJ4WfCJACSOzltBGPbte_69TPTvfSkXnKzDrf9');
module.exports = {
    addOBD: function(req, res){
        const obdObject = req.swagger.params.obd.value;
        const ubicacion = JSON.parse('{"ubicacion":{"smidivID":"ABC123","lat":0,"lng":0}}');
        if (!obdObject) res.status(400).json('Error');
        const vehiculo = Vehiculo.findOne({
            'smidivID': obdObject.smidivID
        })
        .exec(function (err, vehiculo) {
            console.log("vehiculo"+vehiculo);
            if (err || !vehiculo) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json('Error fetching vehicle')
                return;
            }
            obdObject.vehiculo=vehiculo._id;
            obdObject.idAutomovil=vehiculo._id;
            ubicacion.idAutomovil=vehiculo._id;
           
            obdObject.PID.map(function(x){
                if(x.lat){    
                    
                    ubicacion.ubicacion.lat = x.lat;
                    ubicacion.ubicacion.lng= x.lng; 
                    const ala = Alarma.findOne({
                        "usuario": vehiculo.usuario
                        }).exec(function(err,alarm){
                            if(err){
                                console.log('Error fetching vehiculo, #addUbicacion', err)
                                res.status(400).json('Error encontrando usuario')
                            }
                            console.log("alarma   "+alarm);
                            const ub= UbicacionFav.findOne({
                                "idusuario":vehiculo.usuario
                            })
                            .exec(function(err, fav){
                                if(err){
                                    console.log('Error fetching vehiculo, #addUbicacion', err)
                                    res.status(400).json('Error encontrando usuario')
                                }
                                console.log(fav);
                                var uno = turf.point([fav.ubicacion.lat, fav.ubicacion.lng]);
                                //console.log(fav);
                                var dos = turf.point([ubicacion.ubicacion.lat, ubicacion.ubicacion.lng]);
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
                        })
                    }); 
                    console.log("hola");
                    new Ubicacion(ubicacion).save(function (err, nuevaUbicacion) {
                        if (err) {
                            if (err.code == 11000) res.status(400).json('Ubicacion ya guardada')
                            return console.error(err)
                        } else {
                            console.log('New ubicacion saved', nuevaUbicacion)
                        }
                    })

                }


                obdObject.tipo = x.tipo;
                obdObject.valor = x.valor;
                new Obd(obdObject).save(function(err,nobd){
                    if (err) {
                        if (err.code == 11000) res.status(400).json('Ubicacion ya guardada');
                        return console.error(err);
                    } else {
                        console.log('New obd saved', nobd)
                    }
                })
            })
            res.json({
                success: true,
                response: {
                    PID:obdObject.PID
                }
            });

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
            Obd.find({
                "smidivID": vehi.smidivID,
            }).exec(function (err, pid){
                if(err||!pid){
                    console.log('Error fetching obd, #getOBD', err)
                    res.status(400).json('Error fetching OBD')
                    return;
                }
                res.status(200).json({
                    success: true,
                    response: {
                        OBD:pid
                    }
                });
            });

        });
    }
}