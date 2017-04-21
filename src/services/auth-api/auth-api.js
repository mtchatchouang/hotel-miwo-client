/**
 * Created by mtc on 16.06.16.
 */
(function() {
  "use strict";
  angular.module('hotelmiwo.auth-api', [])
    .factory('authApi', function ($http, $cookieStore, $rootScope, Base64) {
      var service = {};
      if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname +
          (window.location.port ? ':' + window.location.port : '');
      }

      var loginUrl = window.location.origin + "/api/hello";
      var logoutUrl = window.location.origin + "/api/logout";

      service.Login = function (credentials, callback) {
        $http({
          method  : 'GET',
          url     : loginUrl,
          data    : $.param(credentials),  // pass in data as strings
          headers : { 'Content-Type': 'application/x-www-form-urlencoded',
            authorization : "Basic " + btoa(credentials.username + ":" + credentials.password) }  // set the headers so angular passing info as form data (not request payload)
        }).success(function (response) {
          callback(response);
        }).error(function (response) {
          callback(response);
        });

      };

      service.Logout = function (callback) {
        $http({
          method  : 'GET',
          url     : logoutUrl
        }).success(function (response) {
          callback(response);
        }).error(function (response) {
          callback(response);
        });

      };

      service.SetCredentials = function (credentials) {
        var authdata = credentials.username + ':' + credentials.password;

        $rootScope.globals = {
          currentUser: {
            credentials: credentials,
            username: username,
            authdata: authdata
          }
        };

        $http.defaults.headers.common.Authorization = 'Basic ' + authdata;
        $cookieStore.put('globals', $rootScope.globals);
      };

      service.ClearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
      };

      return service;
    })
    .factory('Base64', function () {
      var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

      return {
        encode: function (input) {
          var output = "";
          var chr1, chr2, chr3 = "";
          var enc1, enc2, enc3, enc4 = "";
          var i = 0;

          do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
              enc4 = 64;
            }

            output = output +
              keyStr.charAt(enc1) +
              keyStr.charAt(enc2) +
              keyStr.charAt(enc3) +
              keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
          } while (i < input.length);

          return output;
        },

        decode: function (input) {
          var output = "";
          var chr1, chr2, chr3 = "";
          var enc1, enc2, enc3, enc4 = "";
          var i = 0;

          // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
          var base64test = /[^A-Za-z0-9\+\/\=]/g;
          if (base64test.exec(input)) {
            window.alert("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.");
          }
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

          do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

          } while (i < input.length);

          return output;
        }
      };
    });

})();

