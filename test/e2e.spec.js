import {expect} from 'chai';
import puppeteer from 'puppeteer';
import {deafultConnectionMaxTimeout} from '../src/constants';
import {wait} from './test-utils';

const getFrame = page => {
  return page.mainFrame().childFrames()[0];
};

function performConnectionToListener(page) {
  return page.evaluate(`
    window.connectMessageChannel('test-scope')
      .then(() => {
        const text = window.document.createTextNode('SUCCESS');
        window.document.querySelector('#result').appendChild(text);
      })
      .catch(() => {
        const text = window.document.createTextNode('FAILURE');
        window.document.querySelector('#result').appendChild(text);
      });`
  );
}

function getResultInnerHtml(page) {
  return page.$eval('#result', el => el.innerHTML);
}

function cleanResultDiv(page) {
  return page.$eval('#result', el => {
    return el.innerHTML = '';
  });
}

describe('e2e', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
    page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto(`http://localhost:3000`); // open index.html
    const frame = getFrame(page);
    await cleanResultDiv(frame);
  });

  after(async () => {
    await browser.close();
  });

  describe('connection', () => {
    it('should connect successfully when there is a listener on the same scope', async () => {
      await page.evaluate(`window.listenerMessageChannel('test-scope');`);
      const frame = getFrame(page);
      await performConnectionToListener(frame);
      await wait(deafultConnectionMaxTimeout);
      const resultElement = await getResultInnerHtml(frame);
      expect(resultElement).to.be.equal('SUCCESS');
    });

    it('should fail to connect when there is a listener on a different scope', async () => {
      await page.evaluate(`window.listenerMessageChannel('different-scope');`);
      const frame = getFrame(page);
      await performConnectionToListener(frame);
      await wait(deafultConnectionMaxTimeout);
      const resultElement = await getResultInnerHtml(frame);
      expect(resultElement).to.be.equal('FAILURE');
    });
  });

  describe('after a successfull connection', () => {
    it('should send a post message through the port channel and get a promise with the response', async () => {

      await page.evaluate(`window.listenerMessageChannel('test-scope', listen => {
        listen((message, replay) => {
          replay(message + 'CESS');
        });
      });`);

      const frame = getFrame(page);

      await frame.evaluate(`window.connectMessageChannel('test-scope')
        .then(send => {
          send('SUC')
            .then(reply => {
              const text = window.document.createTextNode(reply);
              window.document.querySelector('#result').appendChild(text);
            })
            .catch(() => {
              const text = window.document.createTextNode('FAILURE');
              window.document.querySelector('#result').appendChild(text);
            });
      })`);

      await wait(deafultConnectionMaxTimeout);
      const resultElement = await getResultInnerHtml(frame);
      expect(resultElement).to.be.equal('SUCCESS');
    });

    it('should send a post message through the port channel and get a rejected promise when there is no response', async () => {
      await page.evaluate(`window.listenerMessageChannel('test-scope', listen => {
              listen((message, replay) => {
                // no response
              });
            });`);

      const frame = getFrame(page);

      await frame.evaluate(`window.connectMessageChannel('test-scope', {messageMaxTimeout: 20})
        .then(send => {
          send('SUC')
            .then(reply => {
              const text = window.document.createTextNode(reply);
              window.document.querySelector('#result').appendChild(text);
            })
            .catch((e) => {
              const text = window.document.createTextNode(e);
              window.document.querySelector('#result').appendChild(text);
            });
      })`);

      await wait(40);
      const resultElement = await getResultInnerHtml(frame);
      expect(resultElement).to.be.equal('Error: max timeout of 20ms exceeded');
    });
  });
});
