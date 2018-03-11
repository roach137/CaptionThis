const PORT = 5000;

const https = require('https');
const express = require('express');
const socketIo = require('socket.io');
const fs = require('fs');
var privateKey = fs.readFileSync( 'server.key' );
var certificate = fs.readFileSync( 'server.crt' );
var config = {
        key: privateKey,
        cert: certificate
};

const app = express();
const server = https.createServer(config, app);
const io = socketIo(server);
const path = require('path');
const crypto = require('crypto');
const validator = require('validator');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// app.use(express.static('../public'));
app.use(express.static('node_modules'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.get('/api/hello/', function(req, res, next) {
  res.status(200);
  return res.json("Hello from Express!");
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

   socket.on('test', function(msg) {
     console.log("The message is " + msg);
   })
});

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});
