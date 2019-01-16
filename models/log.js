var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var logSchema = new Schema({

    IMEI: { type: String, required: false },
    Tipo: { type: Number, required: false },
    Propietario: { type: String, required: false },
    UUID: { type: String, required: false },
    Mensaje: { type: String, required: false },
    Bateria: { type: String, required: false },
    Gestor: { type: String, required: false }
});

let Log = mongoose.model('logs', logSchema);

module.exports = {
    Log,
    logSchema
}