const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');

exports.test = {
    connect: (url, done) => mongoose.connect(url, done)
};

exports.development = {
    connect: (url, done) => mongoose.connect(url, done)
};

exports.production = {
    connect: (url, done) => {
        const key = path.join(process.env.ROOT, 'app/server/resources/costner.pem');

        const config = {
            dstPort: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            host: process.env.DB_HOST,
            privateKey: fs.readFileSync(key)
        };

        tunnel(config, (err) => {
            if (err) throw err;
            mongoose.connect(url, done);
        });
    }
};