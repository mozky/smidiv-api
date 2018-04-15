'use strict';

const config = require('../../config'); // get our config file
const Alarma = require('../models/alarma.js');
const User = require('../models/user.js');
const Vehiculo = require('../models/vehiculo.js')

module.exports = {
    addAlarma: function(req,res){
        const alertaObject = req.swagger.params.alarma.value;

        if (!alertaObject) res.status(400).json('Error');

        // we find the userId using the username from the request
        const user = User.findOne({
                'username': alertaObject.username,
                'deleted': false
            })
            .select('_id')
            .exec(function (err, user) {
                if (err || !user) {
                    console.log('Error fetching user, #addVehiculo', err)
                    res.status(400).json('Error fetching user')
                    return;
                }
                const vehiculo = Vehiculo.findOne({
                    'placas':alertaObject.vehiculo,
                }).select('_id').exec(function (err, auto){
                    if(err || !auto){
                        console.log("Error fetching auto , #addMarca", err)
                        res.status(400).json('Error obteniendo el auto')
                        return;
                    }
                    alertaObject.usuario = user._id
                    alertaObject.vehiculo = auto._id

                new Alarma(alertaObject).save(function (err, nuevaAlarma) {
                    if (err) {
                        if (err.code == 11000) res.status(400).json('Alerta ya guardada');
                        return console.error(err);
                    } else {
                        console.log('New alarma saved', nuevaAlarma)

                        res.json({
                            sucess: true,
                            response: nuevaAlarma
                        });
                    }
                });
                })

                
            })
    },
}