var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Gestor = require('../models/gestor').Gestor;

// ==========================================
// Obtener todos los gestores
// ==========================================
app.get('/', [mdAutenticacion.verificaToken], (req, res, next) => {
    Gestor.find({}).exec(
        (err, gestores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando gestores',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                gestores: gestores,
            });
        });
});

// ==========================================
// Crear gestores
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;
    var gestor = new Gestor({
        usuario: body.usuario,
        apellidos: body.apellidos,
        nombres: body.nombres,
        imei: body.imei,
        fechaCreacion: Date.now(),
        fechaActualizacion: Date.now(),
        token: body.token,
        nickname: body.nickname,
        color: body.color,
        fueraServicio: body.fueraServicio
    });

    gestor.save((err, gestorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear gestor',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            gestor: gestorGuardado
        });
    });
});


// ==========================================
// Leer gestor por id
// ==========================================
app.get('/leer/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idGestor = req.params.id;
    Gestor.findOne({ _id: idGestor }, (err, gestor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar gestor',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            gestor: gestor
        });
    });
});

// ==========================================
// Eliminar gestor 
// ==========================================
app.delete('/eliminar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idGestor = req.params.id;

    Gestor.remove({ _id: idGestor }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar gestor',
                errors: err
            });
        }
        res.status(200).json({
            ok: true
        });
    });
});


// ==========================================
// Actualizar gestor
// ==========================================
app.put('/actualizar', [mdAutenticacion.verificaToken], (req, res) => {

    Gestor.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, gestor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar gestor',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            gestor: gestor
        });
    });
});


module.exports = app;