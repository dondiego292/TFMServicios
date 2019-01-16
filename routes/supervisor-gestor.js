var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var SupervisorGestor = require('../models/supervisor-gestor').SupervisorGestor;
var Usuario = require('../models/usuario').Usuario;
var Gestor = require('../models/gestor').Gestor;



// ==========================================
// Obtener todos los supervisores
// ==========================================
app.get('/', [mdAutenticacion.verificaToken], (req, res, next) => {
    Usuario.find({ role: 'SUPERVISOR_ROLE' })
        .populate('usuarios', 'apellidos dni email nombres role username _id')
        .exec(
            (err, supervisores) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando supervisores',
                        errors: err
                    });
                }
                supervisores.forEach(function(supervisor) {
                    supervisor.password = ':)';
                });
                res.status(200).json({
                    ok: true,
                    supervisores: supervisores,
                });
            });

});


// ==========================================
// Obtener todos los gestores
// ==========================================
app.get('/gestor', [mdAutenticacion.verificaToken], (req, res, next) => {

    SupervisorGestor.find({}).exec((err, supergestores) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando supervisores',
                errors: err
            });
        }
        let ids = [];
        supergestores.forEach(function(supergestor) {
            ids.push(supergestor.gestor);
        });
        Gestor.find({ _id: { $nin: ids } }, 'usuario nombres apellidos imei nickname')
            //Gestor.find({ $and: [{ _id: { $nin: ids } }, { role: 'USER_ROLE' }] }, 'username dni nombres apellidos email img role')
            .exec(
                (err, gestores) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando supervisores',
                            errors: err
                        });
                    }
                    /*gestores.forEach(function(gestor) {
                        gestor.password = ':)';
                    });*/
                    res.status(200).json({
                        ok: true,
                        gestores: gestores,
                    });
                });
    });
});


// ==========================================
// Obtener todos los gestores USUARIO_ROLE
// ==========================================
app.get('/supergestor/:id', [mdAutenticacion.verificaToken], (req, res, next) => {
    var idSupervisor = req.params.id;

    SupervisorGestor.find({ usuario: idSupervisor }).exec((err, supergestores) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando supervisores',
                errors: err
            });
        }
        let ids = [];
        supergestores.forEach(function(supergestor) {
            ids.push(supergestor.gestor);
        });
        Gestor.find({ _id: { $in: ids } }, 'usuario nombres apellidos imei nickname color')
            //Usuario.find({ role: 'USUARIO_ROLE' })
            //.populate('usuarios', 'apellidos dni email nombres role username _id')
            .exec(
                (err, gestoresAsignados) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando supervisores',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        gestoresAsignados: gestoresAsignados,
                    });
                });
    });
});


// ==========================================
// Crear un nuevo supervisor-gestor
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;
    var supervisorGestor = new SupervisorGestor({
        usuario: body.usuario,
        gestor: body.gestor,
        fechaCreacion: Date.now(),
        fechaActualizacion: Date.now()
    });
    supervisorGestor.save((err, supervisorGestorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear supervisorGestor',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            supervisorGestor: supervisorGestorGuardado
        });
    });
});

// ============================================
//   Borrar un supervisorgestor por el id
// ============================================
app.delete('/eliminar/:usuario/:gestor', [mdAutenticacion.verificaToken], (req, res) => {

    var usuario = req.params.usuario;
    var gestor = req.params.gestor;
    //Gestor.find({ $and: [{ _id: { $nin: ids } }, { role: 'USER_ROLE' }] }, 'username dni nombres apellidos email img role')

    SupervisorGestor.remove({ $and: [{ usuario: usuario }, { gestor: gestor }] }, (err, supervisorGestor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        if (!supervisorGestor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un supervisorGestor con ese id',
                errors: { message: 'No existe un supervisorGestor con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            supervisorGestor: supervisorGestor
        });
    });
});
module.exports = app;