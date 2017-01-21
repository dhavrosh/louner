(function () {
    "use strict";

    angular
        .module('teacherApp')
        .controller('quizDescriptionController', quizDescriptionController);

    quizDescriptionController.$inject = [
        'quizFactory',
        'questionFactory',
        '$uibModal',
        '$location',
        '$routeParams',
        '$rootScope',
        '$cookies',
        '$cookieStore',
        '$timeout',
        '$mdConstant',
        '$scope'];

    function quizDescriptionController(
        quizFactory,
        questionFactory,
        $uibModal,
        $location,
        $routeParams,
        $rootScope,
        $cookies,
        $cookieStore,
        $timeout,
        $mdConstant,
        $scope) {

        var vm = this;

        vm.title = '';
        vm.description = '';
        vm.keywords = [];
        vm.visibleTo = ['Only me', 'Everyone'];
        vm.selectedVisible = vm.visibleTo[0];
        vm.languages = ['English', 'German'];
        vm.languageLabel = 'Language:';
        vm.selectedLanguage = vm.languages[0];
        vm.audiences = ['Students', 'Healthcare '];
        vm.audienceLabel = 'Audience (required):';
        vm.audienceErrorMsg = 'Audience is required';
        vm.selectedAudience = '';
        vm.creditResources = '';
        vm.image = '';
        vm.imageUrl = "";
        vm.quizId = $routeParams.quizId;
        vm.videoUrl = '';
        vm.isActive = false;
        vm.alertOptions = {};
        vm.unsavedQuizId = '';
        vm.isBusy = false;
        vm.separatorKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
        vm.warning = 'Are You really want to close the page and discard all changes?';
        vm.isPristine = false;
        vm.closePage = closePage;
        vm.createQuiz = createQuiz;
        vm.removeImage = removeImage;

        /*const imageHolder = angular.element(document.getElementsByClassName('large-img-size')[0]);

        $scope.$watch('vm.image', function () {
            //console.log('image changed')
            // alert('hey, myVar has changed!');

        })
        $scope.$watch('imageHolder[0].src', function () {
            //console.log('src changed')
            // alert('hey, myVar has changed!');
        })*/

        activate();

        function activate() {
            if (vm.quizId) {
                quizFactory
                    .getQuizById(vm.quizId)
                    .then(quiz => {
                        //TODO make it better
                        vm.title = quiz.title;
                        vm.description = quiz.description;
                        vm.keywords = quiz.keywords;
                        vm.selectedVisible = quiz.visible;
                        vm.selectedLanguage = quiz.language;
                        vm.selectedAudience = quiz.audience;
                        vm.creditResources = quiz.creditResources;
                        vm.videoUrl = quiz.videoUrl;
                        vm.imageUrl = quiz.imageUrl;
                        vm.image = quiz.imageUrl;
                        vm.isActive = true;//quiz.isActive;
                    })
                    .catch(err => {
                        console.log(`Error in getQuizById function, message: ${err.message}`);
                        showAlert(vm.alertOptions.apply, 'error', 'Could not load quiz.');
                    });
            }
        }

        function getUnsavedQuizIdCookies() {
            vm.unsavedQuizId = $cookies.get('unsavedQuizId');
            return vm.unsavedQuizId ? true : false;
        }

        function setUnsavedQuizIdCookies(quizId) {
            $cookies.put('unsavedQuizId', quizId)
        }

        function closePage() {
            //check if form was changed if yes show confirmation dialog
            if (!vm.isPristine) {
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
                                $timeout(() => {
                                    let redirectUrl = $rootScope.quizCloseLocation;
                                    $rootScope.quizCloseLocation = '';
                                    $location.path(redirectUrl);
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
            } else {
                redirect()
            }

        }

        function redirect() {
            const redirectUrl = $rootScope.redirectUrl || '/';
            if (typeof redirectUrl === 'string') {
                $location.path(redirectUrl);
            } else {
                $location.path(redirectUrl.url).search(redirectUrl.params)
            }
        }

        function createQuiz(isValid, form) {
            let action = 'create';

            vm.isBusy = true;

            if (isValid) {
                const quizToCreate = {
                    title: vm.title,
                    description: vm.description,
                    keywords: vm.keywords,
                    visible: vm.selectedVisible,
                    language: vm.selectedLanguage,
                    audience: vm.selectedAudience,
                    creditResources: vm.creditResources,
                    imageUrl: vm.imageUrl,
                    videoUrl: vm.videoUrl,
                    isActive: false,
                };

                if (vm.quizId) {
                    quizToCreate._id = vm.quizId;
                    quizToCreate.isActive = true;
                    action = 'save'
                }

                if (vm.image) {
                    if (typeof vm.image === 'string') {
                        quizToCreate.image = vm.image;
                    } else {
                        quizToCreate.file = vm.image;
                    }
                }

                quizFactory
                    .createUpdateQuiz(quizToCreate)
                    .then(quiz => {
                        if (!quiz) {
                            throw new Error("Server is not responding");
                        }
                        setUnsavedQuizIdCookies(quiz._id);                     
                        $location.path('/quiz-questions/' + quiz._id);
                    })
                    .catch(err => {
                        console.log(`Error in createUpdateQuiz function, message: ${err.message}`);
                        showAlert(vm.alertOptions.apply, 'error', `Could not ${action} quiz.`);
                    });
            } else {
                let errorMessage = '';

                vm.isBusy = false;

                for (let prop in form.$error) {
                    if (form.$error.hasOwnProperty(prop)) {
                        errorMessage += (prop === 'required'
                            ? formRequiredErrMessage
                            : formOtherErrMessage)(form.$error[prop])
                    }
                }

                showAlert(vm.alertOptions.apply, 'error', errorMessage);
            }
        }

        function formRequiredErrMessage(els) {
            let errMessage = els.reduce((errorMessage, el) => {
                if (el.$$attr.hasOwnProperty('name')) {
                    errorMessage += el.$$attr.name + ', ';
                }

                return errorMessage;
            }, 'Please add ');

            return `${errMessage.slice(0, -2)}. `;
        }

        function formOtherErrMessage(els) {
            return els.reduce((errorMessage, el) => {
                if (el.$$attr.hasOwnProperty('errMessage')) {
                    errorMessage += `${el.$$attr.errMessage}. `;
                }

                return errorMessage;
            }, '');
        }

        function removeImage() {
            vm.imageUrl = '';
            return vm.image = null;
        }
    }
})();