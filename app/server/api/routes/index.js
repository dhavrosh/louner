const express = require('express');
const multiparty = require('connect-multiparty');

const allowUserTypes = require('../../auth/utils').allowUserTypes;

const quizCtrl = require('../controllers/quizes/quizCtrl');

module.exports = passport => {
    const router = express.Router();
    const multipartyMiddleware = multiparty();

    router.get('/quiz/:id', quizCtrl.getQuizById);
    router.post('/quiz', multipartyMiddleware, quizCtrl.createUpdateQuiz);
    router.delete('/quiz/:id', quizCtrl.deleteQuiz);

    router.post('/quiz-favourite', quizCtrl.addToFavourites);
    router.delete('/quiz-favourite/:quizId', quizCtrl.removeFromFavourites);

    router.get('/quizzes/created/:id', quizCtrl.getQuizzesByCreator);
    router.get('/quizzes/favourite/:id', quizCtrl.getFavourites);
    router.get('/quizzes/public', quizCtrl.getPublicQuizzes);
    router.get('/quizzes/copy/:id', quizCtrl.copyQuiz);

    return router;
};