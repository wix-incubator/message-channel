import {connectionSuccessMsg} from '../constants';
import {parseConnectionMessage} from '../utils';
import listenFactory from './listen-factory';

function isMessageRelevant(message, scope) {
  try {
    return parseConnectionMessage(message) === scope;
  } catch (e) {
    return false;
  }
}

function getMessagePort(e) {
  try {
    return e.ports[0];
  } catch (e) {}
}

function authorizeConnection(port) {
  port.postMessage(connectionSuccessMsg);
}

const noop = () => {};

function listener(scope, callback = noop) {
  if (!scope || typeof scope !== 'string') {
    throw new Error('listener function expects to recieve a scope<string> as a first argument');
  }

  const _listener = e => {
    if (isMessageRelevant(e.data, scope)) {
      const port = getMessagePort(e);
      if (port) {
        authorizeConnection(port);
        callback(listenFactory(port));
      }
    }
  };

  window.addEventListener('message', _listener);
  return () => window.removeEventListener('message', _listener);
}

module.exports = listener;
