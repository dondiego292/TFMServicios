var mongoose = require('mongoose');

var Schema = mongoose.Schema;
let usuarioSchema = require('./usuario').usuarioSchema;


var gestorSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: usuarioSchema, required: true },
    apellidos: { type: String, required: [true, 'El apellido es necesario'] },
    nombres: { type: String, required: [true, 'El nombre es necesario'] },
    imei: { type: String, required: [true, 'El imei es necesario'] },
    fechaCreacion: { type: Date, required: false },
    fechaActualizacion: { type: Date, required: false },
    token: { type: String, required: false },
    nickname: { type: String, required: [true, 'El nickname es necesario'] },
    color: { type: String, required: [true, 'El color es necesario'] },
    fueraServicio: { type: Number, required: false },
});

let Gestor = mongoose.model('gestores', gestorSchema);

module.exports = {
    Gestor,
    gestorSchema
}