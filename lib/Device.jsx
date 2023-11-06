import {UAParser} from 'ua-parser-js';

function getOSAndName() {
    const parser = new UAParser();
    const result = parser.getResult();
    return {
        os: result.os.name,
        osVersion: result.os.version,
        deviceName: result.browser.name,
        deviceVersion: result.browser.version,
    };
}

export {
    // eslint-disable-next-line import/prefer-default-export
    getOSAndName,
};
