var express = require('express');
var mdAutenticacion = require('../../middlewares/autenticacion');
var app = express();
var Cliente = require('../../models/cliente').Cliente;


// ==========================================
// Obtener todas las encuestas del gestor
// ==========================================

app.get('/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    let gestorID = req.params.id;
    Cliente.find({ $and: [{ gestor: gestorID }, { status: 0 }] })
        .exec((err, clientes) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    mensaje: 'Error cargando clientes',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                clientes: clientes
            });
        });
});


// ==========================================
// Crear cliente
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;
    var cliente = new Cliente({
        nombre: body.nombre,
        apellido: body.apellido,
        identificacion: body.identificacion,
        telefono: body.telefono,
        direccion: body.direccion,
        estadoCivil: body.estadoCivil,
        genero: body.genero,
        lugarNacimiento: body.lugarNacimiento,
        ciudad: body.ciudad,
        gestor: body.gestor,
        status: 0,
        fechaInspeccion: Date.now(),
        fechaCreacion: Date.now(),
        fechaVisitado: Date.now(),
        fechaNacimiento: Date.now(),
        latitud: body.latitud,
        longitud: body.longitud,
        gestion: body.gestion
    });
    cliente.save((err, clienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            cliente: clienteGuardado
        });
    });
});




module.exports = app;