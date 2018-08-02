const functions = require('firebase-functions');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', './views');
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('login/index', { layout: false });
});

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('index');
});

app.get('/utilizador', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('utilizador/index');
});

exports.app = functions.https.onRequest(app);
