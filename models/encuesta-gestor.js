var mongoose = require('mongoose');
let encuestaSchema = require('./encuesta').encuestaSchema;
let gestorSchema = require('./gestor').gestorSchema;

var Schema = mongoose.Schema;



var encuestaGestorSchema = new Schema({
    encuesta: { type: Schema.Types.ObjectId, ref: encuestaSchema, required: true },
    gestor: { type: Schema.Types.ObjectId, ref: gestorSchema, required: true },
    fechaCreacion: { type: Date, required: false },
    fechaActualizacion: { type: Date, required: false },
});

let EncuestaGestor = mongoose.model('encuestaGestores', encuestaGestorSchema);

module.exports = {
    EncuestaGestor,
    encuestaGestorSchema
}