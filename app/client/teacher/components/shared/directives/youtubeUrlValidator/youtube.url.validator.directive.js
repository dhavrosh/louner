(function () {
    "use strict";

    angular
        .module('teacherApp')
        .directive('youtubeUrlValidator', youtubeUrlValidator);

    youtubeUrlValidator.$inject = [];

    function youtubeUrlValidator() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: (scope, element, attr, ctrl) => {
                function validateYouTubeUrl(url) {
                    if (url) {
                        const regExp = /^.*(youtube\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                        const match = url.match(regExp);

                        if (match && match[2].length == 11) {
                            ctrl.$setValidity('youtubeUrl', true);
                        } else {
                            ctrl.$setValidity('youtubeUrl', false);
                        }
                    } else {
                        ctrl.$setValidity('youtubeUrl', true);
                    }

                    return url;
                }

                ctrl.$parsers.push(validateYouTubeUrl);
            }
        };
    }
})();