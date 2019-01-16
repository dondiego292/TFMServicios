var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../../config/config').SEED;

var app = express();
var Usuario = require('../../models/usuario').Usuario;
var Gestor = require('../../models/gestor').Gestor;


// ==========================================
//  Login
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ username: body.username }, (err, usuarioDB) => {

        if (err) {
            return res.status(200).json({
                ok: false,
                mensaje: 'Error al buscar usuario - username',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(200).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(200).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }
        Gestor.findOne({ $and: [{ usuario: usuarioDB._id }, { imei: body.imei }] }, 'usuario nombres apellidos imei nickname')
            .exec(
                (err, gestor) => {
                    if (err) {
                        return res.status(200).json({
                            ok: false,
                            mensaje: 'Error Gestor no asignado',
                            errors: err
                        });
                    }
                    if (!gestor) {
                        return res.status(200).json({
                            ok: false,
                            mensaje: 'Gestor no asignado',
                            errors: err
                        });
                    }
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 1440000000 }); // 4 horas
                    gestor.token = token;
                    res.status(200).json({
                        ok: true,
                        nombres: gestor.nombres,
                        apellidos: gestor.apellidos,
                        token: token,
                        nickname: gestor.nickname,
                        gestorID: gestor._id
                    });
                });
    });
});

module.exports = app;