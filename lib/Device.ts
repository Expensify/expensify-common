import {UAParser} from 'ua-parser-js';

type DeviceInfo = {
    os: string | undefined;
    osVersion: string | undefined;
    deviceName: string | undefined;
    deviceVersion: string | undefined;
};

function getOSAndName(): DeviceInfo {
    const parser = new UAParser();
    const {browser, os} = parser.getResult();

    let osVersion = os.version;
    if (browser.name === 'Mobile Safari' && browser.major === '26' && os.name === 'iOS' && os.version === '18.6') {
        osVersion = '26';
    }

    return {
        os: os.name,
        osVersion,
        deviceName: browser.name,
        deviceVersion: browser.version,
    };
}

export {
    // eslint-disable-next-line import/prefer-default-export
    getOSAndName,
};
