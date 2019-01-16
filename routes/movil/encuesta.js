var express = require('express');
var mdAutenticacion = require('../../middlewares/autenticacion');
var app = express();
var Encuesta = require('../../models/encuesta').Encuesta;
var EncuestaGestor = require('../../models/encuesta-gestor').EncuestaGestor;
var Pregunta = require('../../models/pregunta').Pregunta;
var CatalogoHijo = require('../../models/catalogoHijo').CatalogoHijo;
var CatalogoPadre = require('../../models/catalogoPadre').CatalogoPadre;
var Regla = require('../../models/regla').Regla;
var TipoPregunta = require('../../models/tipoPregunta').TipoPregunta;


// ==========================================
// Obtener todas las encuestas del gestor
// ==========================================
app.get('/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    let gestorID = req.params.id;
    EncuestaGestor.find({ gestor: gestorID }).exec(
        (err, encuestas) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    mensaje: 'Error cargando gestores',
                    errors: err
                });
            }
            let ids = [];
            encuestas.forEach(function(encuesta) {
                ids.push(encuesta.encuesta);
            });
            Encuesta.find({ $and: [{ _id: { $in: ids } }, { estado: 1 }] })
                //Encuesta.find({ _id: { $in: ids } })
                .exec((err, encuestas) => {
                    if (err) {
                        return res.status(200).json({
                            ok: false,
                            mensaje: 'Error cargando encuestas',
                            errors: err
                        });
                    }
                    TipoPregunta.find()
                        .exec((err, tipos) => {
                            if (err) {
                                //reject('Error al cargar tipos', err);
                            } else {
                                res.status(200).json({
                                    ok: true,
                                    encuestas: encuestas,
                                    tipoPreguntas: tipos
                                });
                            }
                        });

                });
        });
});


// ==============================
// Obtener todas las preguntas catalogos y reglas de una encuesta
// ==============================
app.get('/data/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    //app.get('/data2/:id', (req, res, next) => {
    let encuestaID = req.params.id;
    let encuesta = [];
    let preguntas = [];
    let reglas = [];
    let catalogosPadres = [];
    let catalogosHijos = [];

    Promise.all([
            buscarEncuesta(encuestaID),
            buscarPreguntas(encuestaID),
            /*buscarUsuarios(busqueda, regex)*/
        ])
        .then(respuestas => {
            encuesta = respuestas[0];
            preguntas = respuestas[1];
            let ids = [];
            preguntas.forEach(function(pregunta) {
                if (pregunta.catalogoID)
                    ids.push(pregunta.catalogoID);
            });
            let preguntasID = [];
            preguntas.forEach(function(pregunta) {
                preguntasID.push(pregunta._id);
            });

            Promise.all([
                    buscarReglas(preguntasID),
                    buscarCatalogoPadre(ids),
                    buscarCatalogoHijos(ids),
                    //buscarTipoPregunta(),
                ])
                .then(data => {
                    let cats = [];
                    let catalogosPadres = data[1];
                    let catalogosHijos = data[2];
                    //console.log(catalogosPadres);


                    catalogosHijos.forEach(function(catalogoHijo) {
                        var test = {};
                        test.nombre = catalogoHijo.nombre;
                        test.codigo = catalogoHijo.codigo;
                        test.valor = catalogoHijo.valor;
                        cats.push(test);
                    });
                    res.status(200).json({
                        ok: true,
                        encuesta: encuesta,
                        preguntas: preguntas,
                        reglas: data[0],
                        padres: data[1],
                        hijos: data[2],
                        cats: cats
                            //tipoPreguntas: data[3],
                    });
                });
        });


});


function buscarEncuesta(encuestaID) {
    return new Promise((resolve, reject) => {
        Encuesta.findById(encuestaID)
            .exec((err, encuesta) => {
                if (err) {
                    reject('Error al cargar encuesta', err);
                } else {
                    resolve(encuesta)
                }
            });
    });
}

function buscarPreguntas(encuestaID) {
    return new Promise((resolve, reject) => {
        Pregunta.find({ encuesta: encuestaID })
            .exec((err, preguntas) => {
                if (err) {
                    reject('Error al cargar preguntas', err);
                } else {
                    resolve(preguntas)
                }
            });
    });
}

function buscarReglas(preguntasID) {
    return new Promise((resolve, reject) => {
        Regla.find({ pregunta: { $in: preguntasID } })
            .exec((err, reglas) => {
                if (err) {
                    reject('Error al cargar preguntas', err);
                } else {
                    resolve(reglas)
                }
            });
    });
}


function buscarCatalogoPadre(ids) {
    return new Promise((resolve, reject) => {
        CatalogoPadre.find({ _id: { $in: ids } })
            .exec((err, padres) => {
                if (err) {
                    reject('Error al cargar padres', err);
                } else {
                    resolve(padres)
                }
            });
    });
}


function buscarCatalogoHijos(ids) {
    return new Promise((resolve, reject) => {
        CatalogoHijo.find({ catalogoPadre: { $in: ids } })
            .exec((err, hijos) => {
                if (err) {
                    reject('Error al cargar hijos', err);
                } else {
                    resolve(hijos)
                }
            });
    });
}


function buscarTipoPregunta() {
    return new Promise((resolve, reject) => {
        TipoPregunta.find()
            .exec((err, tipos) => {
                if (err) {
                    reject('Error al cargar tipos', err);
                } else {
                    resolve(tipos)
                }
            });
    });
}







module.exports = app;