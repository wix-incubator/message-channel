import assert from 'assert';
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
  assert(scope && typeof scope === 'string', 'listener function expects to recieve a scope<string> as a first argument');
  window.addEventListener('message', e => {
    if (isMessageRelevant(e.data, scope)) {
      const port = getMessagePort(e);
      if (port) {
        authorizeConnection(port);
        callback(listenFactory(port));
      }
    }
  });
}

export default listener;
