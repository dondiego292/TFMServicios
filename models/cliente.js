var mongoose = require('mongoose');

var Schema = mongoose.Schema;
let gestorSchema = require('./gestor').gestorSchema;


var clienteSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    identificacion: { type: String, required: [true, 'La identificacion es necesario'] },
    telefono: { type: String, required: [true, 'El nombre es necesario'] },
    direccion: { type: String, required: [true, 'La direccion es necesario'] },
    estadoCivil: { type: String, required: false },
    genero: { type: String, required: false },
    fechaInspeccion: { type: Date, required: [true, 'La fechaInspeccion es necesario'] },
    fechaCreacion: { type: Date, required: [true, 'La fechaCreacion es necesario'] },
    fechaVisitado: { type: Date, required: false },
    fechaNacimiento: { type: Date, required: [true, 'La fecha es necesario'] },
    lugarNacimiento: { type: String, required: [true, 'El lugar de Nacimiento es necesario'] },
    ciudad: { type: String, required: [true, 'La ciudad es necesario'] },
    latitud: { type: Number, required: [true, 'La latitud es necesario'] },
    longitud: { type: Number, required: [true, 'La longitud es necesario'] },
    status: { type: Number, required: [true, 'El status es necesario'] },
    gestor: { type: Schema.Types.ObjectId, ref: gestorSchema, required: true },
    gestion: { type: String, required: [true, 'La gestion es necesario'] },
});

let Cliente = mongoose.model('clientes', clienteSchema);

module.exports = {
    Cliente,
    clienteSchema
}