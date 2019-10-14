const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Method',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
})

app.post('/api/posts', (req, res, next)=>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save();
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get('/api/posts', (req, res, next)=>{
    Post.find().then((documents) => {
        res.status(200).json({
            message: 'Post fetched Successfully',
            posts: documents
        })
    });
})


module.exports = app;