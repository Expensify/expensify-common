import {UAParser} from 'ua-parser-js';

function getOSAndName() {
    const parser = new UAParser();
    const result = parser.getResult();
    return {
        os: result.os.name,
        os_version: result.os.version,
        device_name: result.browser.name,
        device_version: result.browser.version,
    };
}

export {
    // eslint-disable-next-line import/prefer-default-export
    getOSAndName,
};
