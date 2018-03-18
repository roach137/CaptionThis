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
const cookie = require('cookie');
const session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cloudtek"

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('build'));

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized : true,
  cookie: {httpOnly: true, sameSite: true}
}));

if (app.get('env') === 'production') {
  session.cookie.secure = true;
  session.cookie.sameSite = true;
}

app.use(function(req, res, next){
    var username = (req.session.username)? req.session.username : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
          path : '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    next();
});

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

function generateSalt (){
    return crypto.randomBytes(16).toString('base64');
}

function generateHash (password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

var isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

var sanitizeContent = function(req, res, next) {
    req.body.content = validator.escape(req.body.content);
    next();
}

var checkUsername = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("bad input");
    next();
};

// app.get('/api/hello/', function(req, res, next) {
//   console.log("Hello");
//   MongoClient.connect(url, function(err, client) {
//     if (err) throw err;
//     console.log("connected to db");
//     var db = client.db('lobbies');
//     db.createCollection("lobby", function(err, res) {
//       if (err) throw err;
//       console.log("Collection created");
//       db.collection("lobby").insertOne({name: "MyLobby", players:"5"}, function(err, res) {
//         if (err) throw err;
//         console.log("Inserted document" + res);
//         client.close();
//       });
//
//     });
//
//   });
//
// });
app.post('/signin/', function(req, res, next) {
  MongoClient.connect(url, function(err, database) {
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    var username = req.body.username;
    var password = req.body.password;
    db.collection('users').findOne({_id : username}, function(err, result) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      if (!result) {
        database.close();
        return res.status(409).end("Username does not exist");
      }
      var salt = result.salt;
      var hash = generateHash(password, salt);
      // console.log(hash);
      // console.log(result.saltedHash);
      if (hash !== result.saltedHash) {
        database.close();
        return res.status(401).end("access denied");
      }
      // console.log("Logged in");
      res.status(200)
      return res.json("User " + username + " signed in");
    });
  });
});

app.post('/signup/', function(req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    var username = req.body.username;
    var password = req.body.password;
    db.collection('users').findOne({_id : username}, function(err, result){
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      if (result) {
        database.close();
        return res.status(409).end("Username " + username + " already exists.");
      }
      var salt = generateSalt();
      var saltedHash = generateHash(password, salt);
      db.collection('users').insertOne({_id : username, salt : salt, saltedHash : saltedHash}, function(err, entry) {
        if (err) {
          database.close();
          return res.status(500).end(err.toString());
        }
        // console.log(entry.ops);
        res.status(200);
        return res.json("User " + username + " signed up");
      });
    });

  });
})

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

   socket.on('test', function(msg) {
     console.log("The message is " + msg);
     io.emit('testresp', "Hello from server to " + socket.id);
   })
});

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});
