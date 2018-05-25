const util = require('util')
const Vehiculo = require('../models/vehiculo')
const User = require('../models/user')
const Marca = require('../models/marca')
const config = require('../../config')

module.exports = {
    addVehiculo: function (req, res) {
        const vehiculoObject = req.swagger.params.vehiculo.value

        if (!vehiculoObject) res.status(400).json('Error')

        // we find the userId using the username from the request
        const user = User.findOne({
                'username': vehiculoObject.username,
                'deleted': false
            })
            .select('_id')
            .exec(function (err, user) {
                if (err || !user) {
                    console.log('Error fetching user, #addVehiculo', err)
                    res.status(400).json('Error fetching user')
                    return;
                }
                const marca = Marca.findOne({
                    'nombre': vehiculoObject.marca,
                }).select('_id').exec(function (err, marca){
                    if(err || !marca){
                        console.log("Error fetching marca , #addMarca", err)
                        res.status(400).json('Error obteniendo la marca')
                        return;
                    }
                    vehiculoObject.usuario = user._id
                    vehiculoObject.marca = marca._id
                    console.log(vehiculoObject.smidivID);
                new Vehiculo(vehiculoObject).save(function (err, nuevoVehiculo) {
                    if (err) {
                        if (err.code == 11000) res.status(400).json('Vehiculo ya guardado');
                        return console.error(err);
                    } else {
                        console.log('New vehicle saved', nuevoVehiculo)

                        res.json({
                            sucess: true,
                            response: nuevoVehiculo
                        })
                    }
                })
            })   
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
                    sucess: true,
                    response: {
                        vehiculos: vehicles
                    }
                })
            })
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
                        console.log("error obteniendo el vehiculo");
                        res.status(400).json("error en vehiculo");
                    }
                    console.log("sent");
                    res.json({
                            success: true,
                            response:{
                                vehiculo: auto
                            }
                    })
            })

        })
    }

}