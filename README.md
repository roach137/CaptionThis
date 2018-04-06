# **Caption This! CSCC09 Project Proposal**

*Gavin Zhang, David Wan*

## **Caption This!**

App URL : https://www.cloudtekk.me

Demo Video: https://www.youtube.com/watch?v=tyfr5ykBCPE&feature=youtu.be

Caption This! Is an idea for a browser based multiplayer game. In this game players will take turn uploading an image from their devices. Once this image is uploaded the remaining players will, at the same time, each come up with a caption or title for the image (preferably a humorous one) within a set time limit. After all the captions are in, the original poster of the image chooses their favourite one, the author of the winning caption gets a point and the game continues to the next round with a new uploader. If an uploader fails to upload an image before their time expires the game simply skips their turn and continues to the next round, if a player fails to write a caption within the time limit they will be ineligible to score a point that round. If all players fail to write a caption within the time limit, then that round is discarded. The game continues until a player reaches a score limit which is set by the first player to join the game.

The game will require a minimum of 3 players (otherwise there would be no actual competition) and allow a maximum of 5 players (subject to change).

## **Beta Version**

Ideally we would have much of the core application working by the Beta. These features include but are not necessarily limited to:
* Users may create accounts and log in (all usernames must be unique)
* Users can set up a game of caption this or join others games
* Core features of the game that should be working are: user upload of image, user creation of various captions, uploader selection of their favourite caption, display of winning caption and image on all screens
* The player minimum and maximum should be enforced

## **Final Version**
Extra features that we would like to have by the final version
* All images and captions should be deleted from the database upon game completion (a 5 point game with 5 players can have between 5 and 21 images and 25 to 105 captions, this would add up very quickly and lead to an unnecessarily large database)
* Lobbies can have more than 5 people (server side tweak, risky to actually do due to latency but theoretically possible)

## **Technologies**
We are planning to use MongoDB hosted on Mongo Atlas to store user information such as usernames, salted hashes of passwords etc. We also plan to use socket.io to enable realtime synchronization between players to make the experience more interactive. Express.js will be used to handle the backend of the web app and ReactJS will be used to create the front end.

## **Challenges**
### Mobile Support
* Caption-It is a relatively lightweight game, and it may be more convinient for some to play on their mobile phone rather than a computer. In order to accomplish this the app must detect when a user is on a mobile device rather than a computer and then show a different layout for all pages.
### ReactJS Single Page Application
* Caption-It is a single page application designed in ReactJS. Routing between pages is accomplished with the React router and only a single html file exists in the application.
### Synchronization
* The client's screens must be updated once the host uploads an image, and the hosts screen must be updated once the captions are submitted. This is accomplished through the use of Sockets to emit signals to specific lobbies once certain conditions have been reached. These conditions include: Host uploaded image, all captions submitted, host selected caption, move on to next round.
### Managing Lobbies
* Every user who is logged into the game is not in the same lobby, a lobby consists of only the 5 players participating in a particular match, data must not be sent to or be retrieved by the wrong lobby.
### Latency
* With multiple lobbies with up to 5 players in each one and only one server it is very likely that latency will be an issues since it is only possible for the server to process one request at a time.

## **API Documentation**
### SIGNIN (POST)
* Given a username and a password, get from the database the salt associated with that username. Compute the salted hash and check for a match. If correct, sign the user in. If incorrect or the username does not exist, do not allow the user to sign in.
* Body: Object
    * username: string (account username)
    * password: string (salted hash of the password)
* Status 200 -> User signed in successfully
    * Content: application/json
    * Body: "User signed in"
* Status 401 -> Username does not exist or incorrect password
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -X POST https://www.cloudtekk.me -H "Content-Type: application/json" -d '{"username":"mallory","password":"pass4mallory"}' https://www.cloudtekk.me/signup/
```

### SIGNUP (POST)
* Given a username and a password, generate a salt value, create a salted hash for the password and add the user to the database. Then sign that user in.
* Body: Object
    * username: string (account username)
    * password: string (salted hash of the password)
* Status 200 -> User signed in successfully
    * Content: application/json
    * Body: "User signed up"
* Status 400 -> Username already in use
    * Content: application/json
    * Body: "user already exists"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -X POST -H "Content-Type: application/json" -d '{"username":"mallory","password":"pass4mallory"}' -c cookie.txt https://www.cloudtekk.me/signin/
```

### SIGNOUT (GET)
* Sign an authenticated user out of the application
* Status 200 -> User signed in successfully
    * Content: application/json
    * Body: "signed out"
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -b cookie.txt https://www.cloudtekk.me/signout/
```

### GET IMAGE (GET)
* Get an image from the database in Object Representation given an image ID
* Status 200 -> Image obtained successfully
    * Content: application/json
    * Body: image object
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 404 -> Image does not exist
    * Content: application/json
    * Body: "Image ID does not exist"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -b cookie.txt https://www.cloudtekk.me/api/images/5ac3ef9df455c90014dd6ada/
```

