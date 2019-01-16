var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var rutaSchema = new Schema({

    Device: { type: String, required: false },
    Latitud: { type: Number, required: false },
    Longitud: { type: Number, required: false },
    UUID: { type: String, required: false },
    Altitud: { type: Number, required: false },
    Accuracy: { type: Number, required: false },
    StartDate: { type: Date, required: false },
    StartTime: { type: String, required: false },
    EndTime: { type: Number, required: false },
    Bateria: { type: Number, required: false },
    Gestor: { type: String, required: false }
});

let Ruta = mongoose.model('rutas', rutaSchema);

module.exports = {
    Ruta,
    rutaSchema
}