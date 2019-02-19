var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var fs = require('fs');
var Gestor = require('../models/gestor').Gestor;
var Cliente = require('../models/cliente').Cliente;

app.post('/', /*[mdAutenticacion.verificaToken],*/ (req, res) => {

    var body = req.body;

    body.forEach(function(b) {


        Gestor.findOne({ nickname: b.gestor }).exec((err, ges) => {

            var cliente = new Cliente({
                nombre: b.nombre,
                apellido: b.apellido,
                identificacion: b.identificacion,
                telefono: b.telefono,
                direccion: b.direccion,
                estadoCivil: b.estadoCivil,
                genero: b.genero,
                fechaInspeccion: new Date(b.fechaInspeccion),
                fechaCreacion: new Date(b.fechaCreacion),
                fechaVisitado: new Date(b.fechaVisitado),
                fechaNacimiento: new Date(b.fechaNacimiento),
                lugarNacimiento: new Date(b.lugarNacimiento),
                ciudad: b.ciudad,
                latitud: b.latitud,
                longitud: b.longitud,
                status: 0,
                gestor: ges._id,
                gestion: b.gestion,
            });

            cliente.save((err, clienteGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al cargando clientes',
                        errors: err
                    });
                }
            });

        });

    });
    res.status(201).json({
        ok: true,
    });
});



module.exports = app;