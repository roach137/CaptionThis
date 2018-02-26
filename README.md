# **Caption This! CSCC09 Project Proposal**

*Gavin Zhang, David Wan*

## **Caption This!**

Caption This! Is an idea for a browser based multiplayer game. In this game players will take turn uploading an image from their devices. Once this image is uploaded the remaining players will, at the same time, each come up with a caption or title for the image (preferably a humorous one) within a set time limit. After all the captions are in, the original poster of the image chooses their favourite one, the author of the winning caption gets a point and the game continues to the next round with a new uploader. If an uploader fails to upload an image before their time expires the game simply skips their turn and continues to the next round, if a player fails to write a caption within the time limit they will be ineligible to score a point that round. If all players fail to write a caption within the time limit, all players including the uploader lose a point. The game continues until a player reaches a score limit which is set by the first player to join the game.

The game will require a minimum of 3 players (otherwise there would be no actual competition) and allow a maximum of 5 players (subject to change).

## **Beta Version**

Ideally we would have much of the core application working by the Beta. These features include but are not necessarily limited to:
* Users may create accounts and log in (all usernames must be unique)
* Users can set up a game of caption this or join others games
* Core features of the game that should be working are: user upload of image, user creation of various captions, uploader selection of their favourite caption
* The time limit for uploading an image and then captioning on that image should be in place and strictly enforced
* The player minimum and maximum should be enforced

## **Final Version**
Extra features that we would like to have by the final version
* All images and captions should be deleted from the database upon game completion (a 5 point game with 5 players can have between 5 and 21 images and 25 to 105 captions, this would add up very quickly and lead to an unnecessarily large database)
* Users who create games of Caption This should be able to tweak some of the rules of the game

## **Technologies**
We are planning to use neDB to store user information such as usernames, salted hashes of passwords, how many matches a player has played. We also plan to use socket.io to enable realtime chat between players to make the experience more interactive. Express.js will be used to handle the UI of the web app.

## **Challenges**
### Enforcing round time limits
* The round time limit must be synchronized to whenever the uploader uploads the image rather than when the receivers actually receive the image so as to not allow timers to expire for some but the round continuing anyways since the last receiver's timer has not yet expired.
### Synchronization
* An issue that can arise from the enforced time limit, especially with larger files (excessively large images) is that on a slow connection they can take a while to show up, if this occurs it's possible that a player with slow connection may only have their image load in seconds before the round ends, giving them a severe disadvantage compared to others.
### Managing Lobbies
* Every user who is logged into the game is not in the same lobby, a lobby consists of only the 5 players participating in a particular match, data must not be sent to or be retrieved by the wrong lobby.
### Latency
* With multiple lobbies with up to 5 players in each one and only one server it is very likely that latency will be an issues since it is only possible for the server to process one request at a time.
### Live Chat
* Since there will be multiple lobbies, developing a way to manage all chat rooms for each lobby will be another challenge.