### GET IMAGE FILE (GET)
* Get an image file from the database given its ID
* Status 200 -> Image obtained successfully
    * Content: application/json
    * Body: image file
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 404 -> Image does not exist
    * Content: application/json
    * Body: "Image ID does not exist"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -b cookie.txt https://www.cloudtekk.me/api/images/5ac3ef9df455c90014dd6ada/image/
```

### CREATE LOBBY (POST)
* Create a lobby with a given name hosted by the currently signed in user
* Body: Object
    * Lobby.name: string (lobby name)
* Status 200 -> Lobby created successfully
    * Content: application/json
    * Body: lobby object
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -X POST -b cookie.txt -H "Content-Type: application/json" -d '{"name":"My Lobby","host":"mallory"}' https://www.cloudtekk.me/api/lobbies/
```

### JOIN LOBBY (PATCH)
* Given a lobby ID add the currently signed in user to the lobby
* Status 200 -> Successfully joined lobby
    * Content: application/json
    * Body: "Successfully joined lobby"
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 409 -> Lobby is full
    * Content: application/json
    * Body: "Lobby is full"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -X PATCH -b cookie.txt -H "Content-Type: application/json" -d '{"action":"join"}' https://www.cloudtekk.me/api/lobbies/5ac792f154b80a00142d06b0/
```

### GET PLAYERS IN LOBBY (GET)
* Given a lobby ID, get a list of the players in that lobby
* Status 200 -> Players retreived successfully
    * Content: application/json
    * Body: list of the players
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 404 -> Lobby not found
    * Content: application/json
    * Body: "lobby does not exist"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -b cookie.txt https://www.cloudtekk.me/api/lobbies/5ac792f154b80a00142d06b0/players/
```

### GET LOBBIES (GET)
* Get a list of active lobbies
* Status 200 -> Lobbies found
    * Content: application/json
    * Body: list of lobbies
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -b cookie.txt https://www.cloudtekk.me/api/lobbies/
```

### GET LOBBY HOST (GET)
* Get the username of the host of a lobby given a lobby ID
* Status 200 -> Host found
    * Content: application/json
    * Body: Player information object
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 404 -> Lobby not found
    * Content: application/json
    *Body: "Lobby not found"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -b cookie.txt https://www.cloudtekk.me/api/lobbies/5ac792f154b80a00142d06b0/host/
```

### POST IMAGE (POST)
* Post an image to a lobby
* Body: Object
    * lobbyID: string (the id of the lobby)
* Status 200 -> image posted successfully
    * Content: application/json
    * Body: image object
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
```
curl -b cookie.txt -X POST -F "file=@/home/radiantwings/Pictures/continent.png" -F "lobbyId=5ac792f154b80a00142d06b0" https://www.cloudtekk.me/api/images/
```

### POST CAPTION (POST)
* Post a caption to an image in a lobby
* Body: Object
    * caption: string (caption text)
    * lobbyId: string (id of lobby)
    * imageId: string (id of image)
* Status 200 -> caption posted successfully
    * Content: application/json
    * Body: caption object
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
* <TODO : REQUEST TEXT>

### GET CAPTIONS (GET)
* Get the captions associated with an image
* Status 200 -> captions retrieved successfully
    * Content: application/json
    * Body: list of captions
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
* <TODO : REQUEST TEXT>

### GET CAPTIONS (GET)
* Get the captions associated with an image
* Status 200 -> captions retrieved successfully
    * Content: application/json
    * Body: list of captions
* Status 401 -> Not authenticated
    * Content: application/json
    * Body: "access denied"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
* <TODO : REQUEST TEXT>

### DELETE LOBBY (DELETE)
* Delete a lobby given its lobby ID
* Status 200 -> Lobby deleted successfully
    * Content: application/json
    * Body: "Lobby deleted successfully"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
* <TODO : REQUEST TEXT>

### DELETE CAPTIONS (DELETE)
* Delete captions associated with a specific lobby ID
* Status 200 -> Captions deleted successfully
    * Content: application/json
    * Body: "Captions for lobby deleted successfully"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
* <TODO : REQUEST TEXT>

### DELETE IMAGES (DELETE)
* Delete images associated with a specific lobby ID
* Status 200 -> images deleted successfully
    * Content: application/json
    * Body: "Images for lobby deleted successfully"
* Status 500 -> Internal server error
    * Content: application/json
    * body: "internal server error"
* <TODO : REQUEST TEXT>
