var mongoose = require('mongoose');
let preguntaSchema = require('./pregunta').preguntaSchema;

var Schema = mongoose.Schema;



var reglaSchema = new Schema({
    pregunta: { type: Schema.Types.ObjectId, ref: preguntaSchema, required: true },
    codigoPrincipal: { type: String, required: [true, 'El codigo principal es necesario'] },
    codigoDependiente: { type: String, required: [true, 'La codigo dependiente es necesario'] },
    valor: { type: String, required: [true, 'El valor es necesario'] },
    accion: { type: String, required: [true, 'La accion es necesaria'] },
});

let Regla = mongoose.model('reglas', reglaSchema);

module.exports = {
    Regla,
    reglaSchema
}