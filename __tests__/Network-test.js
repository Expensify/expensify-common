import Network from '../lib/Network';

describe('Network.keepalive', () => {
    beforeEach(() => {
        window.fetch = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        delete window.fetch;
    });

    it('puts the command in the URL path and not in the body when the endpoint ends in /', () => {
        Network('/api/').keepalive({command: 'ChatBot_ExitChats', chatIDs: [1, 2]});

        const [url, settings] = window.fetch.mock.calls[0];
        expect(url).toBe('/api/ChatBot_ExitChats');
        expect(settings.body.has('command')).toBe(false);
        expect(settings.body.get('chatIDs[0]')).toBe('1');
        expect(settings.keepalive).toBe(true);
    });

    it('puts the command in the query string and the body when the endpoint does not end in /', () => {
        Network('/api.php').keepalive({command: 'ChatBot_ExitChats'});

        const [url, settings] = window.fetch.mock.calls[0];
        expect(url).toBe('/api.php?&command=ChatBot_ExitChats');
        expect(settings.body.get('command')).toBe('ChatBot_ExitChats');
    });
});
