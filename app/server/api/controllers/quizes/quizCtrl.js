const mongoose = require('mongoose'),
    path = require('path'),
    async = require('async'),
    CronJob = require('cron').CronJob,
    fileCtrl = require('../files/fileCtrl'),
    utils = require('../../utils');

const Quiz = mongoose.model('Quiz');
const Question = mongoose.model('Question');
const QuizFavourite = mongoose.model('QuizFavourite');

const quizCtrl = {
    addToFavourites,
    removeFromFavourites,
    getQuizById,
    getFavourites,
    getPublicQuizzes,
    getQuizzesByCreator,
    createUpdateQuiz,
    copyQuiz,
    deleteQuiz
};

const publicQuizImageDir = path.join(process.env.PUBLIC_PATH, '/images/quizes');

// cron job for deleting all inactive and unneeded quizzes every 12 hours
const deleteInactiveQuizzes = new CronJob({
    cronTime: '0 0 23 * * *',
    onTick: () => {
        const limitOfCreated = new Date();

        limitOfCreated.setHours(limitOfCreated.getHours() - 12);

        Quiz.remove({
            isActive: false,
            dateCreated: {$lt: limitOfCreated}
        })
        .then(() => console.log('Cron "deleteInactiveQuizzes" was executed'))
        .catch(err => { throw err });
    },
    start: true
});

function addToFavourites(req, res) {
    const quizId = req.body.quizId;
    const userId = req.headers.uid;

    if (quizId && userId) {
        QuizFavourite.create({ quizId, userId })
            .then(() => {
                return Quiz.findById(quizId)
                    .populate({
                        path: 'favourites',
                        match: { userId }
                    })
            })
            .then(quiz => {
                utils.sendJSONresponse(res, 200, quiz);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err.message);
            });
    } else {
        utils.sendJSONresponse(res, 500, "quizId and UserId are required!");
    }
}

function removeFromFavourites(req, res) {
    const quizId = req.params.quizId;
    const userId = req.headers.uid;

    if (quizId && userId) {
        QuizFavourite.find({ quizId, userId }).remove()
            .then(() => {
                return Quiz.findById(quizId)
                    .populate({
                        path: 'favourites',
                        match: { userId }
                    })
            })
            .then(quiz => {
                utils.sendJSONresponse(res, 200, quiz);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err.message);
            });
    } else {
        utils.sendJSONresponse(res, 500, "quizId and UserId are required!");
    }
}

function getFavourites(req, res) {
    const userId = req.headers.uid;

    if (userId) {
        QuizFavourite.find({ userId })
            .populate({
                path: 'quizId',
                populate: { path: 'favourites' }
            })
            .then(favourites => {
                utils.sendJSONresponse(res, 200, favourites);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err.message);
            });
    } else {
        utils.sendJSONresponse(res, 500, "userId is required!");
    }
}

function getQuizById(req, res) {
    if (req.params.id) {
        Quiz.findById(req.params.id)
            .then(quiz => {
                utils.sendJSONresponse(res, 200, quiz);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err.message);
            });
    } else {
        utils.sendJSONresponse(res, 500, "ID is required!");
    }
}

function getPublicQuizzes(req, res) {
    const userId = req.headers.uid;

    if (userId) {
        Quiz.find({ visible: 'Everyone', isActive: true })
            .populate({
                path: 'favourites',
                match: { userId }
            })
            .sort('-playedTimes')
            .then(quizzes => {
                utils.sendJSONresponse(res, 200, quizzes);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err);
            });
    } else {
        utils.sendJSONresponse(res, 500, "User ID is required!");
    }
}

function getQuizzesByCreator(req, res) {
    const creatorId = req.headers.uid; // req.params.id
    const userId = req.headers.uid;

    if (creatorId && userId) {
        Quiz.find({ creatorId, isActive: true })
            .populate({
                path: 'favourites',
                match: { userId }
            })
            .then(quizzes => {
                utils.sendJSONresponse(res, 200, quizzes);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err.message);
            });
    } else {
        utils.sendJSONresponse(res, 500, "User ID is required!");
    }
}

