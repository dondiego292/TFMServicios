// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var imagenesRoutes = require('./routes/imagenes');
var encuestaRoutes = require('./routes/encuesta');
var catalogoRoutes = require('./routes/catalogo');
var catalogoHijoRoutes = require('./routes/catalogo-hijo');
var tipoPreguntaRoutes = require('./routes/tipo-pregunta');
var preguntaRoutes = require('./routes/pregunta');
var reglaRoutes = require('./routes/regla');
var gestorRoutes = require('./routes/gestor');
var supervisorGestorRoutes = require('./routes/supervisor-gestor');
var encuestaGestorRoutes = require('./routes/encuesta-gestor');
var rutaRoutes = require('./routes/ruta');
//movil
var movilLoginRoutes = require('./routes/movil/login');
var movilEncuestaRoutes = require('./routes/movil/encuesta');
var movilDataRoutes = require('./routes/movil/data');
var movilFotoRoutes = require('./routes/movil/foto');
var movilEventRoutes = require('./routes/movil/event');
var movilClienteRoutes = require('./routes/movil/cliente');


// Conexión a la base de datos
//mongoose.connection.openUri('mongodb://localhost:27017/gestor', (err, res) => {
mongoose.connection.openUri('mongodb://gestor:gestor123@ds125479.mlab.com:25479/gestor', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/img', imagenesRoutes);
app.use('/encuesta', encuestaRoutes);
app.use('/catalogo', catalogoRoutes);
app.use('/catalogo/hijo', catalogoHijoRoutes);
app.use('/tipo/pregunta', tipoPreguntaRoutes);
app.use('/pregunta', preguntaRoutes);
app.use('/regla', reglaRoutes);
app.use('/gestor', gestorRoutes);
app.use('/supervisor', supervisorGestorRoutes);
app.use('/encuesta/gestor', encuestaGestorRoutes);
app.use('/ruta', rutaRoutes);
//movil
app.use('/movil/login', movilLoginRoutes);
app.use('/movil/encuesta', movilEncuestaRoutes);
app.use('/movil/data', movilDataRoutes);
app.use('/movil/foto', movilFotoRoutes);
app.use('/movil/event', movilEventRoutes);
app.use('/movil/cliente', movilClienteRoutes);
/*app.use('/plato', platoRoutes);
app.use('/cliente', clienteRoutes);
app.use('/tienda', tiendaRoutes);
app.use('/consumo', consumoRoutes);*/

app.use('/', appRoutes);

// Escuchar peticiones
app.listen(process.env.PORT || 3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});