'use strict';

const util = require('util');
const Vehiculo = require('../models/vehiculo');
const User = require('../models/user')
const config = require('../../config'); // get our config file

module.exports = {
    addVehiculo: function (req, res) {
        const vehiculoObject = req.swagger.params.vehiculo.value;

        if (!vehiculoObject) res.status(400).json('Error');

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

                vehiculoObject.usuario = user._id

                new Vehiculo(vehiculoObject).save(function (err, nuevoVehiculo) {
                    if (err) {
                        if (err.code == 11000) res.status(400).json('Vehiculo ya guardado');
                        return console.error(err);
                    } else {
                        console.log('New vehicle saved', nuevoVehiculo)

                        res.json({
                            sucess: true,
                            response: nuevoVehiculo
                        });
                    }
                });
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
                path: 'usuario',
                select: '_id username'
            })
            // .populate({
            //     path: 'marca',
            // })
            .select('-_id modelo codigoOBD')
            .exec(function (err, vehicles) {
                res.json({
                    sucess: true,
                    response: {
                        vehiculos: vehicles
                    }
                })
            });
    }
}