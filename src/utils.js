import assert from 'assert';
import {connectionRequestMsg, messageDelimiter} from './constants';
import InvalidConnectionMessageException from './exceptions/InvalidConnectionMessageException';

export const constructChannelMessage = (payload, id) => {
  assert(payload && typeof payload === 'string');
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
  assert(scope && typeof scope === 'string');
  return connectionRequestMsg + messageDelimiter + scope;
};

export const parseConnectionMessage = message => {
  const firstDelimiterIndex = message.indexOf(messageDelimiter);
  if (firstDelimiterIndex === -1 || message.slice(0, firstDelimiterIndex) !== connectionRequestMsg) {
    throw new InvalidConnectionMessageException();
  }

  const scope = message.slice(firstDelimiterIndex + 1);
  return scope;
};
