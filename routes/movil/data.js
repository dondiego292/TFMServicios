var express = require('express');
var mdAutenticacion = require('../../middlewares/autenticacion');
var app = express();
var Data = require('../../models/data').Data;


// ==========================================
// Crear un nuevo data
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {
    var body = req.body;

    var data = new Data({
        survey: body._survey,
        json: body
    });

    data.save((err, dataGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear pregunta',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            id: dataGuardada._id
        });
    });
});

module.exports = app;