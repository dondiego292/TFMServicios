var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
//const uuidv1 = require('uuid/v1');
var CatalogoHijo = require('../models/catalogoHijo').CatalogoHijo;

// ==========================================
// Obtener todos los catalogos
// ==========================================
app.get('/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    let idCatalogoPadre = req.params.id;
    CatalogoHijo.find({ catalogoPadre: idCatalogoPadre }).exec((err, catalogos) => {
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
// Crear un nuevo catalogo
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {
    var body = req.body;
    var catalogo = new CatalogoHijo({
        nombre: body.nombre,
        codigo: body.codigo,
        valor: body.valor,
        catalogoPadre: body.catalogoPadre,
    });
    catalogo.save((err, catalogoGuardado) => {
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
    CatalogoHijo.findOne({ _id: idCatalogo }, (err, catalogo) => {
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

    CatalogoHijo.remove({ _id: idcatalogo }, (err) => {
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

    CatalogoHijo.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, catalogo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar catalogo',
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