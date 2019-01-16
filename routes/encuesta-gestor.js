var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var EncuestaGestor = require('../models/encuesta-gestor').EncuestaGestor;
var Gestor = require('../models/gestor').Gestor;
var Usuario = require('../models/usuario').Usuario;



// ==========================================
// Obtener todos los gestores asignados de la encuesta ID
// ==========================================
app.get('/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    var idEncuesta = req.params.id;
    EncuestaGestor.find({ encuesta: idEncuesta }).exec((err, encuestagestores) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando gestores asignados',
                errors: err
            });
        }
        let ids = [];
        encuestagestores.forEach(function(encuestagestor) {
            ids.push(encuestagestor.gestor);
        });
        Gestor.find({ _id: { $in: ids } }, 'usuario nombres apellidos imei nickname')
            .exec(
                (err, gestoresAsignados) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando supervisores',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        gestoresAsignados: gestoresAsignados,
                    });
                });
    });
});


// ==================================================================================
// Obtener todos los usuarios con role ROLE_USER que no esten usados en encuestas
// ==================================================================================
app.get('/data/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    var idEncuesta = req.params.id;
    EncuestaGestor.find({ encuesta: idEncuesta }).exec((err, encuestagestores) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando gestores asignados',
                errors: err
            });
        }
        let ids = [];
        encuestagestores.forEach(function(encuestagestor) {
            ids.push(encuestagestor.gestor);
        });
        Gestor.find({ _id: { $nin: ids } }, 'usuario nombres apellidos imei nickname')
            .exec(
                (err, gestoresAsignados) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando supervisores',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        gestoresAsignados: gestoresAsignados,
                    });
                });
    });
});



// ==========================================
// Crear un nuevo encuesta-gestor
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;
    var encuestaGestor = new EncuestaGestor({
        encuesta: body.encuesta,
        gestor: body.gestor,
        fechaCreacion: Date.now(),
        fechaActualizacion: Date.now()
    });
    encuestaGestor.save((err, encuestaGestorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear encuestaGestor',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            encuestaGestor: encuestaGestorGuardado
        });
    });
});


// ============================================
//   Borrar un encuestagestor
// ============================================
app.delete('/eliminar/:encuesta/:gestor', [mdAutenticacion.verificaToken], (req, res) => {

    var encuesta = req.params.encuesta;
    var gestor = req.params.gestor;
    //Gestor.find({ $and: [{ _id: { $nin: ids } }, { role: 'USER_ROLE' }] }, 'username dni nombres apellidos email img role')

    EncuestaGestor.remove({ $and: [{ encuesta: encuesta }, { gestor: gestor }] }, (err, encuestaGestor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        if (!encuestaGestor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un encuestaGestor con ese id',
                errors: { message: 'No existe un encuestaGestor con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            encuestaGestor: encuestaGestor
        });
    });
});


module.exports = app;