'use strict'

const Alerta = require('../models/alerta')
const User = require('../models/user')

module.exports = {
    agregarAlerta: (vehiculoId, userId, alarmaId, ubicacionId, tipo, valor) => {
        new Alerta({
            userId,
            vehiculoId,
            alarmaId: alarmaId,
            ubicacionId: ubicacionId,
            tipo: 'alarma',
            valor: 'activada'
        }).save(function (err, nuevaAlerta) {
            if (err) {
                if (err.code == 11000) res.status(400).json('Alerta ya guardada')
                return console.error(err)
            } else {
                console.log('Nueva alerta guardada', nuevaAlerta)
            }
        })

    },
    getAlertas: function(req, res){
        User.findOne({
            username: req.swagger.params.usuario.value,
            deleted: false
        })
        .exec(function (err, user) {
            if (err || !user) {
                console.log('Error fetching usuario, #getUbicacionFav', err)
                res.status(400).json('Error fetching usuario')
                return
            }

            Alerta.find({
                userId: user._id
            })
            .select('_id tipo valor fechaCreacion')
            .populate({
                path: 'ubicacionId',
                select: 'ubicacion'
            })
            .exec(function (err, alertas) {
                console.log('alertas', alertas, user._id)
                if (err || !alertas) {
                    console.log('Error fetching alerta, #getAlertas', err)
                    res.status(400).json('Error fetching alertas')
                    return
                }

                res.status(200).json({
                    success: true,
                    response: {
                        alertas
                    }
                })
            })
        })
    }
}