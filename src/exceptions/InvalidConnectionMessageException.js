export default class InvalidConnectionMessageException extends Error {
  constructor() {
    super('Invalid connection message');
  }
}
