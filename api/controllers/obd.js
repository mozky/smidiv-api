'use strict'

const admin = require('firebase-admin')
const FCM = require('fcm-node')
const turf = require ('turf')
const util = require('util')

const Vehiculo = require('../models/vehiculo')
const config = require('../../config') // get our config file
const Obd = require('../models/obd')
const Ubicacion = require('../models/ubicacion.js')
const Alarma = require('../models/alarma.js')
const User = require('../models/user.js')
const UbicacionFav = require('../models/ubicacionesFavoritas.js')

// TODO: Add this to config file
const CheckAlarmsAndSend = require('../helpers/alarm_sender')
const fcm = new FCM('AAAAyfccUwk:APA91bHAfibQ-MxQBEPWivTZvovyPPKHLlaVquksczuJJLJsgHtIEk0Md4E2Ia8M4kDm9qlcQGjy2eigkqomS-C_Ze_BIe9zoJp1fiqJ4WfCJACSOzltBGPbte_69TPTvfSkXnKzDrf9')


module.exports = {
    addOBD: function(req, res) {
        const obdObject = req.swagger.params.obd.value
        if (!obdObject) res.status(400).json('Error')

        Vehiculo.findOne({
            smidivID: obdObject.smidivID
        })
        .exec(function (err, vehiculo) {
            if (err || !vehiculo) {
                console.log('Error fetching vehiculo, #addUbicacion', err)
                res.status(400).json(`Error encontrando el vehículo del SMIDIV ID: ${obdObject.smidivID}`)
                return
            }
           
            obdObject.PID.map(x => {
                if (x.lat) {
                    const ubicacionObject = {
                        idAutomovil: vehiculo._id,
                        fechaCreacion: new Date(),
                        ubicacion: {
                            lat: x.lat,
                            lng: x.lng,
                        }
                    }

                    new Ubicacion(ubicacionObject).save(function (err, nuevaUbicacion) {
                        if (err) {
                            if (err.code == 11000) res.status(400).json('Ubicacion ya guardada')
                            return console.error(err)
                        } else {
                            console.log('New ubicacion saved', nuevaUbicacion)
                            CheckAlarmsAndSend(ubicacionObject.idAutomovil, vehiculo.usuario, nuevaUbicacion)
                        }
                    })
                } else if (x.tipo) {
                    const obd = {
                        smidivID: obdObject.smidivID,
                        tipo: x.tipo,
                        valor: x.valor
                    }
    
                    new Obd(obd).save(function(err, newOBD){
                        if (err) {
                            if (err.code == 11000) res.status(400).json('Ubicacion ya guardada')
                            return console.error(err)
                        } else {
                            console.log('New obd saved', newOBD)
                        }
                    })
                }
            })

            res.json({
                success: true,
                response: {
                    PID: ''
                }
            })
        })
    },
    getOBD: function(req, res) {
        //var obdobject = req.swagger.params.vehiculo.value
        const obd = Vehiculo.findOne({
            'placas': req.swagger.params.vehiculo.value
        })
        .select('smidivID')
        .exec(function (err, vehi) {
            if (err || !vehi) {
                console.log('Error fetching vehicle, #getOBD', err)
                res.status(400).json('Error fetching vehicle')
                return
            }
            console.log(vehi)
            Obd.find({
                "smidivID": vehi.smidivID,
            }).exec(function (err, pid){
                if(err||!pid){
                    console.log('Error fetching obd, #getOBD', err)
                    res.status(400).json('Error fetching OBD')
                    return
                }
                res.status(200).json({
                    success: true,
                    response: {
                        OBD:pid
                    }
                })
            })
        })
    }
}