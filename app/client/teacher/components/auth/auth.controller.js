(function () {
    "use strict";

    angular
        .module('teacherApp')
        .controller('authController', authController);

    authController.$inject = ['$location', 'authService', 'userData'];

    function authController($location, authService, userData) {
        const params = $location.search();
        const token = params.access_token;

        if (token) {
            authService.storeUserCredentials(`Bearer${token}`);
            userData.store('scope', params.scope);
            userData.store('userId', params.user_id);
            userData.store('userName', params.user_name);
            userData.addIdToHttpHeader();
            $location.path('/').search({});
        } else {
            authService.sendToAuthentication();
        }
    }
})();
