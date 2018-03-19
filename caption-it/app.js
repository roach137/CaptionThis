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
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://cloudtek:XXE8sDBttM3alQnT@caption-it-yavcm.mongodb.net/test";
var upload = multer({ dest: 'uploads/'});

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const session = require('express-session');
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

app.use(express.static('build'));

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
        //set the session username to the one who logged in
        req.session.username = username;
        res.status(200);
        return res.json("User " + username + " signed up");
      });
    });

  });
})

app.get('/api/images/:id/', isAuthenticated, function(req, res, next) {
  // console.log("getting image");
  MongoClient.connect(url, function(err, database) {
    if (err) {
      database.close();
      return res.status(500).end(err.toString());
    }
    var db = database.db('cloudtek');
    var imageId = req.params.id;
    db.collection('images').findOne({_id : imageId}, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      if (!entry) {
        database.close();
        return res.status(404).end("Image " + imageId + " does not exist");
      }
      console.log(entry);
      return res.json(entry);
    });
  });
});

/*Get image file with certain id*/
app.get('/api/images/:id/image/', function(req, res) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    db.collection('images').findOne(ObjectId(req.params.id), function(err, data) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      if (!data) {
        database.close();
        return res.status(404).end('image ' + req.params.id + ' does not exists\n');
      }
        var image = data;
        res.status(200);
        res.setHeader('Content-Type', image.mimetype);
        res.sendFile(image.path, {root: __dirname});
        database.close();
    });
  });
});

/*
LIST OF DATABASE TABLES:
users: the list of users

images: a list of images (should be cleared after every game)
  format: {"_id:":"autogenerated ID", "lobbyID":"lobby", "author":"author" and the file stuff}

captions: a list of captions (cleared after every game)
  format {"_id": "autogenerated ID", "lobbyID":"lobby", "caption":"Caption text", "author":"author"}

lobbies: a list of active lobbies (entry cleared upon game closing), turn number should loop back down from 1 to the number of players
  format {"_id": auto generated ID", "p1": "username", "p2", "username" .. up to p5, "turn": turn number, "p1_score":"int" ... p5_score}

*/

//Create a lobby
app.post('/api/lobbies/', isAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    var lobby = {};
    lobby.name = req.body.name;
    lobby.players = [req.body.host];
    lobby.scores = [0];
    lobby.turn = 1;
    //upload a lobby, we can let the lobby ID be auto generated
    db.collection('lobbies').insertOne(lobby, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      res.status(200);
      return res.json(lobby);
    });
  });
});

//Add a new player to a lobby given the lobby ID
app.patch('/api/lobbies/:id/', isAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    console.log("finding game with _id " + req.params.id);
    db.collection('lobbies').findOne({_id:ObjectId(req.params.id)}, function (err, lobby) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      console.log(lobby);
      if (lobby) {
        var username = req.body.username;
        //insert the player into the first open player slot
        if (lobby.players.length == 5) {
          database.close();
          return res.status(409).end("Lobby is full");
        }
        lobby.players.push(username);
        //actually update the lobby
        db.collection('lobbies').update({_id: req.params.id}, lobby, {multi: false}, function(err, success) {
          if (err) {
            database.close();
            return res.status(500).end(err.toString());
          }
          return res.json("Successfully joined lobby");
        });
      }
    });
  });
});

//Add a point to a player's total
app.patch('/api/lobbies/:id/scores/', isAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    var player = req.params.player;
    db.collection('lobbies').findOne({_id:req.params.id}, function (err, lobby) {
      if (lobby) {
        //insert the player into the first open player slot
        if (lobby.p1 == player) {
          lobby.score1++;
        } else if (lobby.p2 == player) {
          lobby.score2++;
        } else if (lobby.p3 == player) {
          lobby.score3++;
        } else if (lobby.p4 == player) {
          lobby.score4++;
        } else if (lobby.p5 == player) {
          lobby.score5++;
        } else {
          return res.json("Lobby is full");
        }
        //actually update the lobby
        db.collection('lobbies').update({_id: req.params.id}, lobby, {multi: false}, function(err, success) {
          return res.json("Successfully updated scores");
        });
      }
    });
  });
});

app.get('/api/lobbies/:id/players/', isAuthenticated, function(req, res) {
  MongoClient.connect(url, function(err, database){
    var db = database.db('cloudtek');
    var lobbyId = req.params.id;
    db.collection('lobbies').findOne(ObjectId(lobbyId), function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      if (!entry) {
        database.close();
        return res.status(404).end("Lobby " + lobbyId + " does not exist");
      }
      database.close();
      return res.json(entry.players);
    })
  });
});

app.get('/api/lobbies/', isAuthenticated, function(req, res){
  MongoClient.connect(url, function(err, database){
    if (err) {
      return res.status(500).end(err.toString());
    }
    var db = database.db('cloudtek');
    db.collection('lobbies').find({}).toArray(function(err, results) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      // console.log(results);
      res.status(200);
      return res.json(results);
    });
  });
});

