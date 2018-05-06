'use strict';

const util = require('util');
const SMIDIVID = require('../models/SMIDIVID');
const config = require('../../config'); // get our config file


module.exports = {
    addClave: function(req, res){
        const clave = req.swagger.params.smidivid.value;
        if (!clave) res.status(400).json('Error con el objecto');
        new SMIDIVID(clave).save(function(err, clav){
            if (err) {
                if (err.code == 11000) res.status(400).json('Clave ya existente');
                return console.error(err);
            } else {
                console.log('New clave saved', clav)

                res.json({
                    sucess: true,
                    response: clav
                });
            }
        });
    },
    getMarcaList: function(req, res){
       Marca.find().exec(function (err, marca) {
            if(err){
                res.status(403).json("Error obteniendo la alarma");
            }
            res.json({
                sucess: true,
                response: {
                    marcas: marca
                }
            })
        })


    }
}