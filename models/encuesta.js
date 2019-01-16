var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var encuestaSchema = new Schema({

    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    uuid: { type: String, required: false },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    estado: { type: Number, required: false },
    fechaCreacion: { type: Date, required: false },
    fechaActualizacion: { type: Date, required: false },
    etiqueta: { type: String, required: [true, 'La etiqueta es necesaria'] },
    libre: { type: String, required: [true, 'Libre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
});

let Encuesta = mongoose.model('encuestas', encuestaSchema);

module.exports = {
    Encuesta,
    encuestaSchema
}