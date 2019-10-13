const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
const app = express();
mongoose.connect('mongodb+srv://vinay:kRaRB0CaZUCT8gos@cluster0-h35hz.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
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
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get('/api/posts', (req, res, next)=>{
    const posts = [
        {id: 'asfasf', title: 'First Post', content: 'this is first post'},
        {id: 'asfasadsf', title: 'Second Post', content: 'this is second post'},
        {id: 'asfasf', title: 'Third Post', content: 'this is third post'},
    ];
    res.status(200).json({
        message: 'Post fetched Successfully',
        posts: posts
    })
})


module.exports = app;