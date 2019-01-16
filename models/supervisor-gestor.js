var mongoose = require('mongoose');
let usuarioSchema = require('./usuario').usuarioSchema;
let gestorSchema = require('./gestor').gestorSchema;

var Schema = mongoose.Schema;



var supervisorGestorSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: usuarioSchema, required: true },
    gestor: { type: Schema.Types.ObjectId, ref: gestorSchema, required: true },
    fechaCreacion: { type: Date, required: false },
    fechaActualizacion: { type: Date, required: false },
});

let SupervisorGestor = mongoose.model('supervisorGestores', supervisorGestorSchema);

module.exports = {
    SupervisorGestor,
    supervisorGestorSchema
}