'use strict';

const util = require('util');
const Marca = require('../models/marca');
const config = require('../../config'); // get our config file


module.exports = {
    addMarca: function(req, res){
        
        const marcaObject = req.swagger.params.marca.value;
        if (!marcaObject) res.status(400).json('Error con el objecto');
        new Marca(marcaObject).save(function(err,nuevaMarca){
            if (err) {
                if (err.code == 11000) res.status(400).json('Marca ya existente');
                return console.error(err);
            } else {
                console.log('New marca saved', nuevaMarca)

                res.json({
                    sucess: true,
                    response: nuevaMarca
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