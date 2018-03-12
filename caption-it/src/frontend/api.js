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

export function signup(username, password, callback) {
  // console.log('sending signup POST');
  send('POST', '/signup/', {username : username, password : password}, callback);
}
