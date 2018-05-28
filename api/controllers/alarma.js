'use strict';

const config = require('../../config') // get our config file
const Alarma = require('../models/alarma.js')
const User = require('../models/user.js')
const Vehiculo = require('../models/vehiculo.js')
const UbicacionFav = require('../models/ubicacionesFavoritas.js')

module.exports = {
    addAlarma: function(req, res) {
        const alertaObject = req.swagger.params.alarma.value
        if (!alertaObject) res.status(400).json('Error')

        User.findOne({
            'username': alertaObject.username,
            'deleted': false
        })
        .select('_id')
        .populate({
            path: 'vehiculo',
            select: '_id'
        })
        .exec(function (err, user) {
            if (err || !user) {
                console.log('Error fetching user, #addAlarma', err)
                res.status(400).json('Error fetching user')
                return
            }

            alertaObject.usuario = user._id
            alertaObject.vehiculo = user.vehiculo._id

            if (alertaObject.ubicacionFav) {
                UbicacionFav.findOne({
                    "idusuario": user._id,
                    "nombre": alertaObject.ubicacionFav,
                })
                .select('_id')
                .exec(function (err, ubi) {
                    if (err || !ubi) {
                        console.log('Error adding alarma, #addAlarma', err)
                        res.status(400).json('Error adding alarma')
                        return
                    }
    
                    alertaObject.ubicacionfav = ubi._id
                    alertaObject.rangoHorario = undefined
                    alertaObject.rangoDistancia = alertaObject.rangoDistancia ? alertaObject.rangoDistancia : 3
    
                    new Alarma(alertaObject).save(function (err, nuevaAlarma) {
                        if (err) {
                            if (err.code == 11000) res.status(400).json('Alarma ya guardada')
                            return console.error(err)
                        } else {
                            console.log('Nueva alarma tipo ubicacion guardada', nuevaAlarma)
                            res.json({
                                success: true,
                                response: nuevaAlarma
                            })
                        }
                    })
                })
            } else {
                new Alarma(alertaObject).save(function (err, nuevaAlarma) {
                    if (err) {
                        if (err.code == 11000) res.status(400).json('Alarma ya guardada')
                        return console.error(err)
                    } else {
                        console.log('Nueva alarma tipo ubicacion guardada', nuevaAlarma)
                        res.json({
                            success: true,
                            response: nuevaAlarma
                        })
                    }
                })
            }
        })
    },
    getAlarma: function(req, res)  {
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
                })
            })
        })
    },
    getAlarmasUsuario: function(req, res)  {
        User.findOne({
            'username': req.swagger.params.usuario.value,
            'deleted': false
        })
        .select('_id username email profile')
        .populate({
            path: 'vehiculo',
            select: '_id smidivID ',

        })
        .exec(function (err, user) {
            if (err) {
                console.log('Error #getAlarmaUsuario', err)
                return res.status(500).json('Server error')
            }

            if (!user || !user.vehiculo || !user.vehiculo._id) {
                return res.status(400).json('Cannot find user or vehicle')
            }

            Alarma.find({
                "usuario": user._id,
                "vehiculo": user.vehiculo._id,
                "deleted": false
            })
            .select('_id nombre estado rangoDistancia rangoHorario')
            .populate({
                path: 'ubicacionfav',
                select: '_id nombre ubicacion'
            })
            .exec(function (err, alarmas){
                if (err) {
                    console.log('Error #getAlarmaUsuario', err)
                    res.status(500).json('Error fetching alarmas')
                    return;
                }

                if (!alarmas) {
                    alarmas = []
                }

                res.status(200).json({
                    success: true,
                    response: {
                        alarmas
                    }
                })
            })
        })
    },
    deleteAlarma: function(req, res) {
        const { idAlarma } = req.swagger.params.alarma.value

        if (!idAlarma) res.status(400).json('Error')
        Alarma.findOneAndUpdate({
            _id: idAlarma
        }, {
            $set: {
                deleted: true,
                dateUpdated: new Date()
            }
        }, {
            new: true
        }, function (err, deletedAlarm) {
            if (err || !deletedAlarm) {
                res.status(500).json('Error deleting alarm')
                return console.error(err)
            } else {
                console.log(deletedAlarm)
                res.json(idAlarma + ' deleted')
            }
        })
    },
    updateAlarma: function (req, res) {
        const { idAlarma, nombre, estado } = req.swagger.params.alarma.value

        if (!idAlarma) res.status(400).json('Error')

        const updates = {
            fechaActualizacion: new Date()
        }

        if (nombre) 
            updates.nombre = nombre

        updates.estado = estado

        Alarma.findOneAndUpdate({
            _id: idAlarma
        }, {
            $set: updates
        }, {
            new: true
        }, function (err, updatedAlarma) {
            if (err || !updatedAlarma) {
                res.status(500).json('Error updating alarm')
                return console.error(err)
            } else {
                res.json(updatedAlarma.nombre + ' updated')
            }
        })
    },
}