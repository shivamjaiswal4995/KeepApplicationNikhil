const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const apiRouter = require('./api/v1');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);

db.init();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'dist')));
//app.use(express.static(path.join(__dirname, '..', 'node_modules')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use('/api/v1', apiRouter);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist/index.html'));
})

// let msg = `Have access to mongodb via MONGO_URL: ${process.env.MONGO_URL} `;
// console.log(msg);

module.exports = server;