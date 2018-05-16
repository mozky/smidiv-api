'use strict';

const config = require('../../config') // get our config file
const Alarma = require('../models/alarma.js')
const User = require('../models/user.js')
const Ubicacion = require('../models/ubicacionesFavoritas.js')
const Vehiculo = require('../models/vehiculo')
module.exports = {
    deleteUbicacionFav: function(req,res) {
        const ubicacionId = req.swagger.params.usuario.value

        if (!ubicacionId) res.status(400).json('Error')
        Ubicacion.findOneAndUpdate({
            _id: ubicacionId
        }, {
            $set: {
                deleted: true,
                dateUpdated: new Date()
            }
        }, {
            new: true
        }, function (err, deletedUbicacion) {
            if (err || !deletedUbicacion) {
                res.status(500).json('Error deleting ubicacion');
                return console.error(err);
            } else {
                console.log(deletedUbicacion);
                res.json(ubicacionId + ' deleted');
            }
        });
    },
    addUbicacionFav: function(req,res) {
        const ubicacionObject = req.swagger.params.ubicacionFav.value

        if (!ubicacionObject) res.status(400).json('Error')
        const user = User.findOne({ 
            'username': ubicacionObject.idUsuario,
            'deleted': false
        })
        .select('_id')
        .exec(function (err, user) {
            if (err || !user) {
                console.log('Error fetching user, #addUbicacion', err)
                res.status(400).json('Error fetching user')
                return
            }
            ubicacionObject.idusuario=user._id;
            new Ubicacion(ubicacionObject).save(function (err, nuevaUbicacion) {
                if (err) {
                    if (err.code == 11000) res.status(400).json('Ubicacion ya guardada')
                    return console.error(err)
                } else {
                    console.log('New ubicacion saved', nuevaUbicacion)

                    res.json({
                        success: true,
                        response: nuevaUbicacion
                    });
                }
            });
        });
    },
    getUbicacionFav: function(req, res) {
        const user = User.findOne({ 
            'username': req.swagger.params.usuario.value,
            'deleted': false
        })
        .select('_id')
        .exec(function (err, user) {
            if (err || !user) {
                console.log('Error fetching ususrio, #addUbicacionFav', err)
                res.status(400).json('Error fetching usuario')
                return
            }
            Ubicacion.find({
                'idusuario': user._id,
                'deleted': false
            }).exec(function (err, ubicacion){
                if(err||!ubicacion){
                    console.log('Error fetching vehiculo, #addUbicacion', err)
                    res.status(400).json('Error fetching ubicacion')
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
