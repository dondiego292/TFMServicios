var express = require('express');
var mdAutenticacion = require('../../middlewares/autenticacion');
var app = express();

var Log = require('../../models/log').Log;
var Ruta = require('../../models/ruta').Ruta;


// ==========================================
// Crear ruta
// ==========================================
app.post('/ruta', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;
    var ruta = new Ruta({
        Device: body.Device,
        Latitud: body.Latitud,
        Longitud: body.Longitud,
        UUID: body.UUID,
        Altitud: body.Altitud,
        Accuracy: body.Accuracy,
        StartDate: body.StartDate,
        StartTime: body.StartTime,
        EndTime: body.EndTime,
        Bateria: body.Bateria,
        Gestor: body.Gestor
    });

    ruta.save((err, rutaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ruta',
                error: err
            });
        }
        res.status(201).json({
            ok: true,
        });
    });
});


// ==========================================
// Crear log
// ==========================================
app.post('/log', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;
    var log = new Log({
        IMEI: body.IMEI,
        Tipo: body.Tipo,
        Propietario: body.Propietario,
        UUID: body.UUID,
        Mensaje: body.Mensaje,
        Bateria: body.Bateria,
        Gestor: body.Gestor,
    });

    log.save((err, logGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear log',
                error: err
            });
        }
        res.status(201).json({
            ok: true,
        });
    });
});





module.exports = app;