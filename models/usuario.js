var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'SUPERVISOR_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


var usuarioSchema = new Schema({

    username: { type: String, unique: true, required: [true, 'El username es necesario'] },
    dni: { type: String, required: [true, 'El dni es necesario'] },
    nombres: { type: String, required: [true, 'Los nombres son necesarios'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    fechaCreacion: { type: Date, required: false },
    fechaActualizacion: { type: Date, required: false },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

let Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = {
    Usuario,
    usuarioSchema
}