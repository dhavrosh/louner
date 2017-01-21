const mongoose = require('mongoose');
const dbs = require('./types');

class DB {
    constructor(type) {
        this.db = dbs[type];
        this.applyPromise();
        this.initializeSchemes();
        this.listenConnection();
    };

    applyPromise() {
        mongoose.Promise = global.Promise;
    };

    connect(url, done) {
        this.db.connect(url, done);
    };

    initializeSchemes() {
        require('./schemas/questionModels');
        require('./schemas/userModels');
        require('./schemas/quizModels');
        require('./schemas/answerModels');
    };

    listenConnection() {
        mongoose.connection.on('connected', () => console.log('Mongoose connected to DB successfully'));
        mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
        mongoose.connection.on('error', (err) => console.log('Mongoose connection error: ' + err.message));
    };
}

module.exports = DB;