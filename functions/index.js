const functions = require('firebase-functions');
const express = require('express');

const app = express();

app.get('/login', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.send('Wild and Free Foundation');
});

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.send('Wild and Free Foundation');
});

exports.app = functions.https.onRequest(app);
