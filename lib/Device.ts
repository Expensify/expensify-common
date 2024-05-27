import {UAParser} from 'ua-parser-js';

type DeviceInfo = {
    os: string | undefined;
    osVersion: string | undefined;
    deviceName: string | undefined;
    deviceVersion: string | undefined;
};

function getOSAndName(): DeviceInfo {
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
