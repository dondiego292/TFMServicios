var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario').Usuario;
var Gestor = require('../models/gestor').Gestor;
var EncuestaGestor = require('../models/encuesta-gestor').EncuestaGestor;


// ==========================================
// Obtener todos los usuarios
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'username dni nombres apellidos email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });

                });
            });
});

// ==================================================================================
// Obtener todos los usuarios con role ROLE_USER que no esten usados como gestores
// ==================================================================================
app.get('/todos/usuarios', [mdAutenticacion.verificaToken], (req, res, next) => {
    Gestor.find({}).exec(
        (err, gestores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando gestores',
                    errors: err
                });
            }
            let ids = [];
            gestores.forEach(function(gestor) {
                ids.push(gestor.usuario);
            });
            Usuario.find({ $and: [{ _id: { $nin: ids } }, { role: 'USER_ROLE' }] }, 'username dni nombres apellidos email img role')
                .exec((err, usuarios) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuario',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios
                    });
                });
        });
});


// ==========================================
// Actualizar usuario
// ==========================================
app.put('/:id', [mdAutenticacion.verificaToken], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.fechaActualizacion = Date.now();

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});


// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        username: body.username,
        dni: body.dni,
        nombres: body.nombres,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        fechaCreacion: Date.now(),
        fechaActualizacion: Date.now()
    });
    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });
});


// ============================================
//   Borrar un usuario por el id
// ============================================
app.delete('/:id', [mdAutenticacion.verificaToken], (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


// ==========================================
// Leer encuesta por uuid
// ==========================================
app.get('/leer/:id', [mdAutenticacion.verificaToken], (req, res) => {

    let usuarioID = req.params.id;
    Usuario.findOne({ _id: usuarioID }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuario
        });
    });
});

// ==========================================
// actualizar pass
// ==========================================
app.get('/actualizarPass/:id/:pass', [mdAutenticacion.verificaToken], (req, res) => {

    let idUsuario = req.params.id;
    let password = req.params.pass;
    Usuario.findByIdAndUpdate(idUsuario, { password: bcrypt.hashSync(password, 10) }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar pass usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuario
        });
    });
});

module.exports = app;