const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const app = express();
mongoose.connect('mongodb+srv://vinay:kRaRB0CaZUCT8gos@cluster0-h35hz.mongodb.net/node-angular?retryWrites=true&w=majority', {useNewUrlParser: true})
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(() => {
        console.log('connection failed');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT,  DELETE, OPTIONS'
    );
    next();
})

app.use('/api/posts', postRoutes);


module.exports = app;