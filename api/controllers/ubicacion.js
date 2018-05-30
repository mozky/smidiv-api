'use strict'

const admin = require('firebase-admin')
const FCM = require('fcm-node')
const turf = require ('turf')

const config = require('../../config') // get our config file
const Alarma = require('../models/alarma.js')
const User = require('../models/user.js')
const Vehiculo = require('../models/vehiculo.js')
const Ubicacion = require('../models/ubicacion.js')
const UbicacionFav = require('../models/ubicacionesFavoritas.js')


const fcm = new FCM(config.firebase.key)

module.exports = {
    addUbicacion: function(req,res) {

        const ubicacionObject = req.swagger.params.ubicacion.value
        if (!ubicacionObject) res.status(400).json('Error')

        Vehiculo.findOne({
            'smidivID': ubicacionObject.smidivID
        })
        .populate({
            path: 'usuario',
            select: '_id username'
        })
        .exec(function (err, vehiculo) {
            if (err || !vehiculo) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json('Error fetching vehicle')
                return
            }

            ubicacionObject.idAutomovil=vehiculo._id

            // Guardamos la ubicacion
            new Ubicacion(ubicacionObject).save(function (err, nuevaUbicacion) {
                if (err) {
                    if (err.code == 11000) res.status(400).json('Ubicacion ya guardada')
                    return console.error(err)
                } else {
                    console.log('Nueva ubicacion guardada', nuevaUbicacion)

                    res.json({
                        success: true,
                        response: nuevaUbicacion
                    })
                }
            })

            // Buscamos las alarmas activas para dicho usuario/vehiculo
            Alarma.find({
                "usuario": vehiculo.usuario._id,
                "vehiculo": vehiculo._id,
                "estado": true
            }).exec(function(err,alarms) {
                console.log(alarms)
                // console.log("alarma" + alarm.rangoDistancia.rango)
                //TODO: No deberiamos buscar todas las ubicaciones favs?
                // UbicacionFav.findOne({
                //     "idusuario": vehiculo.usuario._id
                // })
                // .exec(function(err, fav){
                //     const P1 = turf.point([fav.ubicacion.lat, fav.ubicacion.lng])
                //     const P2 = turf.point([ubicacionObject.ubicacion.lat, ubicacionObject.ubicacion.lng])
                //     const distanciaP1P2 = turf.distance(P1, P2, 'kilometers')
                    
                //     if (distance > alarm.rangoDistancia.rango) {

                //         console.log('Enviando notificacion de alarma activada por distancia')
                //         const message = {
                //             to: '/topics/' + vehiculo.usuario.username,
                //             notification: {
                //                 title: 'Notificacion SMIDIV!', 
                //                 body: 'Tu Vehiculo ha salido de el rango definido' 
                //             },
                //             // También podemos enviar datos
                //             // data: {
                //             //     my_key: 'my value',
                //             //     my_another_key: 'my another value'
                //             // }
                //         }

                //         // Enviando notificacion
                //         fcm.send(message, function(err, response){
                //             if (err) {
                //                 console.log("Something has gone wrong!")
                //             } else {
                //                 console.log("Successfully sent with response: ", response)
                //             }
                //         })
                //     }
                // })
            })
        })
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
                return
            }
            Ubicacion.findOne({
                "idAutomovil": vehi._id,
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching vehiculo, #addUbicacion', err)
                    res.status(400).json('Error fetching vehicle')
                    return
                }
                res.status(200).json({
                    success: true,
                    response: {
                        ubicaciones: ubicacion
                    }
                })
            })
        })
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
                return
            }
            Ubicacion.find({
                "idAutomovil": vehi._id,
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching vehiculo, #addUbicacion', err)
                    res.status(400).json('Error fetching vehicle')
                    return
                }
                res.status(200).json({
                    success: true,
                    response: {
                        ubicaciones: ubicacion
                    }
                })
            })
        })
    }
}