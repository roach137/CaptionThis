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
