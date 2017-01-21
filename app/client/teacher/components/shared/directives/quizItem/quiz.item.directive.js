(function () {
    "use strict";

    angular
        .module('teacherApp')
        .directive('quizItem', quizItem);

    quizItem.$inject = ['$rootScope', '$location', 'quizFactory'];

    function quizItem($rootScope, $location, quizFactory) {
        return {
            restrict: 'E',
            scope: {
                alertOptions: '=',
                quiz: '=',
                copy: '&',
                remove: '&',
                participate: '&',
                removeFromFavouriteList: '&',
                list: '@',
                index: '@',
                disableEdit: '@',
                tab: '@',
                assign: '&'
            },
            templateUrl: '../teacher/components/shared/directives/quizItem/quiz.item.view.html',
            link: (scope, element, attrs) => {
                scope.editQuiz = (disabled) => {
                    if (!disabled) {
                        $rootScope.redirectUrl = {
                            url: '/quizzes/',
                            params: {
                                active: scope.tab
                            }
                        };
                        $location.path('/quiz-questions/' + scope.quiz._id).search({});
                    }
                };

                scope.isPublicVisibility = () => {
                    return scope.quiz.visible === 'Everyone';
                };

                scope.isFavourite = () => {
                    return scope.quiz.favourites && scope.quiz.favourites.length > 0;
                };

                scope.isInFavouriteList = () => {
                    return scope.list === 'favouriteQuizzes';
                };

                scope.getVisibilityIcon = () => {
                    return scope.isPublicVisibility()
                        ? '../public/images/icons/lock.svg'
                        : '../public/images/icons/unlock.svg';
                };

                scope.getFavouriteIcon = () => {
                    return scope.isFavourite()
                        ? '../public/images/icons/heart-full.svg'
                        : '../public/images/icons/heart-empty.svg' ;
                };

                scope.getFavouriteLabel = () => {
                    return scope.isFavourite()
                        ? 'Added to favourites'
                        : 'Add to favourites';
                };

                const strategies = {
                    addition: {
                        action: 'addition',
                        worker: quizFactory.addToFavourites,
                        successMsg: 'Quiz was added to favourites successfully',
                        errorMsg: 'Quiz cannot be added to favourites :('
                    },
                    removal: {
                        action: 'removal',
                        worker: quizFactory.removeFromFavourites,
                        successMsg: 'Quiz was removed from favourites successfully',
                        errorMsg: 'Quiz cannot be removed from favourites :('
                    }
                };

                scope.switchFavourites = () => {
                    const strategy = scope.isFavourite()
                        ? strategies.removal
                        : strategies.addition;

                    strategy.worker(scope.quiz._id)
                        .then(quiz => {
                            scope.quiz = quiz;

                            if (strategy.action === 'removal' && scope.isInFavouriteList()) {
                                scope.removeFromFavouriteList({ id: quiz._id });
                            }
                        })
                        .catch(err => showAlert(
                            scope.alertOptions.apply,
                            'error',
                            strategy.errorMsg,
                            3000
                        ));
                }
            }
        };
    }
})();