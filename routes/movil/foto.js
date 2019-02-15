var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var mdAutenticacion = require('../../middlewares/autenticacion');
var app = express();

// default options
app.use(fileUpload());




app.post('/:id', [mdAutenticacion.verificaToken], (req, res, next) => {

    var id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.file;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }.${ extensionArchivo }`;
    // Mover el archivo del temporal a un path
    var path = `././uploads/movil/${id}-${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            mensaje: 'Imagen de subida saisfactoriamente ' + path,
        });
    });
});

module.exports = app;