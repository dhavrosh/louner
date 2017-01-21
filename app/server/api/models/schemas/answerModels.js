const mongoose = require('mongoose');

const quizStatus = [
    'assigned',
    'in progress',
    'completed'
];

// User Quiz
const quizUserSchema = new mongoose.Schema({
    quizId : { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // user that assigned to the quiz 
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // person who assigned quiz to user
    assignmentTime: { type: Date, default: Date.now },
    quizStatus : { type: String, enum: quizStatus },
    points: Number,
    dateCreated : { type: Date, default: Date.now }
});
// {
//     quizId : "5873bd0c4f19b5057616069f",
//     userId: "5873bd0c4f19b5057616069f",
//     assigneeId: null,  
//     quizStatus : 1,
//     points: 10,   
// }

mongoose.model('QuizUser', quizUserSchema);

// User Answers
const quizUserAnswerSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    quizUserId : { type: mongoose.Schema.Types.ObjectId, ref: 'QuizUser' },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answers: [String],
    isAnswerCorrect : Boolean,
    points: Number,
    dateCreated : { type: Date, default: Date.now }
});

mongoose.model('QuizUserAnswer', quizUserAnswerSchema);



