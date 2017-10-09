# message-channel
> request and response abstraction for message channel

The best communication method between an iframe and the main frame is through [Channel messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API).

[![Build Status](https://travis-ci.org/wix/message-channel.svg?branch=master)](https://travis-ci.org/wix/message-channel)
## TLDR
Use this library for fast and performant communication between frames which uses message channel api underneath the hood.
__________________________________________________

### why do i need it ?
let's say we want to have few iframes which need to communicate with the main frame.

#### usualy we'll need to:
* Listen to post messages from the main frame.
* Create a message channel from the iframe side.
* Send a post message with one of the ports to the main frame.
* Get the message from the iframe and register a callback to messages from the channel.
* Be able to fit the main frame replies to the requests from the iframe.

#### with message-channel

```js
// on the main frame
import listenerMessageChannel from 'message-channel/listener';

// the listener will call the onMessage callback everytime a connection is being established.

listenerMessageChannel('scope-name', onMessage => {
  onMessage((message, reply) =>
    reply(message + ' world')
  );
});
```

```js
// on the iframe
import connectMessageChannel from 'message-channel/connect';

// Establish a connection with the main frame and send messages.
const send = await connectMessageChannel('scope-name');

send('hello')
  .then(reply => console.log(reply)); // 'hello world'
```

## Installation

### use a scipt tag and import the bundle
```html
<!-- add this on the main frame -->
<script src="node_modules/message-channel/dist/statics/listener.bundle.min.js" />
<script> window.listenerMessageChannel(); // function will be available </script>
```

```html
<!-- add this on the iframe -->
<script src="node_modules/message-channel/dist/statics/listener.bundle.min.js" />
<script> window.connectMessageChannel(); // function will be available </script>
```

### you can also use npm

```bash
npm i --save message-channel
```

### or yarn

```bash
yarn add message-channel
```

## basic usage

**scope** - A scope is way to differentiate between two or more message-channels in the same application. (**it has to be the same on both listener and connect**)

## methods

### connectMessageChannel(scope: `string`, options: `object`): reply: `string`

* targetOrigin = `string` ([target origin for the connection post message](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)) = '*',
* connectionMaxTimeout: `number` (ms) = 200
* messageMaxTimeout: `number` (ms) = 6000

### listenerMessageChannel(scope: `string`, onMessage: `function`): `void`

```js
onMessage((message: `string`, reply: `function`) => {
  reply('response'); // will return a reply with the argument value (value must be serializable)
});
```
