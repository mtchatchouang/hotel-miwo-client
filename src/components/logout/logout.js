/**
 * Created by mtc on 29.05.16.
 */
(function() {
  "use strict";

  angular.module('hotelmiwo.logout', ['hotelmiwo.auth-api'])
    .component('logout', {
      // AG-GRID !!!
      templateUrl: 'components/logout/logout.html',
      controller: function(authApi){
        var vm = this;

        vm.dataLoading = true;
        authApi.Logout(function(response) {
          if(response === undefined) {
            vm.dataLoading = false;
          } else {
            vm.success = true;
            authApi.ClearCredentials();
          }
        });
      }
    });

})();