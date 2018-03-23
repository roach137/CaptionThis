// var api = (function(){
//   "use strict";
//
//   function send(method, url, data, callback){
//         var xhr = new XMLHttpRequest();
//         xhr.onload = function() {
//             if (xhr.status !== 200) callback("[" + xhr.status + "] " + xhr.responseText, null);
//             else callback(null, JSON.parse(xhr.responseText));
//         };
//         xhr.open(method, url, true);
//         if (!data) xhr.send();
//         else{
//             xhr.setRequestHeader('Content-Type', 'application/json');
//             xhr.send(JSON.stringify(data));
//         }
//     }
//
//     var module = {};
//
//     module.signup = function(username, password, callback) {
//       send('POST', '/signup/', {username : username, password : password}, callback);
//     };
// });

function send(method, url, data, callback){
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
          if (xhr.status !== 200) callback("[" + xhr.status + "] " + xhr.responseText, null);
          else callback(null, JSON.parse(xhr.responseText));
      };
      xhr.open(method, url, true);
      if (!data) xhr.send();
      else{
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(data));
      }
}

function sendFiles(method, url, data, callback){
    var formdata = new FormData();
    Object.keys(data).forEach(function(key){
        var value = data[key];
        formdata.append(key, value);
    });
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
        else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    xhr.send(formdata);
}

export function getCurrentUser(){
    var l = document.cookie.split("username=");
    if (l.length > 1) return l[1];
    return null;
}

export function signup(username, password, callback) {
  // console.log('sending signup POST');
  send('POST', '/signup/', {username : username, password : password}, callback);
}

export function signin(username, password, callback) {
  // console.log('sending signup POST');
  send('POST', '/signin/', {username : username, password : password}, callback);
}

export function addImage(lobbyId, file, callback) {
  sendFiles('POST', '/api/images/', {lobbyId : lobbyId, file : file}, callback);
}

export function createLobby(name, host, callback) {
  send('POST', '/api/lobbies/', {name: name, host : host}, callback);
}

export function getPlayers(lobbyId, callback) {
  send('GET', '/api/lobbies/' + lobbyId + '/players/', null, callback);
}
