import Logger from '../lib/Logger';

const mockServerLoggingCallback = jest.fn();
const mockClientLoggingCallback = jest.fn();

const Log = new Logger({
    serverLoggingCallback: mockServerLoggingCallback,
    clientLoggingCallback: mockClientLoggingCallback,
});

test('Test Log.info()', () => {
    Log.info('Test1', true);
    Log.info('Test2', true);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        api_setCookie: false,
        logPacket: [
            {parameters: {}, message: '[info] Test1'},
            {parameters: {}, message: '[info] Test2'},
        ],
    });
});

test('Test Log.alert()', () => {
    Log.alert('Test1', true);
    Log.alert('Test2', {}, false);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        api_setCookie: false,
        logPacket: [
            {parameters: {}, message: '[alrt] Test1'},
            {parameters: {}, message: '[alrt] Test2'},
        ],
    });
});

test('Test Log.warn()', () => {
    Log.warn('Test1', true);
    Log.warn('Test2');
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        api_setCookie: false,
        logPacket: [
            {parameters: {}, message: '[warn] Test1'},
            {parameters: {}, message: '[warn] Test2'},
        ],
    });
});

test('Test Log.hmmm()', () => {
    Log.hmmm('Test');
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        api_setCookie: false,
        logPacket: [
            {parameters: {}, message: '[hmmm] Test1'},
            {parameters: {}, message: '[hmmm] Test2'},
        ],
    });
});

test('Test Log.client()', () => {
    Log.client('Test');
    expect(mockClientLoggingCallback).toHaveBeenCalled();
    expect(mockClientLoggingCallback).toHaveBeenCalledWith('Test');
});
