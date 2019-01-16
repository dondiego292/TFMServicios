var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
const uuidv1 = require('uuid/v1');
var Pregunta = require('../models/pregunta').Pregunta;
var TipoPregunta = require('../models/tipoPregunta').TipoPregunta;
var CatalogoPadre = require('../models/catalogoPadre').CatalogoPadre;

// ==========================================
// Obtener todos las preguntas de una encuesta
// ==========================================
app.get('/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    let idEncuesta = req.params.id;

    Pregunta.find({ encuesta: idEncuesta })
        .populate('catalogosPadres', 'nombre codigo valor')
        .exec(
            (err, preguntas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando preguntas',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    preguntas: preguntas,
                });
            });

});


// ==========================================
// Leer pregunta por id
// ==========================================
app.get('/leer/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idPregunta = req.params.id;
    Pregunta.findOne({ _id: idPregunta }, (err, pregunta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar pregunta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            pregunta: pregunta
        });
    });
});


app.get('/obtener/data', [mdAutenticacion.verificaToken], (req, res, next) => {


    Promise.all([
            buscarTipoPreguntas(),
            buscarCatalogos()
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                tipoPreguntas: respuestas[0],
                catalogos: respuestas[1]
            });
        });

});


function buscarCatalogos() {
    return new Promise((resolve, reject) => {
        CatalogoPadre.find({}).exec((err, catalogos) => {
            if (err) {
                reject('Error al cargar catalogos', err);
            } else {
                resolve(catalogos)
            }
        });
    });
}

function buscarTipoPreguntas() {
    return new Promise((resolve, reject) => {
        TipoPregunta.find({}).exec((err, tiposPreguntas) => {
            if (err) {
                reject('Error al cargar tipo de preguntas', err);
            } else {
                resolve(tiposPreguntas)
            }
        });
    });
}



// ==========================================
// Crear un nuevo pregunta de una encuesta
// ==========================================
app.post('/', [mdAutenticacion.verificaToken], (req, res) => {
    var body = req.body;

    var pregunta = new Pregunta({
        encuesta: body.encuesta,
        uuid: uuidv1(),
        texto: body.texto,
        etiqueta: body.etiqueta,
        obligatorio: body.obligatorio,
        tipoID: body.tipoID,
        tipo: body.tipo,
        estado: 0,
        fechaCreacion: Date.now(),
        fechaActualizacion: Date.now(),
        posicion: body.posicion,
        catalogoID: body.catalogoID,
        catalogo: body.catalogo,
        expresion: body.expresion,
    });

    Pregunta.count({ encuesta: body.encuesta }, (err, conteo) => {
        pregunta.posicion = conteo;
        pregunta.save((err, preguntaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear pregunta',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                pregunta: preguntaGuardada
            });
        });
    });
});



// ==========================================
// Eliminar pregunta por id
// ==========================================
app.delete('/eliminar/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let idPregunta = req.params.id;

    Pregunta.remove({ _id: idPregunta }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar pregunta',
                errors: err
            });
        }
        res.status(200).json({
            ok: true
        });
    });
});


// ==========================================
// Actualizar pregunta
// ==========================================
app.put('/actualizar', [mdAutenticacion.verificaToken], (req, res) => {

    Pregunta.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, catalogo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar pregunta',
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