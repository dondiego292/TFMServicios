var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
//const uuidv1 = require('uuid/v1');
var TipoPregunta = require('../models/tipoPregunta').TipoPregunta;

// ==========================================
// Obtener todos los tipos de pregunta
// ==========================================
app.get('/', [mdAutenticacion.verificaToken], (req, res, next) => {
    TipoPregunta.find({}).exec(
        (err, tipos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando tipos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                tipos: tipos,
            });
        });
});


// ==========================================
// Crear tipo de pregunta
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;
    var tipoPregunta = new TipoPregunta({
        tipo: body.tipo,
        nombre: body.nombre,
    });

    tipoPregunta.save((err, tipoPreguntaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo pregunta',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tipo: tipoPreguntaGuardado
        });
    });
});


// ==========================================
// Leer tipo de pregunta por id
// ==========================================
app.get('/leer/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idTipoPregunta = req.params.id;
    TipoPregunta.findOne({ _id: idTipoPregunta }, (err, tipo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar tipo de pregunta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            tipo: tipo
        });
    });
});

// ==========================================
// Eliminar tipo de pregunta por id
// ==========================================
app.delete('/eliminar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idTipoPregunta = req.params.id;

    TipoPregunta.remove({ _id: idTipoPregunta }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar tipo pregunta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true
        });
    });
});


// ==========================================
// Actualizar tipo pregunta
// ==========================================
app.put('/actualizar', [mdAutenticacion.verificaToken], (req, res) => {

    TipoPregunta.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, tipo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar tip de pregunta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            tipo: tipo
        });
    });
});



module.exports = app;