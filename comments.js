//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

//Set up the body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set up the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

//GET /comments
app.get('/comments', (req, res) => {
    fs.readFile('./comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading comments.json');
            return;
        }
        res.send(JSON.parse(data));
    });
});

//POST /comments
app.post('/comments', (req, res) => {
    fs.readFile('./comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading comments.json');
            return;
        }
        let comments = JSON.parse(data);
        let newComment = req.body;
        newComment.id = comments.length + 1;
        comments.push(newComment);
        fs.writeFile('./comments.json', JSON.stringify(comments, null, 4), (err) => {
            if (err) {
                res.status(500).send('Error writing to comments.json');
                return;
            }
            res.send(newComment);
        });
    });
});

//GET /comments/:id
app.get('/comments/:id', (req, res) => {
    let id = req.params.id;
    fs.readFile('./comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading comments.json');
            return;
        }
        let comments = JSON.parse(data);
        let comment = comments.find(comment => comment.id == id);
        if (comment) {
            res.send(comment);
        } else {
            res.status(404).send('Comment not found');
        }
    });
});

//PUT /comments/:id
app.put('/comments/:id', (req, res) => {
    let id = req.params.id;
    fs.readFile('./comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading comments.json');
            return;