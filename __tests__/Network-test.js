import Network from '../lib/Network';

describe('Network.keepalive', () => {
    beforeEach(() => {
        window.fetch = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        delete window.fetch;
    });

    it('puts the command in the URL path and not in the body', () => {
        Network('/api/').keepalive({command: 'ChatBot_ExitChats', chatIDs: [1, 2]});

        const [url, settings] = window.fetch.mock.calls[0];
        expect(url).toBe('/api/ChatBot_ExitChats');
        expect(settings.body.has('command')).toBe(false);
        expect(settings.body.get('chatIDs[0]')).toBe('1');
        expect(settings.keepalive).toBe(true);
    });

    it('adds the missing / to the endpoint and never sends the command in the body', () => {
        Network('/api').keepalive({command: 'ChatBot_ExitChats'});

        const [url, settings] = window.fetch.mock.calls[0];
        expect(url).toBe('/api/ChatBot_ExitChats');
        expect(settings.body.has('command')).toBe(false);
    });
});
