var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario').Usuario;


// ==========================================
//  Login
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ username: body.username }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario - username',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    });


});


function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Administración',
            icono: 'mdi mdi-gauge',
            submenu: [
                //{ titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Encuestas', url: '/encuestas' },
                { titulo: 'Catálogos', url: '/catalogos' },
                { titulo: 'Tipo Preguntas', url: '/tipo/preguntas' },
                //{ titulo: 'ProgressBar', url: '/progress' },
                //{ titulo: 'Gráficas', url: '/graficas1' },
                //{ titulo: 'Promesas', url: '/promesas' },
                //{ titulo: 'RxJs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Gestores', url: '/gestor' },
                { titulo: 'Supervisor', url: '/supervisor' },
                //{ titulo: 'Hospitales', url: '/hospitales' },
                //{ titulo: 'Médicos', url: '/medicos' }
            ]
        },
        {
            titulo: 'Visor',
            icono: 'mdi mdi-google-maps',
            submenu: [
                { titulo: 'Visor', url: '/visor' },
            ]
        }
    ];

    if (ROLE !== 'ADMIN_ROLE') {
        menu.splice(1, 1);
        // menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }
    return menu;

}


module.exports = app;