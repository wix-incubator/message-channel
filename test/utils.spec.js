import {expect} from 'chai';
import {constructConnectionMessage, parseConnectionMessage} from '../src/utils';
import {connectionRequestMsg, messageDelimiter as delimiter} from '../src/constants';

describe('utils', () => {
  describe('constructMessage', () => {
    const mockScope = 'scopy';
    const mockConstructedMessage = connectionRequestMsg + delimiter + mockScope;

    it('should construct a message when a scope supplied', () => {
      expect(constructConnectionMessage(mockScope)).to.equal(mockConstructedMessage);
    });
  });

  describe('parseMessage', () => {
    const mockScope = 'scopy';
    const mockConstructedMessage = connectionRequestMsg + delimiter + mockScope;

    it('should parse a connection message and return a scope', () => {
      expect(parseConnectionMessage(mockConstructedMessage)).to.equal(mockScope);
    });
  });
});
