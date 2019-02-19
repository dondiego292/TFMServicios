var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Data = require('../models/data').Data;
var fs = require('fs');
var Cliente = require('../../models/cliente').Cliente;


// ==========================================
// Obtener todas las encuestas
// ==========================================
app.get('/survey/:survey', [mdAutenticacion.verificaToken], (req, res, next) => {
    let _survey = req.params.survey;
    Data.find({ survey: _survey }).exec(
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


app.get('/:id', /*[mdAutenticacion.verificaToken],*/ (req, res, next) => {
    let idData = req.params.id;
    var path = `./uploads/movil/${idData}-${idData}.jpg`; //uploads/movil/5c66ee23c6f1940017815131-5c66ee23c6f1940017815131.jpg
    if (fs.existsSync(path)) {
        var base64str = base64_encode(path);
        res.status(200).json({
            ok: true,
            'image': base64str
        });
    } else {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error no existe foto',
        });
    }
});

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

app.get('/cliente/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    let clienteID = req.params.id;
    Cliente.findOne({ _id: clienteID }).exec((err, cliente) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                mensaje: 'Error cargando cliente',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            cliente: cliente
        });
    });
});



module.exports = app;