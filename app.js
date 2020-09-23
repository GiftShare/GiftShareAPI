const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const loginRoute = require('./routes/login');

mongoose.connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if(err) {
        console.log('error');
    }else {
        console.log('connected to db');
    }

});

app.use(morgan('dev'));
app.use(bodyparser.json());
app.use('/login', loginRoute);

app.use((req, res, next) => {
    res.json({
        "api": "works B)"
    });
    res.status(200);
});

module.exports = app;