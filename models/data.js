var mongoose = require('mongoose');

var Schema = mongoose.Schema;



var dataSchema = new Schema({
    survey: { type: String },
    json: { type: JSON, required: [true, 'El json es necesario'] },

});

let Data = mongoose.model('datas', dataSchema);

module.exports = {
    Data,
    dataSchema
}