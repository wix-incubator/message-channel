import {constructChannelMessage, parseChannelMessage} from '../utils';
import uuidv4 from 'uuid/v4';

export default function sendFactory(port, options) {
  const {messageMaxTimeout} = options;
  const messages = {};

  port.onmessage = e => {
    const {id, payload} = parseChannelMessage(e.data);
    if (messages[id]) {
      const modifiedEvent = {
        data: payload,
        origin: e.origin,
        lastEventId: e.lastEventId,
        source: e.source,
        ports: e.ports,
      };

      messages[id](modifiedEvent);
    }
  };

  return (message, transferList) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`max timeout of ${messageMaxTimeout}ms exceeded`));
      }, messageMaxTimeout);

      const messageId = uuidv4();
      const packaged = constructChannelMessage(message, messageId);
      messages[messageId] = resolve;
      return port.postMessage(packaged, transferList);
    });
  };
}
