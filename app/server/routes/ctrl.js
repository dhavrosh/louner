const path = require('path');
const rp = require('request-promise');

function sendToAuthentication(req, res) {
    res.redirect(process.env.COSTNER_API_AUTHENTICATION_URL);
}

function sendIndex(req, res) {
    res.sendFile(path.join(__dirname, '../../client', 'teacher.index.html'));
}

module.exports = {
    sendIndex,
    sendToAuthentication
};

