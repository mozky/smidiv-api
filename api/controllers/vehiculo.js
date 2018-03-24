'use strict';

const util = require('util');
const passwordHash = require('password-hash');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../config'); // get our config file

module.exports = {
    addUser: function(req,res){
        const vehiculoObject =  req.swagger.params.vehiculo.value;
        if(!vehiculoObject) res.status(400).json('Error');
        const nuevoVehiculo = new vehiculo(vehiculoObject);
        nuevoVehiculo.save(function (err, nuevoVehiculo){
            if(err){
                if(err.code == 11000) res.status(400).json('Vehiculo ya guardado');
                return console.error(err);
            } else{
                res.json({
                    sucess : true,
                    message: 'Vehiculo guardado'
                });
            }
        });
    }
    
}