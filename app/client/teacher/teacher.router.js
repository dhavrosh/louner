(function () {
    "use strict";

    angular
        .module('teacherApp')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$qProvider'];

    function config($routeProvider, $locationProvider, $qProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "../teacher/components/home/home.view.html",
                controller: "homeController",
                controllerAs: 'vm'
            })
            .when("/auth", {
                template: " ",
                controller: "authController",
                controllerAs: 'vm'
            })
            .when("/quiz/:quizId?", {
                templateUrl: "../teacher/components/quizDescription/quiz.description.view.html",
                controller: "quizDescriptionController",
                controllerAs: 'vm'
            })
             .when("/survey", {
                templateUrl: "../teacher/components/quizDescription/quiz.description.view.html",
                controller: "quizDescriptionController",
                controllerAs: 'vm'                
            })
           .when("/quiz-questions/:quizId", {
                templateUrl: "../teacher/components/quizQuestions/quiz.questions.view.html",
                controller: "quizQuestionsController",
                controllerAs: 'vm'
            })
            .when("/question/:quizId/:questionId?", {
                templateUrl: "../teacher/components/questionAddition/question.addition.view.html",
                controller: "questionAdditionController",
                controllerAs: 'vm'
            })
            .when("/quizzes", {
                templateUrl: "../teacher/components/quizList/quiz.list.view.html",
                controller: "quizListController",
                controllerAs: 'vm'
            })
            .when("/finish", {
                templateUrl: "../teacher/components/quizFinish/quiz.finish.view.html",
                controller: "quizFinishController",
                controllerAs: 'vm'
            })
            .when("/play/:quizUserId", {
                templateUrl: "../teacher/components/playQuiz/play.quiz.view.html",
                controller: "playQuizController",
                controllerAs: 'vm'
            })
            .when("/video/:quizUserId", {
                templateUrl: "../teacher/components/quizVideoPlay/quiz.video.play.view.html",
                controller: "quizVideoPlayController",
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: "/"
            });

        $locationProvider.html5Mode(true);
        $qProvider.errorOnUnhandledRejections(false);
    }

    run.$inject = ['$rootScope', '$http', 'authService', 'userData'];

    function run($rootScope, $http, authService, userData) {
        $rootScope.$on('$routeChangeStart', () => {
            if (typeof $rootScope.worker === 'function') {
                let worker = $rootScope.worker;
                delete $rootScope.worker;

                worker();
            }

            if(authService.checkIfAuthenticated() === 'true') {
                if ($http.defaults.headers.common['Authorization'] == undefined) {
                    authService.loadUserCredentials();
                }

                if (userData.has('userId')) {
                    userData.addIdToHttpHeader();
                }
            }

            if (authService.checkIfAuthenticated() !== 'true') {
               // authService.sendToAuthentication();
            }
        });
    }
})();
