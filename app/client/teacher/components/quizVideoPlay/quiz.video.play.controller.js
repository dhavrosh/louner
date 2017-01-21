(function () {
    "use strict";

    angular
        .module('teacherApp')
        .controller('quizVideoPlayController', quizVideoPlayController);

    quizVideoPlayController.$inject = [
        '$location',
        '$routeParams',
        'youtubeEmbedUtils',
        'quizFactory'
    ];

    function quizVideoPlayController(
        $location,
        $routeParams,
        youtubeEmbedUtils,
        quizFactory
    ) {
        const vm = this;

        vm.videoUrl = '';
        vm.videoId = '';
        vm.title = '';
        vm.alertOptions = {};
        vm.playerVars = {
            autoplay: 1
        };
        vm.next = next;

        activate();

        function activate() {
            const quizUserId = $routeParams.quizUserId;

            quizFactory.getQuizUserById(quizUserId)
                .then(quizUser => {
                    if (quizUser) {
                        vm.title = quizUser.quizId.title;
                        vm.videoUrl = quizUser.quizId.videoUrl;

                        const videoId = getYoutubeVideoUrl(vm.videoUrl);

                        if (videoId) {
                            vm.videoId = videoId;
                        } else {
                            showAlert(vm.alertOptions.apply, 'error', 'Please use a valid YouTube Url')
                        }
                    } else {
                        showAlert(vm.alertOptions.apply, 'error', 'Please use a valid quizUserId')
                    }
                });
        }

        function next() {
            const quizUserId = $routeParams.quizUserId;

            $location.path(`/play/${quizUserId}`);
        }

        function getYoutubeVideoUrl(url) {
            const regExp = /^.*(youtube\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            const match = url.match(regExp);

            return match && match[2];
        }
    }
})();
