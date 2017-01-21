const fs = require('fs-extra');
const Path = require('path');
const Promise = require('bluebird');

const stat = Promise.promisify(fs.stat);
const readdir = Promise.promisify(fs.readdir);

const tests = [];
const testsDir = process.env.TEST_PATH || 'BadDirectory';

function readTests(dir) {
  return readdir(dir)
        .then(files => Promise.all(files.map((file) => {
          const path = Path.join(dir, file);

          return stat(path).then((stats) => {
              if (stats.isDirectory()) {
                return readTests(path);
              }

              return tests.push(path);
          });
        })));
}

function getTests() {
  return readTests(testsDir)
        .then(() => {
          return tests.map((path) => {
            const toReplace = Path.join('app', 'server', 'api', 'tests');
            const clipped = `./${path.replace(toReplace, '')}`;

            return require(clipped);
          });
        });
}

exports.getTests = getTests;

