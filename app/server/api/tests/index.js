const server = require('../../bin/test');
const getTests = require('./reader').getTests;

let tests;

before((done) => {
  const startServer = new Promise(
      (resolve) => server.listen(() => resolve())
  );

  startServer
    .then(() => getTests())
    .then((data) => {
      tests = data;
      done();
    })
    .catch((err) => { throw err; });
});

describe('ApiServer', () => {
  it('started successfully', () => {
    tests.forEach((item) => {
      describe(item.name, () => {
        item.tests.forEach((test) => {
          describe(test.name, () => {
            it(test.description, test.worker);
          });
        });
      });
    });
  });
});

after((done) => {
  server.close(done);
});
