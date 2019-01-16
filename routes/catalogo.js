var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
//const uuidv1 = require('uuid/v1');
var CatalogoPadre = require('../models/catalogoPadre').CatalogoPadre;

// ==========================================
// Obtener todos los catalogos
// ==========================================
app.get('/', [mdAutenticacion.verificaToken], (req, res, next) => {
    CatalogoPadre.find({}).exec(
        (err, catalogos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando catalogos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                catalogos: catalogos,
            });
        });
});


// ==========================================
// Crear catalogo padre
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;
    var catalogoPadre = new CatalogoPadre({
        codigo: body.codigo,
        nombre: body.nombre,
        valor: body.valor
    });

    catalogoPadre.save((err, catalogoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear catalogo',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            catalogo: catalogoGuardado
        });
    });
});


// ==========================================
// Leer catalogo por id
// ==========================================
app.get('/leer/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idCatalogo = req.params.id;
    CatalogoPadre.findOne({ _id: idCatalogo }, (err, catalogo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar catalogo',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            catalogo: catalogo
        });
    });
});

// ==========================================
// Eliminar catalogo por id
// ==========================================
app.delete('/eliminar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idcatalogo = req.params.id;

    CatalogoPadre.remove({ _id: idcatalogo }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar catalogo',
                errors: err
            });
        }
        res.status(200).json({
            ok: true
        });
    });
});


// ==========================================
// Actualizar catalogo
// ==========================================
app.put('/actualizar', [mdAutenticacion.verificaToken], (req, res) => {

    CatalogoPadre.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, catalogo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al registrar encuesta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            catalogo: catalogo
        });
    });
});



module.exports = app;