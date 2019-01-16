var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
const uuidv1 = require('uuid/v1');
var Encuesta = require('../models/encuesta').Encuesta;


// ==========================================
// Obtener todas las encuestas
// ==========================================
app.get('/', [mdAutenticacion.verificaToken], (req, res, next) => {
    Encuesta.find({}).exec(
        (err, encuestas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando encuestas',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                encuestas: encuestas,
            });
        });
});


// ==========================================
// Crear encuesta
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;
    var encuesta = new Encuesta({
        tipo: body.tipo,
        nombre: body.nombre,
        uuid: uuidv1(),
        estado: 0,
        fechaCreacion: Date.now(),
        fechaActualizacion: Date.now(),
        etiqueta: body.etiqueta,
        libre: body.libre,
        descripcion: body.descripcion
    });

    encuesta.save((err, encuestaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear encuesta',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            encuesta: encuestaGuardada
        });
    });
});


// ==========================================
// Leer encuesta por uuid
// ==========================================
app.get('/leer/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let uuidEncuesta = req.params.id;
    Encuesta.findOne({ uuid: uuidEncuesta }, (err, encuesta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar encuesta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            encuesta: encuesta
        });
    });
});

// ==========================================
// Eliminar encuesta por uuid
// ==========================================
app.delete('/eliminar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let uuidEncuesta = req.params.id;

    Encuesta.remove({ uuid: uuidEncuesta }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar encuesta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true
        });
    });
});


// ==========================================
// Actualizar encuesta
// ==========================================
app.put('/actualizar', [mdAutenticacion.verificaToken], (req, res) => {

    Encuesta.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, encuesta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar encuesta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            encuesta: encuesta
        });
    });
});


// ==========================================
// Publicar encuesta
// ==========================================
app.get('/publicar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idEncuesta = req.params.id;
    Encuesta.findByIdAndUpdate(idEncuesta, { estado: 1 }, (err, encuesta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al publicar encuesta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            encuesta: encuesta
        });
    });
});


// ==========================================
// DESPublicar encuesta
// ==========================================
app.get('/despublicar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idEncuesta = req.params.id;
    Encuesta.findByIdAndUpdate(idEncuesta, { estado: 0 }, (err, encuesta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al despublicar encuesta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            encuesta: encuesta
        });
    });
});



module.exports = app;