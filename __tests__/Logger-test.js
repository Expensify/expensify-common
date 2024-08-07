import Logger from '../lib/Logger';

const mockServerLoggingCallback = jest.fn();
const mockClientLoggingCallback = jest.fn();

const Log = new Logger({
    serverLoggingCallback: mockServerLoggingCallback,
    clientLoggingCallback: mockClientLoggingCallback,
});

const DebugLog = new Logger({
    serverLoggingCallback: mockServerLoggingCallback,
    clientLoggingCallback: mockClientLoggingCallback,
    isDebug: true,
});

test('Test Log.info()', () => {
    Log.info('Test1', false);
    expect(mockServerLoggingCallback).toHaveBeenCalledTimes(0);
    Log.info('Test2', true);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
    const packet = JSON.parse(mockServerLoggingCallback.mock.calls[0][1].logPacket);
    delete packet[0].timestamp;
    delete packet[1].timestamp;
    expect(packet).toEqual([
        {message: "[info] Test1", parameters: "",},
        {message: "[info] Test2", parameters: "",},
    ]);

    // Test the case where `isDebug` is `true` in `Log` instance and we pass `extraData` parameter
    DebugLog.info('Test2', false, {test: 'test'}, false, {test: 'test'});
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockClientLoggingCallback).toHaveBeenCalledWith('[info] Test2 - {"test":"test"}', {test: 'test'});
});

test('Test Log.alert()', () => {
    mockServerLoggingCallback.mockClear();
    Log.alert('Test2', {}, false);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
    const packet = JSON.parse(mockServerLoggingCallback.mock.calls[0][1].logPacket);
    delete packet[0].timestamp;
    expect(packet).toEqual([{message: "[alrt] Test2", parameters: {}}]);
});

test('Test Log.warn()', () => {
    mockServerLoggingCallback.mockClear();
    Log.warn('Test2');
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
    const packet = JSON.parse(mockServerLoggingCallback.mock.calls[0][1].logPacket);
    delete packet[0].timestamp;
    expect(packet).toEqual([{message: "[warn] Test2", parameters: ''}]);
});

test('Test Log.hmmm()', () => {
    mockServerLoggingCallback.mockClear();
    Log.hmmm('Test');
    Log.info('Test', true);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
            api_setCookie: false,
            logPacket: expect.any(String),
        })
    );
    const packet = JSON.parse(mockServerLoggingCallback.mock.calls[0][1].logPacket);
    delete packet[0].timestamp;
    delete packet[1].timestamp;
    expect(packet).toEqual([
        {message: "[hmmm] Test", parameters: ''},
        {message: "[info] Test", parameters: ''}
    ]);
});

test('Test Log.client()', () => {
    Log.client('Test');
    expect(mockClientLoggingCallback).toHaveBeenCalled();
    expect(mockClientLoggingCallback).toHaveBeenCalledWith('Test', '');
});
