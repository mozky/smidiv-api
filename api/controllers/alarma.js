'use strict';

const config = require('../../config'); // get our config file
const Alarma = require('../models/alarma.js');

module.exports = {
    addAlarma: function(req,res){
        const alarmaObject = req.swagger.params.alarma.value;
        if (!alarmaObject){res.status(403).json("Error");}

        new Alarma(alarmaObject).save(function(err,nuevaAlarma){
            if (err) {
                if (err.code == 11000) res.status(400).json('Alarma ya existente');
                return console.error(err);
            } else {
                console.log('Alarma guardada', nuevaAlarma)
                res.json({
                    sucess: true,
                    response: nuevaAlarma
                });
            }
        });
    },
}