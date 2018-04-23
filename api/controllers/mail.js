'use strict'

const config = require ('../../config');
const User = require ('../models/user.js');
const nodemailer = require("nodemailer");

module.exports = {
    sendCorreo(req, res){
        const userObject = req.swagger.params.user.value;
        if(!userObject) res.status(403).json('access denied');
        const query = User.findOne({'username':userObject.username});
        query.select('email password').exec(function(err,usuario){
            if (err) {
                console.log('Error', err)
                res.status(400).json('Error en la consulta');
                return;
              }
              var account={user:'SMIDIVDev@gmail.com',pass:'arduino123'};
              console.log(usuario.password);


              let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'smidivdevs@gmail.com', // generated ethereal user
                    pass: 'arduino123' // generated ethereal password
                }
            });
            let mailOptions = {
                from: 'SMIDIV APP <smidiv@smidiv.com>', // sender address
                to: '<'+usuario.email+'>', // list of receivers
                subject: 'Tu contraseña', // Subject line
                html: '<b>Enviamos este correo por que solicitaste tu contraseña en SMIDIV y bueno aqui esta</b></break><p>'+usuario.email+'<p>:<p>'+usuario.password+'</p>' // html body

            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(400).json("err"+error);
                    return
                }
                res.status(200).json("Mensaje enviado");
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
              
        });
    }
}