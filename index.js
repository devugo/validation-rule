const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//  Routes import
const homeRoute = require('./routes/home');
const validationRoute = require('./routes/validation');

// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(homeRoute);
app.use(validationRoute);

app.listen(8080);