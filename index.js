const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//  Routes import
const homeRoute = require('./routes/home');
const validationRoute = require('./routes/validation');

//  Body parser
app.use(bodyParser.urlencoded());

app.use(homeRoute);
app.use(validationRoute);

app.listen(3000);