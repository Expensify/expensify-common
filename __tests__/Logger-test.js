import Logger from '../lib/Logger';

const mockServerLoggingCallback = jest.fn();
const mockClientLoggingCallback = jest.fn();

const Log = new Logger({
    serverLoggingCallback: mockServerLoggingCallback,
    clientLoggingCallback: mockClientLoggingCallback,
});

test('Test Log.info()', () => {
    Log.info('Test', true);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[info] Test',
    });
});

test('Test Log.alert()', () => {
    Log.alert('Test', 0, {}, false);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[alrt] Test',
    });
});

test('Test Log.warn()', () => {
    Log.warn('Test', 0);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[warn] Test',
    });
});

test('Test Log.hmmm()', () => {
    Log.hmmm('Test', 0);
    expect(mockServerLoggingCallback).toHaveBeenCalled();
    expect(mockServerLoggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[hmmm] Test',
    });
});

test('Test Log.client()', () => {
    Log.client('Test');
    expect(mockClientLoggingCallback).toHaveBeenCalled();
    expect(mockClientLoggingCallback).toHaveBeenCalledWith('Test');
});
