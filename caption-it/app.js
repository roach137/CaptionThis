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
const multer = require('multer');
const validator = require('validator');
const cookie = require('cookie');
const session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cloudtek";
var upload = multer({ dest: 'uploads/'});

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
    var db = database.db('users');
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
      //set the session username to the one who logged in
      req.session.username = username;
      res.status(200)
      return res.json("User " + username + " signed in");
    });
  });
});

app.post('/signup/', function(req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('users');
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
        //set the session username to the one who logged in
        req.session.username = username;
        res.status(200);
        return res.json("User " + username + " signed up");
      });
    });

  });
})

/*
LIST OF DATABASE TABLES:
users: the list of users

images: a list of images (should be cleared after every game)
  format: {"_id:":"autogenerated ID", "lobbyID":"lobby", and the file stuff}

captions: a list of captions (cleared after every game)
  format {"_id": "autogenerated ID", "lobbyID":"lobby", "caption":"Caption text", "author":"author"}



*/

//Post an image to a given lobby
//ID in the request URL refers to the lobby ID in this case
// app.post('/api/images/', upload.single('file'), isAuthenticated, function (req,res,next) {
app.post('/api/images/', upload.single('file'), function (req,res,next) {
  MongoClient.connect(url, function(err, database) {
    //We're probably better off copy pasting your code from A2 or A3 (since your mark is higher than mine)
    var db = database.db("images");
    var img = req.file;
    // console.log(img);
    db.collection('images').insertOne(img, function(err, entry) {
      if (err) return res.status(500).end(err.toString());
      res.status(200);

      console.log(entry.ops[0]._id);
      var result = {_id : entry.ops[0]._id}
      return res.json(result);
    })
  });
});

//post a caption for an image given the ID for the image
//I'm not sure if it's better to use image ID or lobby ID here, whichever you think is better (we could do both as well)
app.post('/api/caption/:id/', sanitizeContent, isAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    var imageId = req.params.id;
    var caption = req.params.caption;
    var lobbyId = req.params.lobbyId;
    var author = req.session.username;
    //upload a caption to the database (idk which table yet)
    //it should be formatted as follows:
    // { "caption": "caption", "lobbyID": "lobbyID", "imageID": "imageID"}
    db.collection('captions').insertOne({caption : caption, imageId : imageId, lobbyId : lobbyId}, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      res.status(200);
      return res.json("Caption " + caption + " for " +imageId+ " in lobby " + lobbyId +  " posted successfully.");
    });
  });
});

//Clear all data relevant to a lobby, given the lobby ID
//NOTE
//This should never be called by a user
app.delete('/api/endgame/:id', function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    //Clear all data from all tables where the lobby ID matches the given one
    var lobbyId = req.params.id;
    db.collection('captions').remove({lobbyId: lobbyId}, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      db.collection('images').remove({lobbyId: lobbyId}, function(err, entry) {
        if (err) {
          database.close();
          return res.status(500).end(err.toString());
        }
        res.status(200);
        return res.json("Images for lobby " + lobbyId +  " deleted successfully.");
      });
      res.status(200);
      return res.json("Captions for lobby " + lobbyId +  " deleted successfully.");
    });
  });
});

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
