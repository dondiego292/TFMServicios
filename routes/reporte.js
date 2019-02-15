var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Data = require('../models/data').Data;


// ==========================================
// Obtener todas las encuestas
// ==========================================
app.get('/', [mdAutenticacion.verificaToken], (req, res, next) => {
    Data.find({ survey: 'Publicidad' }).exec(
        (err, datas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando datos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                datas: datas,
            });
        });
});



module.exports = app;