(function() {
  "use strict";

  angular.module('hotelmiwo.login', ['hotelmiwo.auth-api'])
    .component('login', {
      // AG-GRID !!!
      templateUrl: 'components/login/login.html',
      controller: function($location, authApi){
        var vm = this;

        vm.login = function (credentials) {
          vm.dataLoading = true;
          authApi.Login(credentials, function(response) {
            if(response === undefined) {
              vm.error = true;
              vm.dataLoading = false;
            } else {
              authApi.SetCredentials(credentials);
              $location.path('/');
            }
          });
        };
      }
    });

})();
