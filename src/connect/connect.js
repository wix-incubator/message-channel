import {connectionSuccessMsg, deafultConnectionMaxTimeout, deafultMessageMaxTimeout} from '../constants';
import {constructConnectionMessage} from '../utils';
import sendFactory from './send-factory';

function connect(scope, options = {}) {
  const {
    targetOrigin = '*',
    connectionMaxTimeout = deafultConnectionMaxTimeout,
    messageMaxTimeout = deafultMessageMaxTimeout
  } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`max timeout of ${connectionMaxTimeout}ms exceeded`));
    }, connectionMaxTimeout);

    const channel = new window.MessageChannel();

    channel.port1.onmessage = e => {
      if (e.data === connectionSuccessMsg) {
        return resolve(sendFactory(channel.port1, {messageMaxTimeout}));
      } else {
        reject(new Error('connection could not establise'));
      }
    };

    const connectionMessage = constructConnectionMessage(scope);
    window.parent.postMessage(connectionMessage, targetOrigin, [channel.port2]);
  });
}


module.exports = connect;
