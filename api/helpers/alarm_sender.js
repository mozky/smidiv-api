const moment = require('moment')
const FCM = require('fcm-node')
const turf = require ('turf')

const config = require('../../config') // get our config file
const Alarma = require('../models/alarma')
const UbicacionFav = require('../models/ubicacionesFavoritas')

const fcm = new FCM(config.firebase.key)

const minutosDelDia = (momentDate) => {
    return momentDate.minutes() + momentDate.hours() * 60
}

const verificarRangoUbicacionesFav = (ubicacion, ubicacionesFav) => {
    let response = false
    ubicacionesFav.forEach((ubiFav) => {
        const P1 = turf.point([ubiFav.ubicacion.lat, ubiFav.ubicacion.lng])
        const P2 = turf.point([ubicacion.lat, ubicacion.lng])
        const distanciaP1P2 = turf.distance(P1, P2, 'kilometers')
        // console.log('Distancia: ', distanciaP1P2)
            
        // Revisamos la distancia en un rango de 3 KM
        if (distanciaP1P2 < 3) {
            console.log('El vehículo se encuentra en zona segura')
            response = true

        }
    })
    return response
}

const enviarNotificacion = (username) => {
    console.log(`Enviando notificacion a ${username}`)
    const message = {
        to: `/topics/${username}`,
        notification: {
            title: 'ALARMA SMIDIV', 
            body: 'Tu Vehiculo ha salido de el rango definido' 
        },
        // También podemos enviar datos
        // data: {
        //     my_key: 'my value',
        //     my_another_key: 'my another value'
        // }
    }
    // Enviando notificacion
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Error al enviar notificación", err)
        } else {
            console.log("Notificación enviada correctamente", response)
        }
    })
}

// TODO: Ahorita si esta una ubicacion favorita se considera como safe zone, falta cambiar esto por la alarma de ubicacion,
// una ubicacionFav no necesariamente es una safe zone, tiene que estar activada como alarma.
const CheckAlarmsAndSend = (idVehiculo, idUsuario, ubicacion) => {
    console.log('Buscando alarmas...', idVehiculo, idUsuario, ubicacion)
    // Buscamos las alarmas activas para dicho usuario/vehiculo
    Alarma.find({
        "usuario": idUsuario,
        "vehiculo": idVehiculo,
        "estado": true,
        "deleted": false
    })
    .populate({
        path: 'usuario',
        select: '_id username'
    })
    .exec((err, alarmas) => {
        if (alarmas.length > 0) {
            console.log(`Alarmas encontradas: ${alarmas.length}...`)
            UbicacionFav.find({
                "idusuario": idUsuario,
                "deleted": false
            })
            .exec((err, ubicacionesFav) => {
                let notificationSent = false
                alarmas.forEach((alarma) => {
                    // Loopeamos las alarmas de tiempo para ver si nos encontramos entre un rango
                    if (!notificationSent && alarma.rangoHorario && alarma.rangoHorario.inicio && alarma.rangoHorario.fin) {
                        const sTime = minutosDelDia(moment(alarma.rangoHorario.inicio, ['h:m a', 'H:m']))
                        const eTime = minutosDelDia(moment(alarma.rangoHorario.fin, ['h:m a', 'H:m']))
                        const uTime = minutosDelDia(moment(ubicacion.fechaCreacion))

                        // Checkamos el tiempo de la ubicacion con las alarmas
                        if (
                            (sTime < uTime && uTime < eTime)
                            ||
                            (eTime < sTime && (uTime < eTime || (uTime < 1440 && sTime < uTime )))
                        ) {
                            console.log('Alarma dentro de rango prohibido...')
                            const estaEnZonaSegura = verificarRangoUbicacionesFav(ubicacion.ubicacion, ubicacionesFav)
                            console.log('Está en zona segura', estaEnZonaSegura)
                            if (!estaEnZonaSegura) {
                                console.log('asdfklkjsdflj', alarma)
                                enviarNotificacion(alarma.usuario.username)
                                notificationSent = true
                            }
                        }          
                    }
                })
            })
        } else {
            console.log('Alarma no encontrada...')
        }
    })
}

module.exports = CheckAlarmsAndSend