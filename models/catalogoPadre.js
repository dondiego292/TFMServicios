var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var catalogoPadreSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    codigo: { type: String, required: [true, 'El codigo es necesario'] },
    valor: { type: String, required: [true, 'El valor es necesario'] },
});

let CatalogoPadre = mongoose.model('catalogosPadres', catalogoPadreSchema);

module.exports = {
    CatalogoPadre,
    catalogoPadreSchema
}