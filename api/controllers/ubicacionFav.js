'use strict'

const config = require('../../config') // get our config file
const Alarma = require('../models/alarma.js')
const User = require('../models/user.js')
const UbicacionFav = require('../models/ubicacionesFavoritas.js')
const Vehiculo = require('../models/vehiculo')

module.exports = {
    updateUbicacionFav: function (req, res) {
        const { idUbicacion, nombre, ubicacion } = req.swagger.params.ubicacionFav.value

        if (!idUbicacion) res.status(400).json('Error')

        const updates = {
            fechaActualizacion: new Date()
        }

        if (nombre) 
            updates.nombre = nombre

        if (ubicacion.lat && ubicacion.lng)
            updates.ubicacion = ubicacion

        UbicacionFav.findOneAndUpdate({
            _id: idUbicacion
        }, {
            $set: updates
        }, {
            new: true
        }, function (err, updatedUbicacion) {
            if (err || !updatedUbicacion) {
                res.status(500).json('Error updating ubicacion')
                return console.error(err)
            } else {
                console.log(updatedUbicacion);
                res.json(updatedUbicacion.nombre + ' updated')
            }
        })
    },
    deleteUbicacionFav: function(req,res) {
        const { idUbicacion } = req.swagger.params.ubicacionFav.value

        if (!idUbicacion) res.status(400).json('Error')
        UbicacionFav.findOneAndUpdate({
            _id: idUbicacion
        }, {
            $set: {
                deleted: true,
                dateUpdated: new Date()
            }
        }, {
            new: true
        }, function (err, deletedUbicacion) {
            if (err || !deletedUbicacion) {
                res.status(500).json('Error deleting ubicacion')
                return console.error(err)
            } else {
                console.log(deletedUbicacion)
                res.json(idUbicacion + ' deleted')
            }
        })
    },
    addUbicacionFav: function(req,res) {
        const ubicacionObject = req.swagger.params.ubicacionFav.value

        if (!ubicacionObject) res.status(400).json('Error')
        User.findOne({ 
            'username': ubicacionObject.idUsuario,
            'deleted': false
        })
        .select('_id')
        .exec(function (err, user) {
            if (err || !user) {
                console.log('Error fetching user, #addUbicacionFav', err)
                res.status(400).json('Error fetching user')
                return
            }
            ubicacionObject.idusuario = user._id
            new UbicacionFav(ubicacionObject).save(function (err, nuevaUbicacion) {
                if (err) {
                    if (err.code == 11000) res.status(400).json('Ubicacion ya guardada')
                    return console.error(err)
                } else {
                    console.log('New ubicacion saved', nuevaUbicacion)

                    res.json({
                        success: true,
                        response: nuevaUbicacion
                    })
                }
            })
        })
    },
    getUbicacionFav: function(req, res) {
        User.findOne({ 
            'username': req.swagger.params.usuario.value,
            'deleted': false
        })
        .select('_id')
        .exec(function (err, user) {
            if (err || !user) {
                console.log('Error fetching usuario, #getUbicacionFav', err)
                res.status(400).json('Error fetching usuario')
                return
            }
            UbicacionFav.find({
                'idusuario': user._id,
                'deleted': false
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching ubicaciones, #getUbicacionFav', err)
                    res.status(400).json('Error obteniendo ubicaciones')
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
