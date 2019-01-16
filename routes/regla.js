var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Regla = require('../models/regla').Regla;

// ==========================================
// Obtener todos las reglas de una pregunta
// ==========================================
app.get('/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    let idPregunta = req.params.id;

    Regla.find({ pregunta: idPregunta })
        .exec(
            (err, reglas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reglas',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    reglas: reglas,
                });
            });

});

// ==========================================
// Leer regla por id
// ==========================================
app.get('/leer/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idRegla = req.params.id;
    Regla.findOne({ _id: idRegla }, (err, regla) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar regla',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            regla: regla
        });
    });
});


// ==========================================
// Crear una nueva regla de una encuesta
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {
    var body = req.body;

    var regla = new Regla({
        pregunta: body.pregunta,
        codigoPrincipal: body.codigoPrincipal,
        codigoDependiente: body.codigoDependiente,
        valor: body.valor,
        accion: body.accion
    });

    regla.save((err, reglaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear regla',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            regla: reglaGuardada
        });
    });
});



// ==========================================
// Eliminar regla por id
// ==========================================
app.delete('/eliminar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idRegla = req.params.id;

    Regla.remove({ _id: idRegla }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar reglas',
                errors: err
            });
        }
        res.status(200).json({
            ok: true
        });
    });
});


// ==========================================
// Actualizar regla
// ==========================================
app.put('/actualizar', [mdAutenticacion.verificaToken], (req, res) => {

    Regla.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, regla) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar regla',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            regla: regla
        });
    });
});



module.exports = app;