import {constructChannelMessage, parseChannelMessage} from '../utils';


export default function listenFactory(port) {
  return handler => {
    return port.onmessage = e => {
      const originalMessage = e.data;
      const {id, payload} = parseChannelMessage(originalMessage);

      const reply = replyMessage => {
        port.postMessage(constructChannelMessage(replyMessage, id));
      };

      return handler(payload, reply);
    };
  };
}
