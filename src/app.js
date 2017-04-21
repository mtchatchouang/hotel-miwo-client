(function() {
    'use strict';

    angular.module('hotelmiwo', [
        'ngRoute',
        'ngCookies',
        'ui.bootstrap',
        'pascalprecht.translate',
        'hotelmiwo.home',
        'hotelmiwo.login',
        'hotelmiwo.content',
        'hotelmiwo.ranking',
        'hotelmiwo.logout'
    ]).config(function($routeProvider){
        $routeProvider
            .when('/', {
                template: '<home></home>'
            })
            .when('/home', {
                template: '<home></home>'
            }).when('/login', {
                template: '<login></login>'
            }).when('/login/:error', {
                template: '<login></login>'
            }).when('/logout', {
                template: '<logout></logout>'
            }).when('/ranking', {
                template: '<ranking></ranking>'
            }).when('/content', {
                template: '<content></content>'
            }).otherwise({ redirectTo: '/' });
    }).config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]).config(['$translateProvider', function ($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'lang/',
                suffix: '.json'
            });

            $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
            $translateProvider.preferredLanguage('fr');
        }]).run(['$rootScope', '$location', '$cookieStore', '$http', '$translate',
        function ($rootScope, $location, $cookieStore, $http, $translate) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.currentLang = 'fr';
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.globals.currentUser.authdata;
            }

            $rootScope.setLang = function(lang){
                $rootScope.currentLang = lang;
                $translate.use(lang);
            };
        }])
        .factory('authInterceptor', function($q, $location) {
            var authInterceptor = {
                response: function(response) {
                    if (response.status === 401){
                        $location.path('/login/error');
                        return $q.reject(response);
                    }
                    return response;
                },
                responseError: function(response) {
                    if (response.status === 401){
                        $location.path('/login/error');
                    }
                    return $q.reject(response);
                }
            };
            return authInterceptor;
        });

})();