function createUpdateQuiz(req, res) {
    const quizId = req.body._id || mongoose.Types.ObjectId().toString();
    const quizImageDir = path.join(publicQuizImageDir, fileCtrl.getHashedDirName(quizId));
    const image = (req.files && req.files.file) || req.body.image;
    const userId = req.headers.uid;

    return Quiz.findById(quizId)
        .then(quiz => {
            // create or update quiz, depending on quiz existence
            if (quiz) {
                // check old image existence
                const oldImagePath = quiz.imageUrl ? path.resolve(process.env.PUBLIC_PATH, quiz.imageUrl) : '';
                return (typeof image === 'string' && image === quiz.imageUrl)
                    // if new image equals to old url, return old image path
                    ? oldImagePath
                    : image
                        // if new image was sent, delete old image and save new one or just save new one,
                        // depending on old image existence
                        ? oldImagePath
                            ? fileCtrl.updateImage({
                                directory: quizImageDir,
                                name: image.name,
                                tempPath: image.path,
                                oldPath: oldImagePath
                            })
                            : fileCtrl.saveImage({
                                directory: quizImageDir,
                                name: image.name,
                                tempPath: image.path,
                            })
                        // if new image was'n sent, delete old image and set to default or simply set to default,
                        // depending on old image existence
                        : oldImagePath
                            ? fileCtrl.deleteFile(oldImagePath)
                            : '';
            } else {
                return image
                    // if new image was sent, save new image, otherwise set to default
                    ? fileCtrl.saveImage({
                        directory: quizImageDir,
                        name: image.name,
                        tempPath: image.path
                    })
                    : '';
            }
        })
        .then(newImagePath => {
            const receivedQuiz = Object.assign({
                    keywords: [],
                    creatorId: userId || '585992e1abe3800794da0001'
                }, req.body),
                options = {
                    userId,
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                },
                queryObj = {_id: quizId};

            receivedQuiz.imageUrl = newImagePath
                ? fileCtrl.getImageUrl(newImagePath)
                : receivedQuiz.imageUrl || '';

            return Quiz.findOneAndUpdate(queryObj, receivedQuiz, options);
        })
        .then(quiz => {
            utils.sendJSONresponse(res, 200, quiz);
        })
        .catch(err => {
            console.log(err);
            utils.sendJSONresponse(res, 500, err.message);
        });
}

function copyQuiz(req, res) {
    const quizId = req.params.id;
    const userId = req.headers.uid;

    if(quizId && userId) {
        let copy;
        let copyId;
        let sourceQuizImageDir;
        let destinationQuizImageDir;

        Quiz.findById(quizId)
            .then(quiz => {
                if (quiz) {
                    copy = Object.assign({}, quiz._doc);

                    if (copy.hasOwnProperty('__v')) delete copy.__v;
                    if (copy.hasOwnProperty('dateCreated')) delete copy.dateCreated;

                    copyId = mongoose.Types.ObjectId().toString();
                    copy._id = copyId;
                    copy.creatorId = userId;

                    sourceQuizImageDir = path.join(
                        publicQuizImageDir, fileCtrl.getHashedDirName(quiz._id.toString())
                    );
                    destinationQuizImageDir = path.join(
                        publicQuizImageDir, fileCtrl.getHashedDirName(copyId)
                    );


                    return fileCtrl.copyDir(sourceQuizImageDir, destinationQuizImageDir);
                } else {
                    utils.sendJSONresponse(res, 500, 'Bad quiz id');
                }
            })
            .then(() => {
                copy.imageUrl = changeImageUrl(copy.imageUrl, destinationQuizImageDir);
                return new Quiz(copy).save();
            })
            .then(quiz => {
                // save quiz into copy variable for sending correct response
                copy = quiz;
                return Question.find({ quizId });
            })
            .then(questions => {
                return new Promise((resolve, reject) => {
                    async.eachLimit(questions, 2, cloneQuestion, err => {
                        return err ? reject(err) : resolve('done');
                    });
                });
            })
            .then(result => {
                utils.sendJSONresponse(res, 200, copy);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err.message);
            });

        function cloneQuestion(question, done) {
            question._id = mongoose.Types.ObjectId();
            question.imageUrl = changeImageUrl(question.imageUrl, destinationQuizImageDir);
            question.quizId = copyId;
            question.isNew = true;
            question.save(done);
        }
    } else {
        utils.sendJSONresponse(res, 500, 'Id is required');
    }
}

function deleteQuiz(req, res) {
    const quizId = req.params.id;

    if(quizId) {
        const quizImageDir = path.join(publicQuizImageDir, fileCtrl.getHashedDirName(quizId));
        let removedQuiz;

        Question.find({ quizId })
            .remove()
            .then(() => {
                return Quiz.findOneAndRemove({ _id: quizId });
            })
            .then(quiz => {
                removedQuiz = quiz;
                return fileCtrl.deleteDir(quizImageDir);
            })
            .then(() => {
                utils.sendJSONresponse(res, 200, removedQuiz);
            })
            .catch(err => {
                utils.sendJSONresponse(res, 500, err.message);
            });
    } else {
        utils.sendJSONresponse(res, 500, 'Id is required');
    }
}

function changeImageUrl(url, destination) {
    let changedUrl = url;

    if (url) {
        const basename = path.basename(url);
        const questionImagePath = path.join(destination, basename);
        changedUrl = fileCtrl.getImageUrl(questionImagePath);
    }

    return changedUrl;
}

module.exports = quizCtrl;
