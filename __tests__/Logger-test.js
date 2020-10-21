import Logger from '../lib/Logger';

const loggingCallback = jest.fn();

const Log = new Logger({
    loggingCallback,
});

test('Test Log.info()', () => {
    Log.info('Test', true);
    expect(loggingCallback).toHaveBeenCalled();
    expect(loggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[info] Test',
    });
});

test('Test Log.alert()', () => {
    Log.alert('Test', 0, {}, false);
    expect(loggingCallback).toHaveBeenCalled();
    expect(loggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[alrt] Test',
    });
});

test('Test Log.warn()', () => {
    Log.warn('Test', 0);
    expect(loggingCallback).toHaveBeenCalled();
    expect(loggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[warn] Test',
    });
});

test('Test Log.hmmm()', () => {
    Log.hmmm('Test', 0);
    expect(loggingCallback).toHaveBeenCalled();
    expect(loggingCallback).toHaveBeenCalledWith({
        parameters: {},
        api_setCookie: false,
        message: '[hmmm] Test',
    });
});
