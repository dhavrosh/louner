const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const DB = require('./api/models/db');
const db = new DB(process.env.MODE);

const createApiRouter = require('./api/routes');
const createAuth = require('./auth');
const checkAuthOfRequest = require('./auth/utils').checkAuthOfRequest;
const router = require('./routes');

const auth = createAuth();
const apiRouter = createApiRouter(auth);
const app = express();

db.connect(process.env.DB_URL);

app.use(auth.initialize());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/api', checkAuthOfRequest, apiRouter);
app.use('/', router);
app.use((err, req, res, next) => res.status(err.status || 500).end(err));

module.exports = app;
