var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Ruta = require('../models/ruta').Ruta;
var SupervisorGestor = require('../models/supervisor-gestor').SupervisorGestor;
var Gestor = require('../models/gestor').Gestor;

// ==========================================
// Obtener rutas
// ==========================================
app.get('/:usuarioID/:gestorID/:fecha', [mdAutenticacion.verificaToken], (req, res) => {

    let usuarioID = req.params.usuarioID;
    let gestorID = req.params.gestorID;
    let fecha = req.params.fecha;
    let fechaDesde = new Date(fecha);
    let fechaHasta = new Date(+new Date(fecha) + 1 * 24 * 60 * 60 * 1000);
    if (gestorID === '0') {
        SupervisorGestor.find({ usuario: usuarioID }).exec((err, supergestores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando supervisores',
                    errors: err
                });
            }
            let ids = [];
            supergestores.forEach(function(supergestor) {
                ids.push(supergestor.gestor);
            });
            Ruta.find({ $and: [{ Gestor: { $in: ids } }, { StartDate: { "$gte": fechaDesde, "$lt": fechaHasta } }] }, (err, rutas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar rutas',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    rutas: rutas
                });
            });
        });
    } else {
        Ruta.find({ $and: [{ Gestor: gestorID }, { StartDate: { "$gte": fechaDesde, "$lt": fechaHasta } }] }, (err, rutas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar rutas',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                rutas: rutas
            });
        });
    }
});


module.exports = app;