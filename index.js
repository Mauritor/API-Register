const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const User = require('./models/Users')
require('dotenv').config()

const app = express();

// cors
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
//CLOUD-MONGO
const user = process.env.USER;
const password = process.env.PASSWORD;
const dbName = process.env.DBNAME
mongoose.connect(`mongodb+srv://${user}:${password}@cluster0-ghrs9.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

// import routes
const authRoutes = require('./routes/auth');
const logueoRoutes = require('./routes/login');
const validateToken = require('./routes/validate-token');
const protegidaRoutes = require('./routes/ruta-protegida');   

// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/user', logueoRoutes);
app.use('/api/protegida', validateToken, protegidaRoutes);
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});
//PRUEBA
app.get('/api/users', async (req, res)=> {
    const usuarios = await User.find();
    res.json(usuarios);
})
// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})