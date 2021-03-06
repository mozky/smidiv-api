const util = require('util')
const Vehiculo = require('../models/vehiculo')
const User = require('../models/user')
const Marca = require('../models/marca')
const config = require('../../config')

module.exports = {
    addVehiculo: function (req, res) {
        const vehiculoObject = req.swagger.params.vehiculo.value
        console.log(vehiculoObject);
        if (!vehiculoObject) res.status(400).json('Error')

        // we find the userId using the username from the request
        User.findOne({
                'username': vehiculoObject.username,
                'deleted': false
            })
            .select('_id vehiculo')
            .exec(function (err, user) {
                if (err || !user) {
                    console.log('Error fetching user, #addVehiculo', err)
                    res.status(400).json('Error fetching user')
                    return;
                }
                /*
                if (user.vehiculo) {
                    res.status(200).json({
                        success: true,
                        response: {
                            vehiculoId: user.vehiculo
                        }
                    })
                   
                }*/

                vehiculoObject.usuario = user._id

                Marca.findOne({
                    'nombre': vehiculoObject.marca,
                }).select('_id').exec(function (err, marca) {
                    if(err){
                        console.log("Error fetching marca , #addMarca", err)
                        res.status(400).json('Error obteniendo la marca')
                        return;
                    }

                    if (!marca) {
                        new Marca({
                            nombre: vehiculoObject.marca
                        }).save((err, newMarca) => {
                            if (err) {
                                res.status(400).json('Error creando marca')
                                return console.error(err)
                            }

                            vehiculoObject.marca = newMarca._id

                            new Vehiculo(vehiculoObject).save(function (err, nuevoVehiculo) {
                                if (err) {
                                    if (err.code == 11000) res.status(400).json('Vehiculo ya guardado')
                                    return console.error(err)
                                } else {
                                    console.log('New vehicle saved', nuevoVehiculo)
            
                                    user.vehiculo = nuevoVehiculo._id

                                    user.save((err, userWithVehicle) => {
                                        console.log('usuario update')
                                        res.json({
                                            success: true,
                                            response: nuevoVehiculo
                                        })
                                    })
                                }
                            })
                        })
                    }else{
                        vehiculoObject.marca = marca._id;

                            new Vehiculo(vehiculoObject).save(function (err, nuevoVehiculo) {
                                if (err) {
                                    if (err.code == 11000) res.status(400).json('Vehiculo ya guardado')
                                    return console.error(err)
                                } else {
                                    console.log('New vehicle saved', nuevoVehiculo)
            
                                    user.vehiculo = nuevoVehiculo._id

                                    user.save((err, userWithVehicle) => {
                                        res.json({
                                            success: true,
                                            response: nuevoVehiculo
                                        })
                                    })
                                }
                            })
                    }
                }
            )   
        })
    },
    getVehiclesList: function (req, res) {
        Vehiculo.find({
                deleted: false
            })
            .limit(50)
            // .sort({
            //     modelo: 1
            // })
            .populate({
                path: 'usuaio',
                select: '_id username'
            })
            .populate({
                path: 'marca',
                select: '_id nombre'
            })
            .select('_id modelo placas')
            .exec(function (err, vehicles) {
                res.json({
                    success: true,
                    response: {
                        vehiculos: vehicles
                    }
                })
            }
        )
    },
    getVehiculo: function(req, res){
            User.findOne({
                "username": req.swagger.params.usuario.value
            }).select("_id").exec(function(err,usuario){
                if(err || !usuario){
                    console.log("Error obteniendo al usuario");
                    res.status(400).json("error encontrando el usuario");
                }
                Vehiculo.findOne({
                    "usuario":usuario
                }).exec(function(err,auto){
                    if(err || !auto){
                        console.log({response:{msg: "error obteniendo el vehiculo"}});
                        res.json({
                            success: false, 
                            response:{
                                msg: "error obteniendo el vehiculo"
                            }
                        });
                    }
                    else{
                        console.log("sent");
                    res.json({
                        success: true,
                        response:{
                            vehiculo: auto
                        }
                    }
                )
                    }
                    
            })
        })
    },
    updateVehiculo: function(req, res) {
        const vehiculo = req.swagger.params.vehiculo.value

        if (!vehiculo) res.status(400).json('Error')

        const updates = {
            smidivID: vehiculo.smidivID,
            placas: vehiculo.placas,
            modelo: vehiculo.modelo,
            dateUpdated: new Date()
        }

        Marca.findOne({
            'nombre': vehiculo.marca,
        }).select('_id').exec(function (err, marca) {
            if(err){
                console.log("Error fetching marca, #updateVehiculo", err)
                res.status(400).json('Error obteniendo la marca')
                return
            }

            if (!marca) {
                new Marca({
                    nombre: vehiculo.marca
                }).save((err, newMarca) => {
                    if (err) {
                        res.status(400).json('Error creando marca, #updateVehiculo')
                        return console.error(err)
                    }

                    updates.marca = newMarca._id

                    Vehiculo.findOneAndUpdate({
                        _id: vehiculo.idVehiculo,
                    }, {
                        $set: updates
                    }, {
                        new: true
                    }, function (err, vehiculoActualizado) {
                        if (err || !vehiculoActualizado) {
                            res.status(500).json('Error actualizando vehiculo')
                            return console.error(err)
                        } else {
                            console.log(vehiculoActualizado)
                            res.json(vehiculoActualizado._id + ' actualizado')
                        }
                    })
                })
            } else {
                updates.marca = marca._id

                Vehiculo.findOneAndUpdate({
                    _id: vehiculo.idVehiculo,
                }, {
                    $set: updates
                }, {
                    new: true
                }, function (err, vehiculoActualizado) {
                    if (err || !vehiculoActualizado) {
                        res.status(500).json('Error actualizando vehiculo')
                        return console.error(err)
                    } else {
                        console.log(vehiculoActualizado)
                        res.json(vehiculoActualizado._id + ' actualizado')
                    }
                })
            }
        })
    }
}