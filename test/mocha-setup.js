const runStaticHtmlServer = require('./run-html-server');
const {start} = require('yoshi/lib/server-api.js');
const {watchMode} = require('yoshi/lib/utils');

const runCdnServerIfNeeded = () => {
  if (!watchMode()) {
    return start({host: 'localhost'});
  }

  return Promise.resolve();
};

runCdnServerIfNeeded()
  .then(() => runStaticHtmlServer(3000));

