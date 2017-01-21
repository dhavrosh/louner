(function () {
    "use strict";

    angular
        .module('teacherApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', '$rootScope'];

    function homeController($scope, $rootScope) {
        const vm = this;

        activate();

        function activate() {
            $rootScope.quizCloseLocation = null;
            $rootScope.redirectUrl = null;
        }

    }
})();
