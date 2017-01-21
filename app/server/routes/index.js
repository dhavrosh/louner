const express = require('express');
const ctrl = require('./ctrl');

const router = express.Router();

router.get('/authentication', ctrl.sendToAuthentication);
router.get('*', ctrl.sendIndex);

module.exports = router;