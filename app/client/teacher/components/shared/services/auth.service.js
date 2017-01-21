(function() {
    'use strict';

    angular
        .module('teacherApp')
        .service('authService', authService);

    authService.$inject = ['$http', '$window'];
    
    function authService($http, $window) {
        let LOCAL_TOKEN_KEY = 'tokenKey';
        let AUTHENTICATED = 'isAuthenticated';
        let isAuthenticated = false;
        let authToken;

        function loadUserCredentials() {
            const token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            $window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            $window.localStorage.setItem(AUTHENTICATED, true);
            useCredentials(token);
        }

        function useCredentials(token) {
            isAuthenticated = true;
            authToken = token;
            $http.defaults.headers.common['authorization'] = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            isAuthenticated = false;
            $http.defaults.headers.common['Authorization'] = undefined;
            $window.localStorage.removeItem(LOCAL_TOKEN_KEY);
            $window.localStorage.setItem(AUTHENTICATED, false);
        }

        function checkIfAuthenticated() {
            return $window.localStorage.getItem(AUTHENTICATED);
        }

        function sendToAuthentication() {
            $http.get('/authentication');
        }

        function logout() {
            destroyUserCredentials();
        }

        return {
            logout,
            sendToAuthentication,
            checkIfAuthenticated,
            storeUserCredentials,
            loadUserCredentials
        };
    }
})();
