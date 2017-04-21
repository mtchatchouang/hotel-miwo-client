/**
 * Created by mtc on 22.05.16.
 */
(function() {
  'use strict';

  angular.module('hotelmiwo.content', ['hotelmiwo.anwender-api'])
    .component('content', {
      // AG-GRID !!!
      templateUrl: 'components/content/content.html',
      controller: function($location, anwenderApi){
        var vm = this;

        vm.dataLoading = true;
        anwenderApi.getUsers(function(response) {
          if(response === undefined) {
            vm.error = true;
            vm.dataLoading = false;
          } else {
            vm.response = response;
          }
        });
      }
    });

})();
