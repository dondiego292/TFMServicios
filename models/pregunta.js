var mongoose = require('mongoose');
let catalogoPadreSchema = require('./catalogoPadre').catalogoPadreSchema;
let encuestaSchema = require('./encuesta').encuestaSchema;
let tipoPreguntaSchema = require('./tipoPregunta').tipoPreguntaSchema;

var Schema = mongoose.Schema;



var preguntaSchema = new Schema({
    encuesta: { type: Schema.Types.ObjectId, ref: encuestaSchema, required: true },
    uuid: { type: String, required: false },
    texto: { type: String, required: [true, 'El texto es necesario'] },
    etiqueta: { type: String, required: [true, 'La etiqueta es necesaria'] },
    obligatorio: { type: Boolean, required: [true, 'Obligatorio es necesario'] },
    tipo: { type: Schema.Types.ObjectId, ref: tipoPreguntaSchema, required: true },
    estado: { type: Number, required: false },
    fechaCreacion: { type: Date, required: false },
    fechaActualizacion: { type: Date, required: false },
    posicion: { type: Number, required: false },
    catalogoID: { type: String, required: false },
    catalogo: { type: String, required: false },
    expresion: { type: String, required: false },
});

let Pregunta = mongoose.model('preguntas', preguntaSchema);

module.exports = {
    Pregunta,
    preguntaSchema
}