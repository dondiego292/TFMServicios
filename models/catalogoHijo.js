var mongoose = require('mongoose');
let catalogoPadreSchema = require('./catalogoPadre').catalogoPadreSchema;

var Schema = mongoose.Schema;



var catalogoHijoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    codigo: { type: String, required: [true, 'El codigo es necesario'] },
    valor: { type: String, required: [true, 'El valor es necesario'] },
    catalogoPadre: { type: Schema.Types.ObjectId, ref: catalogoPadreSchema, required: true },
});

let CatalogoHijo = mongoose.model('catalogosHijos', catalogoHijoSchema);

module.exports = {
    CatalogoHijo,
    catalogoHijoSchema
}