var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var tipoPreguntaSchema = new Schema({

    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
});

let TipoPregunta = mongoose.model('tipoPreguntas', tipoPreguntaSchema);

module.exports = {
    TipoPregunta,
    tipoPreguntaSchema
}