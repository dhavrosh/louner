const mongoose = require('mongoose');

//do we need here userRole???
const userRole = [
    'teacher',
    'doctor',
    'student',
    'pacient',
    'admin'
];

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [String],
    visible: String,
    language: String,
    audience: { type: String, required: true },
    creditResources: String,
    imageUrl: String,
    videoUrl: String,
    isActive: Boolean,
    playedTimes: { type: Number, default: 0 },
    dateCreated: { type: Date, default: Date.now },
    position: { type: Number, default: 0 },

    // ???????
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    //no input for this value on the page
    subject: String,

    //no input for this value on the page
    questionsOnThePage: Number,

    //no input for this value on the page
    quizIconUrl: String
}, { toJSON: { virtuals: true } });

quizSchema.virtual('favourites', {
    ref: 'QuizFavourite',
    localField: '_id',
    foreignField: 'quizId'
});

quizSchema.pre('save', function (next) {
    const self = this;
    const creatorId = self._doc.creatorId;

    self.constructor.count({ creatorId }).then(count => {
        self.position = count;
        next();
    });
});

quizSchema.pre('findOneAndUpdate', function (next) {
    const self = this;
    const creatorId = self._doc.creatorId;

    self.constructor.count({ creatorId }).then(count => {
        self.position = count;
        next();
    });
});

const quizFavouriteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
});

mongoose.model('Quiz', quizSchema);
mongoose.model('QuizFavourite', quizFavouriteSchema);




