const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded());


app.use('/', (req, res, next) => {
    console.log('In the middleware 2');
    res.send('<h1>Hello from express');
});

app.listen(3000);