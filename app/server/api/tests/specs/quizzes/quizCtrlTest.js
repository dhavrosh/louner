const assert = require('assert');
const axios = require('axios');
const mongoose = require('mongoose');

const Quiz = mongoose.model('Quiz');
const Question = mongoose.model('Question');

const baseOfServerUrl = process.env.BASE;

const quizObj = {
  _id: mongoose.Types.ObjectId().toString(),
  title: 'Animal',
  description: 'Should have ',
  keywords: ['Animal'],
  visible: 'Everyone',
  language: 'English',
  audience: 'Audience',
  creditResources: 'CreditResources',
  imageUrl: 'ImageUrl',
  videoUrl: 'VideoUrl',
  isActive: 'IsActive',
  creatorId: '585992e1abe3800794da2201',
  subject: 'Subject',
  questionsOnThePage: 10,
  file: '',
};

const questionObj = {
  quizId: quizObj._id,
  position: 10,
  questionText: 'questionText',
  questionDescription: 'questionDescription',
  points: 10,
  questionType: 'Simple',
  imageUrl: 'imageUrl',
  imagePosition: 'imagePosition',
  executionTime: 10,
  isActive: true,
  answers: ['answers'],
};

function getQuizById(done) {
  Quiz.create(quizObj)
        .then(quiz => axios.get(`${baseOfServerUrl}/api/quiz/${quiz._id}`))
        .then((response) => {
          assert.equal(response.data.title, quizObj.title);
          assert.equal(response.data.description, quizObj.description);
          assert.equal(response.data.audience, quizObj.audience);

          return Quiz.findByIdAndRemove(response.data._id);
        })
        .then(() => done())
        .catch(err => done(err));
}

function getPublicQuizzes(done) {
  Quiz.create(quizObj)
        .then(() => axios.get(`${baseOfServerUrl}/api/quizzes/public`))
        .then((response) => {
          response.data.slice(0, 10).forEach((quiz) => {
            assert.equal(quiz.visible, 'Everyone');
          });

          return Quiz.findByIdAndRemove(quizObj._id);
        })
        .then(() => done())
        .catch(err => done(err));
}

function getQuizzesByCreator(done) {
  Quiz.create(quizObj)
        .then(quiz => axios.get(`${baseOfServerUrl}/api/quizzes/created/${quiz.creatorId}`))
        .then((response) => {
          response.data.slice(0, 10).forEach((quiz) => {
            assert.equal(quiz.creatorId, quizObj.creatorId);
          });

          return Quiz.findByIdAndRemove(quizObj._id);
        })
        .then(() => done())
        .catch(err => done(err));
}

function createUpdateQuiz(done) {
  axios.post(`${baseOfServerUrl}/api/quiz`, quizObj)
        .then((createdQuiz) => {
          assert.equal(createdQuiz.data._id, quizObj._id);
          assert.equal(createdQuiz.data.title, quizObj.title);
          assert.equal(createdQuiz.data.title, quizObj.title);

          quizObj.title = 'Updated Title';
          quizObj.description = 'Updated Description';

          return axios.post(`${baseOfServerUrl}/api/quiz`, quizObj);
        })
        .then((updatedQuiz) => {
          assert.equal(updatedQuiz.data._id, quizObj._id);
          assert.equal(updatedQuiz.data.title, quizObj.title);
          assert.equal(updatedQuiz.data.description, quizObj.description);

          return Quiz.findByIdAndRemove(quizObj._id);
        })
        .then(() => done())
        .catch(err => done(err));
}

function copyQuiz(done) {
  Quiz.create(quizObj)
        .then(() => Question.create(questionObj))
        .then(() => axios.get(`${baseOfServerUrl}/api/quizzes/copy/${quizObj._id}`))
        .then((quiz) => {
          assert.equal(quiz.data.title, quizObj.title);
          assert.equal(quiz.data.creatorId, quizObj.creatorId);

          return Question.find({ quizId: quiz.data._id });
        })
        .then(([question]) => {
          assert.equal(question.questionText, questionObj.questionText);
          assert.equal(question.questionType, questionObj.questionType);

          return axios.delete(`${baseOfServerUrl}/api/quiz/${question.quizId}`);
        })
        .then(() => axios.delete(`${baseOfServerUrl}/api/quiz/${quizObj._id}`))
        .then(() => done())
        .catch(err => done(err));
}

function deleteQuiz(done) {
  Quiz.create(quizObj)
        .then(() => Question.create(questionObj))
        .then(() => axios.delete(`${baseOfServerUrl}/api/quiz/${quizObj._id}`))
        .then(response => assert.equal(response.data._id, quizObj._id))
        .then(() => done())
        .catch(err => done(err));
}

module.exports = {
  name: 'quizCtrl',
  tests: [
    {
      name: 'getQuizById',
      description: 'should return correct quiz by id',
      worker: getQuizById,
    },
    {
      name: 'getPublicQuizzes',
      description: 'should return only public quizzes',
      worker: getPublicQuizzes,
    },
    {
      name: 'getQuizzesByCreator',
      description: 'should return only quizzes created by specified user',
      worker: getQuizzesByCreator,
    },
    {
      name: 'deleteQuiz',
      description: 'should delete quiz and all it\'s questions',
      worker: deleteQuiz,
    },
    {
      name: 'copyQuiz',
      description: 'should copy quiz and all it\'s questions',
      worker: copyQuiz,
    },
    {
      name: 'createUpdateQuiz',
      description: 'should create or update quiz',
      worker: createUpdateQuiz,
    },
  ],
};

