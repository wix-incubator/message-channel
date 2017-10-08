import {connectionRequestMsg, messageDelimiter} from './constants';

export const constructChannelMessage = (payload, id) => {
  if (!id) {
    return payload;
  }

  return id + messageDelimiter + payload;
};

export const parseChannelMessage = message => {
  const firstDelimiterIndex = message.indexOf(messageDelimiter);
  if (firstDelimiterIndex === -1) {
    return {id: null, payload: message};
  }

  const id = message.slice(0, firstDelimiterIndex);
  const payload = message.slice(firstDelimiterIndex + 1);
  return {id, payload};
};

export const constructConnectionMessage = scope => {
  return connectionRequestMsg + messageDelimiter + scope;
};

export const parseConnectionMessage = message => {
  const firstDelimiterIndex = message.indexOf(messageDelimiter);
  if (firstDelimiterIndex === -1 || message.slice(0, firstDelimiterIndex) !== connectionRequestMsg) {
    throw new Error('Invalid connection message');
  }

  const scope = message.slice(firstDelimiterIndex + 1);
  return scope;
};
