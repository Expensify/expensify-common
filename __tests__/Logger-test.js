import Logger from '../lib/Logger';

const mockServerLoggingCallback = jest.fn();
const mockClientLoggingCallback = jest.fn();

const Log = new Logger({
    serverLoggingCallback: mockServerLoggingCallback,
    clientLoggingCallback: mockClientLoggingCallback,
});

test('Test Log.info()', () => {
    Log.info('Test1', false);
    expect(mockServerLoggingCallback).toHaveBeenCalledTimes(0);
    Log.info('Test2', true);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
});

test('Test Log.alert()', () => {
    Log.alert('Test2', {}, false);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
});

test('Test Log.warn()', () => {
    Log.warn('Test2');
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
});

test('Test Log.hmmm()', () => {
    Log.hmmm('Test');
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
});

test('Test Log.client()', () => {
    Log.client('Test');
    expect(mockClientLoggingCallback).toHaveBeenCalled();
    expect(mockClientLoggingCallback).toHaveBeenCalledWith('Test');
});
