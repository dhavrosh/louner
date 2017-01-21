(function () {
    "use strict";

    angular
        .module('teacherApp')
        .factory('quizFactory', quizFactory);

    quizFactory.$inject = ['$http', 'Upload'];

    function quizFactory($http, Upload) {
        return {
            addToFavourites,
            removeFromFavourites,
            getQuizById,
            getQuizzesByCreator,
            getFavourites,
            getPublicQuizzes,
            createUpdateQuiz,
            copyQuiz,
            deleteQuiz,
            createQuizUser,
            getQuizUserById
        };

        function addToFavourites(quizId) {
            return $http.post('/api/quiz-favourite', { quizId }).then(res => {
                return res.data;
            })
        }

        function removeFromFavourites(quizId) {
            return $http.delete(`/api/quiz-favourite/${ quizId }`).then(res => {
                return res.data;
            })
        }

        function getPublicQuizzes() {
            return $http.get(`/api/quizzes/public`)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.log('getPublicQuizzes Failed', err);
                });
        }

        function getFavourites(userId) {
            return $http.get(`/api/quizzes/favourite/${userId}`)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.log('getFavourites Failed', err);
                });
        }

        function getQuizById(id) {
            return $http.get(`/api/quiz/${id}`)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.log('getQuizById Failed', err.message);
                });
        }

        function getQuizzesByCreator(id) {
            return $http.get(`/api/quizzes/created/${id}`)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.log('getQuizzesByCreator Failed', err);
                });
        }

        function deleteQuiz(id) {
            return $http.delete(`/api/quiz/${id}`)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.log('deleteQuiz Failed', err);
                });
        }

        function createUpdateQuiz(quiz) {
            return Upload
                .upload({
                    url: '/api/quiz',
                    method: 'post',
                    data: quiz
                })
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.log('createUpdateQuiz Failed', err.message);
                });
        }

        function copyQuiz(id) {
            return $http.get(`/api/quizzes/copy/${id}`)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.log('copyQuiz Failed', err.message);
                });
        }
        function createQuizUser(quizUser){
            return $http.post('/api/quizUser', quizUser)//TODO: change url api
                .then(res=>{
                    return res.data;
                })
                .catch(err=>{
                    console.log('create quiz user failed ', err.message);
                })
        }
        function getQuizUserById(quizUserId){
            return $http.get(`/api/quizUser/${quizUserId}`)
                .then(res=>{
                    return res.data;
                })
                .catch(err=>{
                    console.log(err.message);
                })
        }
    }
})();