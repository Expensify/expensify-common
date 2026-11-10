/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.expensify.com/"}
 */
import $ from 'jquery';
import Iframify from '../lib/jquery.expensifyIframify';

function sendMessage(origin, data) {
    window.dispatchEvent(new MessageEvent('message', {origin, data}));
}

describe('expensifyIframify', () => {
    const receivedMessages = [];

    beforeAll(() => {
        Iframify.load($);
        document.body.innerHTML = '<iframe id="secureFrame"></iframe>';
        $('#secureFrame').expensifyIframeify('on', 'say', (data) => receivedMessages.push(data));
    });

    beforeEach(() => {
        receivedMessages.length = 0;
    });

    test('accepts messages from an origin allowed to talk to this page', () => {
        sendMessage('https://secure.expensify.com', 'iframeify:secureFrame:say☢{"msg":"hello"}');
        sendMessage('https://www.expensify.com', 'iframeify:secureFrame:say☢{"msg":"hi"}');
        expect(receivedMessages).toEqual([{msg: 'hello'}, {msg: 'hi'}]);
    });

    test('rejects messages from a listed origin that is not allowed to talk to this page', () => {
        sendMessage('https://cdn.plaid.com', 'iframeify:secureFrame:say☢{"msg":"hello"}');
        sendMessage('https://www.google.com', 'iframeify:secureFrame:say☢{"msg":"hello"}');
        expect(receivedMessages).toEqual([]);
    });

    test('rejects messages from an origin that is not listed', () => {
        sendMessage('https://evil.example.com', 'iframeify:secureFrame:say☢{"msg":"<img src=x onerror=alert(1)>"}');
        expect(receivedMessages).toEqual([]);
    });

    test('rejects messages from the null origin', () => {
        sendMessage('null', 'iframeify:secureFrame:say☢{"msg":"hello"}');
        expect(receivedMessages).toEqual([]);
    });

    test('rejects messages from origins matching Object.prototype keys', () => {
        sendMessage('constructor', 'iframeify:secureFrame:say☢{"msg":"hello"}');
        sendMessage('__proto__', 'iframeify:secureFrame:say☢{"msg":"hello"}');
        expect(receivedMessages).toEqual([]);
    });
});
