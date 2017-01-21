(function () {
    "use strict";

    angular
        .module('teacherApp')
        .directive('alert', alert);

    alert.$inject = ['$timeout'];

    function alert($timeout) {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            link: scope => {
                scope.icons = {
                    'success': '../public/images/icons/check-mark-correct.svg',
                    'error': '../public/images/icons/attention.svg'
                };
                scope.close = () => {
                    scope.alert.show = false;
                };
                scope.options.apply = (alert) => {
                    scope.alert = alert;
                    if (alert.hasOwnProperty('timeOut') && alert.timeOut) {
                        $timeout(() => {
                            scope.alert.show = false;
                        }, alert.timeOut);
                    }
                }
            },
            templateUrl: '../teacher/components/shared/directives/alert/alert.view.html'
        };
    }
})();