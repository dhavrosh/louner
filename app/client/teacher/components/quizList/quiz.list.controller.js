(function () {
    "use strict";

    angular
        .module('teacherApp')
        .controller('quizListController', quizListController);

    quizListController.$inject = [
        '$uibModal',
        '$routeParams',
        '$location',
        'quizFactory',
        '$rootScope',
        'userData'
    ];

    function quizListController(
        $uibModal,
        $routeParams,
        $location,
        quizFactory,
        $rootScope,
        userData
    ) {
        const vm = this;

        // temporal user
        vm.uid = '585992e1abe3800794da0001';
        vm.warning = 'Are you really want to delete the quiz?';
        vm.isSearchHovered = false;
        vm.activeTab = 0;
        vm.searchText = '';
        vm.myQuizzes = [];
        vm.favouriteQuizzes = [];
        vm.publicQuizzes = [];
        vm.alertOptions = {};
        vm.searchQuiz = searchQuiz;
        vm.createQuiz = createQuiz;
        vm.copyQuiz = copyQuiz;
        vm.removeQuiz = removeQuiz;
        vm.getQuizzesByCreator = getQuizzesByCreator;
        vm.getFavouriteQuizzes = getFavouriteQuizzes;
        vm.getPublicQuizzes = getPublicQuizzes;
        vm.clearSearchText = clearSearchText;
        vm.participate = participate;
        vm.assign = assign;
        vm.removeFromFavouriteList = removeFromFavouriteList;

        activate();

        function activate() {
            // set active tab by index passed via router,
            // default tab - first(0)
            vm.activeTab = +$routeParams.active || 0;
            $rootScope.quizCloseLocation = $location.$$url;
        }

        function getQuizzesByCreator() {
            quizFactory.getQuizzesByCreator(vm.uid)
                .then(quizzes => {
                    vm.myQuizzes = quizzes;
                })
                .catch(err => {
                    console.log(err);
                });
        }

        function getFavouriteQuizzes() {
            const userId = userData.get('userId');

            quizFactory.getFavourites(userId)
                .then(favourites => {
                    vm.favouriteQuizzes = favourites.map(favourite => {
                        return favourite.quizId;
                    });
                    console.log(favourites);
                })
                .catch(err => console.log(err));
        }

        function getPublicQuizzes() {
            quizFactory.getPublicQuizzes(vm.uid)
                .then(quizzes => {
                    vm.publicQuizzes = quizzes;
                })
                .catch(err => {
                    console.log(err);
                });
        }

        function createQuiz() {
            $rootScope.redirectUrl = {
                url: '/quizzes/',
                params: {
                    active: vm.activeTab
                }
            };
            $location.path('/quiz').search({});
        }

        function copyQuiz(source, position) {
            const copy = Object.assign({}, vm[source][position]);

            if (copy.hasOwnProperty('_id')) {
                quizFactory.copyQuiz(copy._id)
                    .then(quiz => {
                        vm[source].push(quiz); // vm[source].splice(position, 0, quiz);
                        showAlert(vm.alertOptions.apply, 'success', 'Quiz was copied successfully');
                    })
                    .catch(err => {
                        console.log(err);
                        showAlert(vm.alertOptions.apply, 'error', 'Copying quiz was failed');
                    });
            } else {
                console.log('Id is required for copying operation');
            }
        }

        function removeQuiz(id, source, position) {
            const modal = $uibModal.open({
                templateUrl: '../teacher/components/shared/directives/closeModal/close.modal.view.html',
                controller: 'closeModalController as vm',
                windowClass: 'modal-close',
                resolve: {
                    warning: () => {
                        return vm.warning;
                    },
                    close: () => {
                        return (modal, data) => {
                            modal.close(data);
                            quizFactory.deleteQuiz(id)
                                .then(res => {
                                    vm[source].splice(position, 1);
                                    showAlert(vm.alertOptions.apply, 'success', 'Quiz was removed successfully');
                                })
                                .catch(err => {
                                    console.log(err);
                                    showAlert(vm.alertOptions.apply, 'error', 'Removing quiz was failed');
                                });
                        }
                    },
                    dismiss: () => {
                        return modal => {
                            modal.dismiss('close');
                        }
                    }
                }
            });
        }

        function assign(title) {
            const modal = $uibModal.open({
                templateUrl: '../teacher/components/shared/directives/assignModal/assign.modal.view.html',
                controller: 'assignModalController as vm',
                windowClass: 'assign-close',
                resolve: {
                    warning: () => {
                        return title;
                    },
                    close: () => {
                        return (modal, data) => {
                            modal.close(data);
                        }
                    },
                    dismiss: () => {
                        return modal => {
                            modal.dismiss('close');
                        }
                    }
                }
            });
        }

        function removeFromFavouriteList(id) {
            vm.favouriteQuizzes = vm.favouriteQuizzes.filter(quiz => {
                return quiz._id !== id;
            });
        }

        function participate(quizId){
            let quizUserId;
            let userId = vm.uid;
            let quizUser = {
                quizId: quizId,
                userId: userId,
                assigneeId: userId, //temp data
                quizStatus: 'assigned',//temp data
            };

            $rootScope.redirectFromPlay = {
                url: $location.path(),
                parameter: $location.search().active
            };

            quizFactory.createQuizUser(quizUser)
                .then(quizUser => {
                    if (quizUser.quizId) {
                        const path = quizUser.quizId.videoUrl ? '/video/' : '/play/';

                        $location.path(`${path}${quizUser._id}`).search({});
                    } else {
                        showAlert(vm.alertOptions.apply, 'error', 'Quiz could not be found');
                    }
                })
                .catch(err => {
                    showAlert(vm.alertOptions.apply, 'error', 'QuizUser could not be created');
                })
        }

        function searchQuiz(quiz) {
            const searchText = vm.searchText.toLowerCase();
            const title = quiz.title.toLowerCase();
            const description = quiz.description.toLowerCase();

            return vm.searchText
                ? (title.indexOf(searchText) !== -1
                    || description.indexOf(searchText) !== -1)
                    || checkQuizKeywords(quiz.keywords, searchText)
                : true;
        }

        function checkQuizKeywords(keywords, searchText) {
            return keywords.some(keyword => {
                return keyword.toLowerCase().indexOf(searchText) !== -1;
            });
        }

        function clearSearchText() {
            vm.searchText = '';
        }
    }

})();