//Post an image to a given lobby
//ID in the request URL refers to the lobby ID in this case
// app.post('/api/images/', upload.single('file'), isAuthenticated, function (req,res,next) {
app.post('/api/images/', isAuthenticated, upload.single('file'), function (req,res,next) {
  MongoClient.connect(url, function(err, database) {
    // NOTE
    // We need to add the parameters somehow,
    var db = database.db("cloudtek");
    var lobbyId = req.body.lobbyId;
    var img = req.file;
    img.author = req.session.username;
    img.lobbyId = req.body.lobbyId;
    // console.log(img);
    db.collection('images').insertOne(img, function(err, entry) {
      if (err) return res.status(500).end(err.toString());
      res.status(200);
      // console.log(entry.ops[0]._id);
      var result = {_id : entry.ops[0]._id}
      return res.json(result);
    })
  });
});

//post a caption for an image given the ID for the image
//Captions will link to image using imageId
app.post('/api/captions/', isAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    var imageId = validator.escape(req.body.imageId);
    var caption = validator.escape(req.body.caption);
    var lobbyId = validator.escape(req.body.lobbyId);
    var author = req.session.username;
    //upload a caption to the database (idk which table yet)
    //it should be formatted as follows:
    // { "caption": "caption", "lobbyID": "lobbyID", "imageID": "imageID"}
    db.collection('captions').insertOne({caption : caption, imageId : imageId, lobbyId : lobbyId, score: 0}, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      res.status(200);
      return res.json("Caption " + caption + " for image " + imageId +  " posted successfully.");
    });
  });
});


//Voting
app.patch('api/captions/:id/', isAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function(err, database) {
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    db.collection('captions').findOne({_id:ObjectId(req.params.id)}, function (err, caption) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      console.log(caption);
      if (caption) {
        caption.score++;
        db.collection('captions').update({_id: req.params.id}, caption, {multi: false}, function(err, success) {
          if (err) {
            database.close();
            return res.status(500).end(err.toString());
          }
          return res.json("Successfully voted");
        });
      }
    });
  });
});

//Get commands
//Get the captions associated with an image ID
app.get('api/captions/:id/', function(req, res, next) {
  MongoClient.connect(url, function(err, database) {
    if (err) return res.status(500).end(err.toString());
    var db = databasedb('cloudtek');
    var imageId = req.params.id;
    db.collection('captions').find({imageId: imageId}, {caption:1, author:1}, function (err, entry) {
      console.log(entry);
      if (entry) {
        return entry.toArray();
      }
    });
  })
});

//Get the list of active lobbies
app.get('api/lobbies/', function(req, res, next) {
  MongoClient.connect(url, function(err, database) {
    if (err) return res.status(500).end(err.toString());
    var db = databasedb('cloudtek');
    var imageId = req.params.id;
    db.collection('lobbies').find({imageId: imageId}, {caption:1, author:1}, function (err, entry) {
      console.log(entry);
      if (entry) {
        return entry.toArray();
      }
    });
  })
});

//Clear all data relevant to a lobby, given the lobby ID
//NOTE
//These should never be called by a user
app.delete('/api/lobbies/:id', function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    //Clear all data from captions where the lobby ID matches the given one
    var lobbyId = req.params.id;
    db.collection('lobbies').remove({lobbyId: lobbyId}, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      res.status(200);
      return res.json("Lobby " + lobbyId +  " deleted successfully.");
    });
  });
});

app.delete('/api/captions/:id', function (req, res, next) {
  MongoClient.connect(url, function(err, database){
    if (err) return res.status(500).end(err.toString());
    var db = database.db('cloudtek');
    //Clear all data from captions where the lobby ID matches the given one
    var lobbyId = req.params.id;
    db.collection('captions').remove({lobbyId: lobbyId}, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      res.status(200);
      return res.json("Captions for lobby " + lobbyId +  " deleted successfully.");
    });
  });
});

app.delete('/api/images/:id', function (req, res, next) {
  MongoClient.connect(url, function(err, database) {
    var db = database.db('cloudtek');
    //Clear all data from images where the lobby ID matches the given one
    var lobbyId = req.params.id;
    db.collection('images').remove({lobbyId: lobbyId}, function(err, entry) {
      if (err) {
        database.close();
        return res.status(500).end(err.toString());
      }
      res.status(200);
      return res.json("Images for lobby " + lobbyId +  " deleted successfully.");
    });
  });
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   socket.on('room', function(room) {
     socket.join(room);
   });

   socket.on('test', function(data){
     console.log(data);
   });
   socket.on('start', function(data){
     console.log(io.sockets.clients());
     socket.nsp.to(data.room).emit('start', data.msg);
   });

   socket.on('uploaded image', function(data){
     console.log(data.imageId);
     socket.nsp.to(data.room).emit('uploaded image', data.imageId);
   });
   socket.on('voting begins', function(data) {
     socket.nsp.to(data.room).emit('voting begins', null);
   });
});



app.get('/*', function(req, res, next){
  console.log("going to a page");
  res.sendFile('index.html', {root: __dirname + '/build'});
});

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});
