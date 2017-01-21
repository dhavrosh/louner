const mongoose = require('mongoose');

const questionTypes = [
    'Simple',
    'Multiple',
    'Written',
    'Matrix',
    'Match',
    'Order',
    'Video'
];

const questionSMWTypes = [
    'simple',
    'multiple',
    'written'
];

const answerAppearanceTypes = [
    'checkBoxes',
    'radioButtons',
    'dropDown',
    'images',
    'buttons'
];

//(CheckBoxes, RadioButtons, DropDown, Images, Buttons)

const questionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    position: Number,
    questionText: String,
    questionDescription: String,
    points: Number,
    questionType: { type: String, enum: questionTypes },
    imageUrl: String,
    imagePosition: String,
    executionTime: Number,
    dateCreated: { type: Date, default: Date.now },
    isActive: Boolean,
    answers: [mongoose.Schema.Types.Mixed]
});

const questionSMW = new mongoose.Schema({
    questionType: { type: String, enum: questionSMWTypes },
    answerAppearance: { type: String, enum: answerAppearanceTypes },
    options:
    [
        {
            answerImageUrl: String,
            answerName: String,
            IsAnswerCorrect: Boolean
        }
    ],
    textAnswer: String,
    textAnswerOptions: [String]
});

const questionVideo = new mongoose.Schema({
    videoUrl: String,
    questions:
    [
        {
            stopSeconds: Number,
            questionSMW: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionSMW' },
            questionMatrix: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionMatrix' },
            questionMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionMatch' },
            questionOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionOrder' }
        }
    ]
});

const questionMatrix = new mongoose.Schema({
    questions:
    [
        {
            points: Number,
            questionText: String,
            answerOptions:
            [
                {
                    option: String,
                    isCorrectOption: Boolean
                }
            ]
        }
    ]
});

mongoose.model('Question', questionSchema);
mongoose.model('QuestionSMW', questionSMW);
mongoose.model('QuestionVideo', questionVideo);
mongoose.model('QuestionMatrix', questionMatrix);

//QuestionOrder
const questionInQuestionOrder = {
    questionText: String,
    position: Number,
    answerPosition: Number
}

const questionOrderSchema = new mongoose.Schema({
    questions: [questionInQuestionOrder]
});

mongoose.model('QuestionOrder', questionOrderSchema);

//QuestionMatch
const rightColumnObj = {
    optionId: { type: String, required: true },
    optionText: { type: String, required: true },
    leftOptionId: { type: String, required: true }
}
const leftColumnObj = {
    optionId: { type: String, required: true },
    optionText: { type: String, required: true }
}

const questionMatchSchema = new mongoose.Schema({
    rightColumn: [rightColumnObj],
    leftColumn: [leftColumnObj]
});

mongoose.model('QuestionMatch', questionMatchSchema);
